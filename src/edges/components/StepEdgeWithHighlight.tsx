import { StepEdge, type EdgeProps, type Edge } from "@xyflow/react";
import type { FC } from "react";
import { useEdgeHighlightDimming } from "../../highlight/NodeHighlightContext";

const StepEdgeWithHighlight: FC<EdgeProps<Edge>> = (props) => {
  const isDimmed = useEdgeHighlightDimming(props.source, props.target);

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
