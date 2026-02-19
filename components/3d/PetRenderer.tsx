"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Float, Sparkles, useGLTF } from "@react-three/drei";
import type { CharacterAction } from "./JuniorPhysicist";

// ─── Types ───
export type PetType = "aqua_cat" | "flame_fox" | "spark_owl" | string;

interface PetRendererProps {
    type: PetType;
    action?: CharacterAction;
}

// ─── GLB Pet Models mapping ───
const PET_GLB_MAP: Record<string, string> = {
    pet_fluida: "/models/pet_fluida.glb",
    pet_kalor: "/models/pet_kalor.glb",
    pet_thermo: "/models/pet_thermo.glb",
    // Fallback mapping from new pet names
    aqua_cat: "/models/pet_fluida.glb",
};

// Check which GLB pets exist
try { useGLTF.preload("/models/pet_fluida.glb"); } catch (e) { }

// ─── Pet Themes (for procedural fallback) ───
const PET_THEMES: Record<string, {
    body: string; accent: string; eyes: string; nose: string;
    innerEar: string; glow: string; particle: string;
}> = {
    aqua_cat: {
        body: "#ffffff", accent: "#bae6fd", eyes: "#0ea5e9", nose: "#fda4af",
        innerEar: "#fecdd3", glow: "#38bdf8", particle: "#60a5fa",
    },
    flame_fox: {
        body: "#f97316", accent: "#fef3c7", eyes: "#dc2626", nose: "#1c1917",
        innerEar: "#fca5a5", glow: "#ef4444", particle: "#fb923c",
    },
    spark_owl: {
        body: "#fbbf24", accent: "#fef9c3", eyes: "#7c3aed", nose: "#92400e",
        innerEar: "#ddd6fe", glow: "#a78bfa", particle: "#c084fc",
    },
};

function resolveTheme(type: string) {
    const lower = type.toLowerCase();
    if (lower.includes("aqua") || lower.includes("cat") || lower.includes("fluida")) return PET_THEMES.aqua_cat;
    if (lower.includes("flame") || lower.includes("fox") || lower.includes("kalor")) return PET_THEMES.flame_fox;
    if (lower.includes("spark") || lower.includes("owl") || lower.includes("thermo")) return PET_THEMES.spark_owl;
    return PET_THEMES.aqua_cat;
}

function resolvePetShape(type: string): "cat" | "fox" | "owl" {
    const lower = type.toLowerCase();
    if (lower.includes("fox") || lower.includes("flame") || lower.includes("kalor")) return "fox";
    if (lower.includes("owl") || lower.includes("spark") || lower.includes("thermo")) return "owl";
    return "cat";
}

// Resolve GLB path if model exists
function resolveGLBPath(type: string): string | null {
    const lower = type.toLowerCase();
    for (const [key, path] of Object.entries(PET_GLB_MAP)) {
        if (lower.includes(key)) return path;
    }
    return null;
}

// ─── GLB Pet Renderer ───
function GLBPet({ modelPath, action = "idle" }: { modelPath: string; action: CharacterAction }) {
    const { scene } = useGLTF(modelPath);
    const ref = useRef<THREE.Group>(null);

    const cloned = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((child: any) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map((m: THREE.Material) => {
                            const c = m.clone();
                            c.needsUpdate = true;
                            return c;
                        });
                    } else {
                        child.material = child.material.clone();
                        child.material.needsUpdate = true;
                    }
                }
            }
        });
        return clone;
    }, [scene]);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime();

        ref.current.position.y = 0;
        ref.current.rotation.set(0, 0, 0);

        switch (action) {
            case "idle":
                ref.current.position.y = Math.sin(t * 1.2) * 0.03;
                ref.current.rotation.y = Math.sin(t * 0.4) * 0.1;
                break;
            case "cheer":
                ref.current.position.y = Math.abs(Math.sin(t * 5)) * 0.1;
                ref.current.rotation.y = Math.sin(t * 3) * 0.2;
                break;
            case "think":
                ref.current.rotation.z = Math.sin(t * 0.8) * 0.15;
                break;
            case "celebrate":
                ref.current.rotation.y = t * 2;
                ref.current.position.y = Math.abs(Math.sin(t * 4)) * 0.12;
                break;
            case "sad":
                ref.current.position.y = -0.03;
                ref.current.rotation.x = 0.12;
                break;
            case "wave":
                ref.current.rotation.z = Math.sin(t * 2.5) * 0.2;
                break;
        }
    });

    return (
        <group ref={ref}>
            <primitive object={cloned} scale={0.5} />
        </group>
    );
}

