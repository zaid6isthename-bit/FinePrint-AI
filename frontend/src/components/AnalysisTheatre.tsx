"use client";

import { useEffect, useRef } from "react";
import FluidGlass from "./FluidGlass";

export function AnalysisTheatre() {
  return (
    <div style={{ height: "600px", position: "relative", borderRadius: "16px", overflow: "hidden" }}>
      <FluidGlass />
    </div>
  );
}