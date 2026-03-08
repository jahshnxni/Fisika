#!/usr/bin/env python3
"""
workers/manim/render_scene.py
Manim-based math animation renderer for OMNITUTOR OS.

Usage:
  python render_scene.py --storyboard storyboard.json [--output /tmp/out.mp4]

Accepts a VideoStoryboardSchema JSON (from /api/media/plan) and renders
each scene that contains LaTeX formulas using Manim Community Edition.

Deploy as:
  - A sidecar Docker container (Fly.io, Railway)
  - A Cloud Run job triggered via HTTP from lib/media/manim-dispatch.ts
  - A Vercel Sandbox for isolated execution

Requirements:
  pip install manim jinja2 requests
  System: LaTeX (texlive-full), ffmpeg, cairo
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile
import uuid
from pathlib import Path
from typing import Any

try:
    from jinja2 import Environment, FileSystemLoader
except ImportError:
    print("[manim-worker] ERROR: jinja2 not installed. Run: pip install jinja2", file=sys.stderr)
    sys.exit(1)

TEMPLATES_DIR = Path(__file__).parent / "templates"
OUTPUT_DIR = Path(os.environ.get("MANIM_OUTPUT_DIR", "/tmp/manim_output"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ─── Scene classifier ────────────────────────────────────────────────────────

def classify_scene(scene: dict) -> str:
    """Return the best Jinja2 template name for this scene."""
    latex = scene.get("latex", [])
    scene_type = scene.get("type", "step")
    formula_count = len(latex)

    if formula_count >= 3 or scene_type in ("concept", "why-method"):
        return "equation_solution.py.j2"
    if any(kw in " ".join(scene.get("screenText", [])).lower()
           for kw in ("segitiga", "lingkaran", "vektor", "angle", "triangle", "circle")):
        return "geometry_proof.py.j2"
    return "equation_solution.py.j2"


# ─── Scene renderer ──────────────────────────────────────────────────────────

def render_scene(scene: dict, scene_idx: int, fps: int = 30) -> Path:
    """Generate Python source from Jinja2 template and render with Manim CLI."""
    template_name = classify_scene(scene)
    env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)), autoescape=False)

    try:
        template = env.get_template(template_name)
    except Exception as e:
        print(f"[manim-worker] Template not found: {template_name} – {e}", file=sys.stderr)
        template = env.get_template("equation_solution.py.j2")

    class_name = f"Scene{scene_idx:03d}_{uuid.uuid4().hex[:6]}"
    source = template.render(
        scene=scene,
        class_name=class_name,
        fps=fps,
        duration_sec=scene.get("durationSec", 8),
        latex_lines=scene.get("latex", []),
        narration=scene.get("narration", ""),
        screen_text=scene.get("screenText", []),
        focus_cue=scene.get("focusCue", ""),
    )

    # Write temp Python source
    tmp_dir = OUTPUT_DIR / class_name
    tmp_dir.mkdir(parents=True, exist_ok=True)
    src_file = tmp_dir / f"{class_name}.py"
    src_file.write_text(source, encoding="utf-8")

    # Render with Manim CLI
    cmd = [
        sys.executable, "-m", "manim",
        str(src_file), class_name,
        "-o", class_name,
        "--output_file", str(tmp_dir / f"{class_name}.mp4"),
        "--media_dir", str(tmp_dir),
        "--fps", str(fps),
        "-r", "1920,1080",
        "-q", "h",          # high quality
        "--disable_caching",
        "--format", "mp4",
    ]

    print(f"[manim-worker] Rendering scene {scene_idx}: {class_name}")
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    if result.returncode != 0:
        print(f"[manim-worker] STDERR:\n{result.stderr[-1000:]}", file=sys.stderr)
        raise RuntimeError(f"Manim render failed for scene {scene_idx}: {result.stderr[-300:]}")

    # Locate output file (Manim puts it inside media/videos/)
    mp4_candidates = list(tmp_dir.rglob("*.mp4"))
    if not mp4_candidates:
        raise FileNotFoundError(f"Manim produced no MP4 for scene {scene_idx}")
    return mp4_candidates[0]


# ─── Concatenation ──────────────────────────────────────────────────────────

def concatenate_clips(clips: list[Path], output: Path) -> None:
    """Concatenate MP4 clips using ffmpeg concat demuxer."""
    list_file = output.parent / "concat_list.txt"
    with open(list_file, "w") as f:
        for clip in clips:
            f.write(f"file '{clip.resolve()}'\n")
    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(list_file),
        "-c", "copy",
        str(output),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg concat failed: {result.stderr[-400:]}")


# ─── Blob uploader ──────────────────────────────────────────────────────────

def upload_to_blob(mp4_path: Path, blob_token: str, course_id: str) -> str:
    """Upload rendered MP4 to Vercel Blob and return the URL."""
    import urllib.request
    import urllib.parse

    blob_url = f"https://blob.vercel-storage.com/video/{course_id}/{mp4_path.name}"
    req = urllib.request.Request(
        blob_url,
        data=mp4_path.read_bytes(),
        method="PUT",
        headers={
            "Authorization": f"Bearer {blob_token}",
            "Content-Type": "video/mp4",
            "x-vercel-blob-public-access": "true",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read())
        return result["url"]


# ─── Main ───────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Manim storyboard renderer")
    parser.add_argument("--storyboard", required=True, help="Path to VideoStoryboardSchema JSON file")
    parser.add_argument("--output", default=str(OUTPUT_DIR / "final.mp4"), help="Output MP4 path")
    parser.add_argument("--fps", type=int, default=30, help="Frames per second")
    parser.add_argument("--upload", action="store_true", help="Upload to Vercel Blob after render")
    parser.add_argument("--course-id", default="dev", help="Course ID for blob path")
    args = parser.parse_args()

    storyboard_path = Path(args.storyboard)
    if not storyboard_path.exists():
        print(f"[manim-worker] ERROR: Storyboard file not found: {storyboard_path}", file=sys.stderr)
        sys.exit(1)

    with open(storyboard_path, "r", encoding="utf-8") as f:
        storyboard: dict[str, Any] = json.load(f)

    scenes: list[dict] = storyboard.get("scenes", [])
    formula_scenes = [s for s in scenes if s.get("latex")]

    if not formula_scenes:
        print("[manim-worker] No scenes with LaTeX formulas found. Nothing to render.")
        print(json.dumps({"status": "skipped", "reason": "no_latex"}))
        return

    print(f"[manim-worker] Rendering {len(formula_scenes)} formula scenes...")
    clip_paths: list[Path] = []
    for i, scene in enumerate(formula_scenes):
        try:
            clip = render_scene(scene, i, fps=args.fps)
            clip_paths.append(clip)
            print(f"[manim-worker] ✅ Scene {i} → {clip}")
        except Exception as e:
            print(f"[manim-worker] ❌ Scene {i} failed: {e}", file=sys.stderr)

    if not clip_paths:
        print("[manim-worker] ERROR: All scenes failed.", file=sys.stderr)
        sys.exit(1)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if len(clip_paths) == 1:
        import shutil
        shutil.copy(clip_paths[0], output_path)
    else:
        concatenate_clips(clip_paths, output_path)

    print(f"[manim-worker] ✅ Final output: {output_path} ({output_path.stat().st_size // 1024} KB)")

    result_payload: dict[str, Any] = {"status": "completed", "outputPath": str(output_path)}

    if args.upload:
        blob_token = os.environ.get("BLOB_READ_WRITE_TOKEN", "")
        if not blob_token:
            print("[manim-worker] WARNING: BLOB_READ_WRITE_TOKEN not set, skipping upload.")
        else:
            url = upload_to_blob(output_path, blob_token, args.course_id)
            result_payload["outputUrl"] = url
            print(f"[manim-worker] ✅ Uploaded: {url}")

    print(json.dumps(result_payload))


if __name__ == "__main__":
    main()