// ─── Procedural Pet Sub-components ───

function PetEye({ position, color, size = 0.06 }: { position: [number, number, number]; color: string; size?: number }) {
    return (
        <group position={position}>
            <mesh><sphereGeometry args={[size, 16, 16]} /><meshBasicMaterial color="#ffffff" /></mesh>
            <mesh position={[0, 0, size * 0.85]}><circleGeometry args={[size * 0.7, 16]} /><meshBasicMaterial color={color} /></mesh>
            <mesh position={[0, 0, size * 0.9]}><circleGeometry args={[size * 0.35, 12]} /><meshBasicMaterial color="#1a1a1a" /></mesh>
            <mesh position={[size * 0.3, size * 0.3, size * 0.95]}><circleGeometry args={[size * 0.22, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
        </group>
    );
}

function CatBody({ theme }: { theme: typeof PET_THEMES.aqua_cat }) {
    const tailRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * 2) * 0.4;
    });
    return (
        <group>
            <mesh><capsuleGeometry args={[0.2, 0.25, 12, 24]} /><meshToonMaterial color={theme.body} /></mesh>
            <mesh position={[0, -0.1, 0.18]}><sphereGeometry args={[0.14, 12, 12]} /><meshToonMaterial color={theme.accent} /></mesh>
            <group position={[0, 0.35, 0]}>
                <mesh><sphereGeometry args={[0.28, 24, 24]} /><meshToonMaterial color={theme.body} /></mesh>
                <mesh position={[0, -0.06, 0.22]}><sphereGeometry args={[0.12, 12, 12]} /><meshToonMaterial color="#fff" /></mesh>
                <mesh position={[0, -0.04, 0.3]}><sphereGeometry args={[0.04, 8, 8]} /><meshToonMaterial color={theme.nose} /></mesh>
                <PetEye position={[-0.1, 0.05, 0.2]} color={theme.eyes} />
                <PetEye position={[0.1, 0.05, 0.2]} color={theme.eyes} />
                <mesh position={[0, -0.1, 0.26]}><torusGeometry args={[0.05, 0.01, 8, 12, Math.PI]} /><meshToonMaterial color="#9b7b73" /></mesh>
                {/* Ears */}
                <group position={[-0.16, 0.2, 0]} rotation={[0, 0, -0.3]}>
                    <mesh><coneGeometry args={[0.1, 0.16, 24]} /><meshToonMaterial color={theme.body} /></mesh>
                    <mesh scale={0.55}><coneGeometry args={[0.1, 0.16, 24]} /><meshToonMaterial color={theme.innerEar} /></mesh>
                </group>
                <group position={[0.16, 0.2, 0]} rotation={[0, 0, 0.3]}>
                    <mesh><coneGeometry args={[0.1, 0.16, 24]} /><meshToonMaterial color={theme.body} /></mesh>
                    <mesh scale={0.55}><coneGeometry args={[0.1, 0.16, 24]} /><meshToonMaterial color={theme.innerEar} /></mesh>
                </group>
            </group>
            {[[-0.12, -0.22, 0.1], [0.12, -0.22, 0.1], [-0.1, -0.22, -0.12], [0.1, -0.22, -0.12]].map(([x, y, z], i) => (
                <mesh key={i} position={[x, y, z]}><capsuleGeometry args={[0.05, 0.12, 6, 12]} /><meshToonMaterial color={theme.body} /></mesh>
            ))}
            <group ref={tailRef} position={[0, 0, -0.28]}>
                <mesh rotation={[0.5, 0, 0]}><capsuleGeometry args={[0.06, 0.3, 6, 12]} /><meshToonMaterial color={theme.body} /></mesh>
                <mesh position={[0, 0.22, -0.08]}><sphereGeometry args={[0.08, 8, 8]} /><meshToonMaterial color={theme.accent} /></mesh>
            </group>
        </group>
    );
}

