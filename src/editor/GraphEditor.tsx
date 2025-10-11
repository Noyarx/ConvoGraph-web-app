import {
  addEdge,
  Background,
  Controls,
  ReactFlow,
  StepEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";

import type { GraphNode } from "../models/NodeTypes.model";
import {
  flowToGraphNode,
  toXYFlowEdges,
  toXYFlowNodes,
} from "../nodes/utils/xyflowAdapter";
import ConditionalNodeComponent from "../nodes/components/ConditionalNodeComponent";
import EventNodeComponent from "../nodes/components/EventNodeComponent";
import QuestionNodeComponent from "../nodes/components/QuestionNodeComponent";
import DialogueNodeComponent from "../nodes/components/StatementNodeComponent";

// custom node types to pass as props to ReactFlow
const nodeTypes = {
  statement: DialogueNodeComponent,
  condition: ConditionalNodeComponent,
  question: QuestionNodeComponent,
  event: EventNodeComponent,
};

const edgeTypes = {
  step: StepEdge,
};

interface GraphEditorProps {
  nodes: GraphNode[];
}

export default function GraphEditor({ nodes }: GraphEditorProps) {
  const initialNodes = toXYFlowNodes(nodes);
  const initialEdges = toXYFlowEdges(nodes);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // quando vengono aggiornati i props GraphNodes, aggiungili convertiti alla lista di flowNodes
  useEffect(() => {
    setFlowNodes(() => toXYFlowNodes(nodes));
  }, [nodes]);

  // on each change of one of the nodes or edges, update the GraphNode list
  useEffect(() => {
    flowToGraphNode(flowNodes, edges);
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
