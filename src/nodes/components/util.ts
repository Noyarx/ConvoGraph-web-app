import type { CSSProperties } from "react";
import type { HighlightState } from "../../preview/PreviewContext";

export function getInverseScale(zoom: number) {
  return 1 / zoom;
}

export function getHighlightStyle(state: HighlightState): CSSProperties {
  return {
    ...(state === "dimmed" && { opacity: 0.15, filter: "grayscale(0.5)" }),
    ...(state === "current" && {
      boxShadow:
        "0 0 14px 4px rgba(99,102,241,0.6), 0 0 4px 1px rgba(99,102,241,0.3)",
      outline: "2px solid rgba(99,102,241,0.8)",
      outlineOffset: 2,
    }),
    transition: "opacity 0.3s, filter 0.3s, box-shadow 0.3s, outline 0.3s",
  };
}

export const HANDLE_OFFSET = 2;
export const targetHandleStyle = {
  borderColor: "#4ade80",
  backgroundColor: "#16a34a",
  cursor: "pointer",
};
export const sourceHandleStyle = {
  backgroundColor: "#f97316",
  borderColor: "#fb923c",
  cursor: "pointer",
};
