import { StepEdge, type EdgeProps, type Edge } from "@xyflow/react";
import type { FC } from "react";
import { usePreviewHighlight } from "../../preview/PreviewContext";

const StepEdgeWithHighlight: FC<EdgeProps<Edge>> = (props) => {
  const sourceHighlight = usePreviewHighlight(props.source);
  const targetHighlight = usePreviewHighlight(props.target);
  const isDimmed = sourceHighlight === "dimmed" || targetHighlight === "dimmed";

  return (
    <StepEdge
      {...props}
      style={{
        ...props.style,
        ...(isDimmed && { opacity: 0.12 }),
        transition: "opacity 0.3s",
      }}
    />
  );
};

export default StepEdgeWithHighlight;
