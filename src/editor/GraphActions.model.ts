import type { Edge, Node } from "@xyflow/react";
import type { nodeTypeString } from "../models/NodeTypes.model";

export interface addNodeProps {
  position?: { x: number; y: number };
  node?: Node;
  type?: nodeTypeString;
}

export interface GraphActions {
  handleAddNode: ({ position, node, type }: addNodeProps) => void;
  handleDeleteNode: (node: Node) => void;
  handleDeleteEdge: (edge: Edge) => void;
  handleConnect: (edge: Edge) => void;
}