function FoxBody({ theme }: { theme: typeof PET_THEMES.aqua_cat }) {
    const tailRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * 1.8) * 0.5;
    });
    return (
        <group>
            <mesh><capsuleGeometry args={[0.18, 0.3, 12, 24]} /><meshToonMaterial color={theme.body} /></mesh>
            <mesh position={[0, -0.12, 0.15]}><sphereGeometry args={[0.12, 12, 12]} /><meshToonMaterial color={theme.accent} /></mesh>
            <group position={[0, 0.38, 0]}>
                <mesh><sphereGeometry args={[0.25, 24, 24]} /><meshToonMaterial color={theme.body} /></mesh>
                <mesh position={[0, -0.08, 0.22]} rotation={[Math.PI + 0.2, 0, 0]}><coneGeometry args={[0.08, 0.15, 12]} /><meshToonMaterial color={theme.body} /></mesh>
                <mesh position={[0, -0.06, 0.32]}><sphereGeometry args={[0.035, 8, 8]} /><meshToonMaterial color={theme.nose} /></mesh>
                <PetEye position={[-0.1, 0.05, 0.18]} color={theme.eyes} size={0.055} />
                <PetEye position={[0.1, 0.05, 0.18]} color={theme.eyes} size={0.055} />
                <mesh position={[-0.14, 0.22, 0]} rotation={[0.1, 0, -0.2]}><coneGeometry args={[0.08, 0.22, 16]} /><meshToonMaterial color={theme.body} /></mesh>
                <mesh position={[-0.14, 0.22, 0]} rotation={[0.1, 0, -0.2]} scale={0.5}><coneGeometry args={[0.08, 0.22, 16]} /><meshToonMaterial color={theme.innerEar} /></mesh>
                <mesh position={[0.14, 0.22, 0]} rotation={[0.1, 0, 0.2]}><coneGeometry args={[0.08, 0.22, 16]} /><meshToonMaterial color={theme.body} /></mesh>
                <mesh position={[0.14, 0.22, 0]} rotation={[0.1, 0, 0.2]} scale={0.5}><coneGeometry args={[0.08, 0.22, 16]} /><meshToonMaterial color={theme.innerEar} /></mesh>
            </group>
            {[[-0.1, -0.25, 0.08], [0.1, -0.25, 0.08], [-0.08, -0.25, -0.1], [0.08, -0.25, -0.1]].map(([x, y, z], i) => (
                <mesh key={i} position={[x, y, z]}><capsuleGeometry args={[0.045, 0.14, 6, 12]} /><meshToonMaterial color={theme.body} /></mesh>
            ))}
            <group ref={tailRef} position={[0, 0.05, -0.25]}>
                <mesh rotation={[0.6, 0, 0]}><capsuleGeometry args={[0.1, 0.35, 8, 16]} /><meshToonMaterial color={theme.body} /></mesh>
                <mesh position={[0, 0.28, -0.12]}><sphereGeometry args={[0.12, 8, 8]} /><meshToonMaterial color={theme.accent} /></mesh>
            </group>
        </group>
    );
}

function OwlBody({ theme, action }: { theme: typeof PET_THEMES.aqua_cat; action: CharacterAction }) {
    const wingLRef = useRef<THREE.Mesh>(null);
    const wingRRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const flap = action === "cheer" || action === "celebrate" ? Math.sin(t * 8) * 0.4 : Math.sin(t * 1.5) * 0.1;
        if (wingLRef.current) wingLRef.current.rotation.z = -0.3 + flap;
        if (wingRRef.current) wingRRef.current.rotation.z = 0.3 - flap;
    });
    return (
        <group>
            <mesh><sphereGeometry args={[0.22, 24, 24]} /><meshToonMaterial color={theme.body} /></mesh>
            <mesh position={[0, 0, 0.15]}><sphereGeometry args={[0.16, 12, 12]} /><meshToonMaterial color={theme.accent} /></mesh>
            <group position={[0, 0.35, 0]}>
                <mesh><sphereGeometry args={[0.24, 24, 24]} /><meshToonMaterial color={theme.body} /></mesh>
                <PetEye position={[-0.1, 0.02, 0.18]} color={theme.eyes} size={0.08} />
                <PetEye position={[0.1, 0.02, 0.18]} color={theme.eyes} size={0.08} />
                <mesh position={[-0.1, 0.02, 0.17]}><torusGeometry args={[0.09, 0.012, 8, 24]} /><meshToonMaterial color={theme.accent} /></mesh>
                <mesh position={[0.1, 0.02, 0.17]}><torusGeometry args={[0.09, 0.012, 8, 24]} /><meshToonMaterial color={theme.accent} /></mesh>
                <mesh position={[0, -0.06, 0.22]} rotation={[Math.PI + 0.3, 0, 0]}><coneGeometry args={[0.04, 0.08, 3]} /><meshToonMaterial color={theme.nose} /></mesh>
                <mesh position={[-0.14, 0.22, 0]} rotation={[0.1, 0, -0.3]}><coneGeometry args={[0.06, 0.15, 8]} /><meshToonMaterial color={theme.body} /></mesh>
                <mesh position={[0.14, 0.22, 0]} rotation={[0.1, 0, 0.3]}><coneGeometry args={[0.06, 0.15, 8]} /><meshToonMaterial color={theme.body} /></mesh>
            </group>
            <mesh ref={wingLRef} position={[-0.22, 0.1, 0]} rotation={[0, 0, -0.3]}><capsuleGeometry args={[0.06, 0.25, 6, 12]} /><meshToonMaterial color={theme.body} /></mesh>
            <mesh ref={wingRRef} position={[0.22, 0.1, 0]} rotation={[0, 0, 0.3]}><capsuleGeometry args={[0.06, 0.25, 6, 12]} /><meshToonMaterial color={theme.body} /></mesh>
            <mesh position={[-0.08, -0.22, 0.06]}><sphereGeometry args={[0.05, 8, 8]} /><meshToonMaterial color={theme.nose} /></mesh>
            <mesh position={[0.08, -0.22, 0.06]}><sphereGeometry args={[0.05, 8, 8]} /><meshToonMaterial color={theme.nose} /></mesh>
        </group>
    );
}

