export function getInverseScale(zoom: number) {
  return 1 / zoom;
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
