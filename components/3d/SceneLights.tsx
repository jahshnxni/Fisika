"use client";

export default function SceneLights() {
    return (
        <>
            <ambientLight intensity={0.5} color="#ffffff" />
            <directionalLight
                position={[5, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize={[1024, 1024]}
            >
                <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
            </directionalLight>
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4f46e5" />
            <spotLight
                position={[0, 5, 0]}
                angle={0.5}
                penumbra={1}
                intensity={1}
                color="#fbbf24"
            />
        </>
    );
}
