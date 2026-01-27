import type { Edge, Node } from "@xyflow/react";
import type { NodeTypeString } from "../models/NodeTypes.model";

export interface addNodeProps {
  position?: { x: number; y: number };
  type?: NodeTypeString;
}

export interface GraphActions {
  handleAddNode: ({ position, type }: addNodeProps) => Node;
  handleDuplicateNode: (node: Node) => void;
  handleDuplicateNodes: (nodes: Node[]) => void;
  handleConnectNode: (
    sourceNode: Node,
    targetNode: Node,
    sourceHandle?: string,
  ) => void;
  handleDeleteNode: (node: Node) => void;
  handleDeleteNodes: (nodes: Node[]) => void;
  handleDeleteEdge: (edge: Edge) => void;
  selectNodeType: (type: NodeTypeString) => void;
  centerView: () => void;
}
