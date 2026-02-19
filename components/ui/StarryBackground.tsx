"use client";

import React, { useEffect, useRef } from "react";

const StarryBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let stars: { x: number; y: number; z: number; size: number; alpha: number }[] = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        const initStars = () => {
            stars = [];
            const starCount = Math.floor((width * height) / 2000); // Higher density
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    z: Math.random(), // Depth for parallax
                    size: Math.random() * 1.5,
                    alpha: Math.random(),
                });
            }
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initStars();
        };

        window.addEventListener("resize", resize);
        resize();

        // Mouse interaction
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw Nebula/Gradient Background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, "#020617"); // cosmic-950
            gradient.addColorStop(1, "#0f172a"); // cosmic-900
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Calculate Mouse Parallax
            const cx = width / 2;
            const cy = height / 2;
            const mx = (mouseRef.current.x - cx) * 0.05; // Sensitivity
            const my = (mouseRef.current.y - cy) * 0.05;

            // Draw Stars
            ctx.fillStyle = "white";
            stars.forEach((star) => {
                // Twinkle
                star.alpha += (Math.random() - 0.5) * 0.02;
                if (star.alpha < 0.1) star.alpha = 0.1;
                if (star.alpha > 0.8) star.alpha = 0.8;

                // Parallax Position
                // Far stars (low z) move less, near stars (high z) move more
                const ex = star.x + mx * star.z;
                const ey = star.y + my * star.z;

                // Wrap visually (simple infinite scroll illusion not strictly needed for just parallax jitter)

                ctx.globalAlpha = star.alpha;
                ctx.beginPath();
                ctx.arc(ex, ey, star.size * (1 + star.z), 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none"
        />
    );
};

export default StarryBackground;
