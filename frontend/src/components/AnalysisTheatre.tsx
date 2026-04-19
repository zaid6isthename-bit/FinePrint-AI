"use client";

import { useEffect, useRef } from "react";
import FluidGlass from "./FluidGlass";

export function AnalysisTheatre() {
  return (
    <div style={{ height: "600px", position: "relative", borderRadius: "16px", overflow: "hidden" }}>
      <FluidGlass
        mode="lens"
        lensProps={{
          scale: 0.25,
          ior: 1.5,
          thickness: 5,
          chromaticAberration: 0.1,
          anisotropy: 0.01,
        }}
      />
      <AutonomousDriver />
    </div>
  );
}

// Drives synthetic pointer events so the lens moves autonomously
function AutonomousDriver() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const waypoints = [
      { x: 0.2, y: 0.25 }, { x: 0.5, y: 0.15 }, { x: 0.75, y: 0.3 },
      { x: 0.6, y: 0.55 }, { x: 0.3, y: 0.65 }, { x: 0.15, y: 0.4 },
      { x: 0.8, y: 0.7 }, { x: 0.45, y: 0.8 }, { x: 0.7, y: 0.45 },
    ];

    let wpIdx = 0;
    let cx = 0.5, cy = 0.5;
    let frame = 0;
    let dwellCount = 0;
    const DWELL = 90;
    let animId: number;

    function firePointer(nx: number, ny: number) {
      const rect = parent!.getBoundingClientRect();
      const clientX = rect.left + nx * rect.width;
      const clientY = rect.top + ny * rect.height;
      const canvas = parent!.querySelector("canvas");
      if (!canvas) return;
      
      canvas.dispatchEvent(new PointerEvent("pointermove", {
        clientX, 
        clientY, 
        bubbles: true, 
        cancelable: true,
        pointerType: 'mouse'
      }));
    }

    function tick() {
      frame++;
      const tx = waypoints[wpIdx].x;
      const ty = waypoints[wpIdx].y;
      
      cx += (tx - cx) * 0.03;
      cy += (ty - cy) * 0.03;

      firePointer(cx, cy);

      if (Math.hypot(tx - cx, ty - cy) < 0.015) {
        dwellCount++;
        if (dwellCount > DWELL) {
          dwellCount = 0;
          wpIdx = (wpIdx + 1 + Math.floor(Math.random() * 3)) % waypoints.length;
        }
      } else {
        dwellCount = 0;
      }

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <div ref={containerRef} style={{ display: "none" }} />;
}