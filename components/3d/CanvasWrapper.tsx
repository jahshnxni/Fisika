"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, Preload, Environment, ContactShadows } from "@react-three/drei";

interface CanvasWrapperProps {
    children: React.ReactNode;
    cameraPosition?: [number, number, number];
    fov?: number;
}

export default function CanvasWrapper({
    children,
    cameraPosition = [0, 0, 5],
    fov = 45
}: CanvasWrapperProps) {
    return (
        <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: cameraPosition, fov: fov }}
            gl={{ preserveDrawingBuffer: true, antialias: true, toneMappingExposure: 1.0 }}
            className="w-full h-full"
        >
            <Suspense fallback={null}>
                {/* Environment for Realistic Reflections */}
                <Environment preset="city" />

                {children}

                {/* Contact Shadows */}
                <ContactShadows
                    position={[0, -1.2, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2.5}
                    far={1}
                />

                {/* OrbitControls - ENABLE ZOOM */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={2}
                    maxDistance={8}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.8}
                />
                <Preload all />
            </Suspense>
        </Canvas>
    );
}
