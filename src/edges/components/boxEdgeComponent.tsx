import { Chip } from "@mui/material";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";
import { useEffect, useState, type FC } from "react";
import { usePreviewHighlight } from "../../preview/PreviewContext";

const BoxEdgeComponent: FC<EdgeProps<Edge>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  label,
  source,
  target,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { getEdges } = useReactFlow();
  const [indexColor, setIndexColor] = useState<"default" | "error">("default");
  // set indexColor "error" if there's more than 1 edge with the same index
  // connected to the same source node
  useEffect(() => {
    const sameSourceEdges = getEdges().filter((e) => e.source === source);
    setIndexColor(
      sameSourceEdges.filter((e) => e.data?.index === data?.index).length > 1
        ? "error"
        : "default"
    );
  }, [data?.index]);

  const sourceHighlight = usePreviewHighlight(source);
  const targetHighlight = usePreviewHighlight(target);
  const isDimmed = sourceHighlight === "dimmed" || targetHighlight === "dimmed";

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      interactionWidth={80}
      style={{
        ...(isDimmed && { opacity: 0.12 }),
        transition: "opacity 0.3s",
      }}
    >
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: (data?.color as string) ?? "#F5F5F5",
            color: "black",
            minWidth: 100,
            maxWidth: 200,
            minHeight: 60,
            borderRadius: 9,
            ...(isDimmed && { opacity: 0.15, filter: "grayscale(0.5)" }),
            transition: "opacity 0.3s, filter 0.3s",
          }}
          className="nodrag nopan p-4 flex flex-col gap-1"
        >
          <div className="flex flex-row justify-center gap-2 items-center font-bold">
            {data?.index !== null && data?.index !== undefined ? (
              <Chip color={indexColor} label={`${Number(data?.index)}`} />
            ) : (
              <></>
            )}
          </div>
          <p className="text-center break-words font-bold">{label}</p>
        </div>
      </EdgeLabelRenderer>
    </BaseEdge>
  );
};

export default BoxEdgeComponent;
