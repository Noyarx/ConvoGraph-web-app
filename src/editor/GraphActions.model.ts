import type { Edge, Node } from "@xyflow/react";
import type { nodeTypeString } from "../models/NodeTypes.model";

export interface addNodeProps {
  position?: { x: number; y: number };
  type?: nodeTypeString;
}

export interface GraphActions {
  handleAddNode: ({ position, type }: addNodeProps) => void;
  handleDuplicateNode: (node: Node) => void;
  handleDuplicateNodes: (nodes: Node[]) => void;
  handleDeleteNode: (node: Node) => void;
  handleDeleteNodes: (nodes: Node[]) => void;
  handleDeleteEdge: (edge: Edge) => void;
  handleConnect: (edge: Edge) => void;
  centerView: () => void;
}
