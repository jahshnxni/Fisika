"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Float, Sparkles, useGLTF } from "@react-three/drei";

// ─── Types ───
export type CharacterAction = "idle" | "cheer" | "think" | "celebrate" | "wave" | "sad";

interface JuniorPhysicistProps {
    skin?: string;
    topic?: string;
    action?: CharacterAction;
}

// ─── Constants ───
const MODEL_MAP: Record<string, string> = {
    fluida: "/models/character_fluida.glb",
    tekanan: "/models/character_fluida.glb",
    archimedes: "/models/character_fluida.glb",
    pascal: "/models/character_fluida.glb",
    kalor: "/models/character_kalor.glb",
    suhu: "/models/character_kalor.glb",
    perpindahan: "/models/character_kalor.glb",
    thermo: "/models/character_thermo.glb",
    gas: "/models/character_thermo.glb",
    termodinamika: "/models/character_thermo.glb",
};

const DEFAULT_MODEL = "/models/character_fluida.glb";

const EFFECT_COLORS: Record<string, { primary: string; secondary: string }> = {
    "/models/character_fluida.glb": { primary: "#60a5fa", secondary: "#3b82f6" },
    "/models/character_kalor.glb": { primary: "#fb923c", secondary: "#dc2626" },
    "/models/character_thermo.glb": { primary: "#a78bfa", secondary: "#7c3aed" },
};

// ─── Preload all models ───
try { useGLTF.preload("/models/character_fluida.glb"); } catch (e) { }
try { useGLTF.preload("/models/character_kalor.glb"); } catch (e) { }
try { useGLTF.preload("/models/character_thermo.glb"); } catch (e) { }

// ─── Helper: pick model path from topic ───
function resolveModelPath(topic?: string, skin?: string): string {
    if (topic) {
        const lower = topic.toLowerCase();
        for (const [keyword, path] of Object.entries(MODEL_MAP)) {
            if (lower.includes(keyword)) return path;
        }
    }
    if (skin) {
        const lower = skin.toLowerCase();
        if (lower.includes("fluida")) return "/models/character_fluida.glb";
        if (lower.includes("kalor")) return "/models/character_kalor.glb";
        if (lower.includes("thermo")) return "/models/character_thermo.glb";
    }
    return DEFAULT_MODEL;
}

// ─── Inner GLB renderer ───
function GLBCharacter({
    modelPath,
    action = "idle",
    scale = 1,
}: {
    modelPath: string;
    action: CharacterAction;
    scale?: number;
}) {
    const { scene } = useGLTF(modelPath);
    const ref = useRef<THREE.Group>(null);

    // Deep clone the scene so each instance is independent
    const cloned = useMemo(() => {
        const clone = scene.clone(true);

        // Traverse and fix materials: ensure proper rendering
        clone.traverse((child: any) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                // If material exists, make sure it renders properly
                if (child.material) {
                    // Clone material to avoid shared material issues
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map((m: THREE.Material) => {
                            const clonedMat = m.clone();
                            clonedMat.needsUpdate = true;
                            return clonedMat;
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

        // Reset transforms
        ref.current.position.y = 0;
        ref.current.rotation.set(0, 0, 0);
        ref.current.scale.setScalar(scale);

        switch (action) {
            case "idle":
                ref.current.position.y = Math.sin(t * 0.8) * 0.04;
                ref.current.rotation.y = Math.sin(t * 0.3) * 0.08;
                break;
            case "cheer":
                ref.current.position.y = Math.abs(Math.sin(t * 4)) * 0.15;
                ref.current.rotation.y = Math.sin(t * 2) * 0.2;
                ref.current.scale.setScalar(scale + Math.sin(t * 6) * 0.02);
                break;
            case "think":
                ref.current.rotation.z = Math.sin(t * 0.6) * 0.12;
                ref.current.rotation.y = Math.sin(t * 0.4) * 0.05;
                ref.current.position.y = Math.sin(t * 0.5) * 0.02;
                break;
            case "celebrate":
                ref.current.rotation.y = t * 1.5;
                ref.current.position.y = Math.abs(Math.sin(t * 3)) * 0.2;
                ref.current.scale.setScalar(scale + Math.sin(t * 4) * 0.03);
                break;
            case "wave":
                ref.current.rotation.z = Math.sin(t * 2) * 0.15;
                ref.current.position.y = Math.sin(t) * 0.03;
                break;
            case "sad":
                ref.current.position.y = -0.05 + Math.sin(t * 0.4) * 0.01;
                ref.current.rotation.x = 0.1;
                ref.current.rotation.z = Math.sin(t * 0.3) * 0.03;
                ref.current.scale.setScalar(scale * 0.97);
                break;
        }
    });

    return (
        <group ref={ref}>
            <primitive object={cloned} scale={scale} />
        </group>
    );
}

// ─── Main Export ───
export default function JuniorPhysicist({
    skin = "default_junior",
    topic,
    action = "idle",
}: JuniorPhysicistProps) {
    const groupRef = useRef<THREE.Group>(null);
    const modelPath = useMemo(() => resolveModelPath(topic, skin), [topic, skin]);
    const colors = EFFECT_COLORS[modelPath] || EFFECT_COLORS[DEFAULT_MODEL];

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            <Suspense
                fallback={
                    <mesh position={[0, 0.5, 0]}>
                        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
                        <meshStandardMaterial color="#6366f1" wireframe />
                    </mesh>
                }
            >
                <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.08}>
                    <GLBCharacter modelPath={modelPath} action={action} scale={1} />

                    {/* Ambient sparkles */}
                    <Sparkles count={25} scale={2.5} size={3} speed={0.5} opacity={0.5} color={colors.primary} />
                    {action === "celebrate" && <Sparkles count={60} scale={3} size={6} speed={2} opacity={0.8} color="#fbbf24" noise={2} />}
                    {action === "cheer" && <Sparkles count={40} scale={2} size={5} speed={1.5} opacity={0.7} color="#34d399" />}
                </Float>
            </Suspense>

            {/* Ground shadow */}
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[0.7, 32]} />
                <meshBasicMaterial color="#000" transparent opacity={0.25} />
            </mesh>
        </group>
    );
}
