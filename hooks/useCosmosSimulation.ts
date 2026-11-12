"use client";

import { useRef } from "react";
import {
  createInitialSimState,
  type CosmosSimState,
} from "@/lib/cosmos-sim";

/**
 * Owns the mutable 3D flight simulation state.
 *
 * The state lives in a ref because it is read/written inside
 * requestAnimationFrame and event handlers without triggering re-renders.
 * Higher-level actions (fly-to-item, back-to-portrait, open/close box) build on
 * top of this in the parent component.
 */
export function useCosmosSimulation() {
  const simRef = useRef<CosmosSimState>(createInitialSimState());
  return { simRef };
}