// ─── Main Export ───
export default function PetRenderer({ type, action = "idle" }: PetRendererProps) {
    const groupRef = useRef<THREE.Group>(null);
    const theme = useMemo(() => resolveTheme(type), [type]);
    const shape = useMemo(() => resolvePetShape(type), [type]);
    const glbPath = useMemo(() => resolveGLBPath(type), [type]);

    // Determine if we should try GLB
    const useGLB = glbPath !== null;

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.getElapsedTime();

        // Only apply procedural animations if NOT using GLB
        if (useGLB) return;

        groupRef.current.position.y = 0;
        groupRef.current.rotation.set(0, 0, 0);
        groupRef.current.scale.setScalar(0.35);

        switch (action) {
            case "idle":
                groupRef.current.position.y = Math.sin(t * 1.2) * 0.03;
                groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.1;
                break;
            case "cheer":
                groupRef.current.position.y = Math.abs(Math.sin(t * 5)) * 0.1;
                groupRef.current.rotation.y = Math.sin(t * 3) * 0.2;
                break;
            case "think":
                groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.15;
                groupRef.current.position.y = Math.sin(t * 0.5) * 0.02;
                break;
            case "celebrate":
                groupRef.current.rotation.y = t * 2;
                groupRef.current.position.y = Math.abs(Math.sin(t * 4)) * 0.12;
                break;
            case "sad":
                groupRef.current.position.y = -0.03;
                groupRef.current.rotation.x = 0.12;
                break;
            case "wave":
                groupRef.current.rotation.z = Math.sin(t * 2.5) * 0.2;
                break;
        }
    });

    return (
        <group ref={groupRef} scale={useGLB ? 1 : 0.35}>
            <Float speed={2} rotationIntensity={0.15}>
                {useGLB && glbPath ? (
                    // Use GLB model when available
                    <GLBPet modelPath={glbPath} action={action} />
                ) : (
                    // Fall back to procedural pet
                    <>
                        {shape === "cat" && <CatBody theme={theme} />}
                        {shape === "fox" && <FoxBody theme={theme} />}
                        {shape === "owl" && <OwlBody theme={theme} action={action} />}
                    </>
                )}

                <Sparkles count={12} scale={1} size={1.5} speed={0.3} opacity={0.4} color={theme.particle} />
                {action === "cheer" && <Sparkles count={30} scale={1.5} size={3} speed={1.5} opacity={0.7} color="#34d399" />}
                {action === "celebrate" && <Sparkles count={40} scale={2} size={4} speed={2} opacity={0.8} color="#fbbf24" noise={2} />}
            </Float>

            {!useGLB && (
                <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.3, 24]} />
                    <meshBasicMaterial color="#000" transparent opacity={0.2} />
                </mesh>
            )}
        </group>
    );
}
