// src/components/GraphEditor.tsx
import {
  addEdge,
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";

import {
  flowToGraphNode,
  toXYFlowEdges,
  toXYFlowNodes,
} from "../utils/xyflowAdapter";
import ConditionalNodeComponent from "./nodes/ConditionalNodeComponent";
import DialogueNodeComponent from "./nodes/DialogueNodeComponent";
import EventNodeComponent from "./nodes/EventNodeComponent";

import type { GraphNode } from "../models/NodeTypes.model";

const nodeTypes = {
  statement: DialogueNodeComponent,
  condition: ConditionalNodeComponent,
  event: EventNodeComponent,
};

interface GraphEditorProps {
  nodes: GraphNode[];
}

export default function GraphEditor({ nodes }: GraphEditorProps) {
  const initialNodes = toXYFlowNodes(nodes);
  const initialEdges = toXYFlowEdges(nodes);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const res = flowToGraphNode(flowNodes, edges);
    console.log("stiamo stampando res:", res);
  }, [flowNodes, edges]);

  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={flowNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
