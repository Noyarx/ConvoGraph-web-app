import {
  addEdge,
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type EdgeMouseHandler,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import { useCallback, useState } from "react";

import React from "react";
import { v4 as uuidv4 } from "uuid";
import type { GraphNode } from "../models/NodeTypes.model";
import CommentNodeComponent, {
  bgColor as commentBgColor,
} from "../nodes/components/CommentNodeComponent";
import ConditionalNodeComponent, {
  bgColor as conditionBgColor,
} from "../nodes/components/ConditionalNodeComponent";
import EventNodeComponent, {
  bgColor as eventBgColor,
} from "../nodes/components/EventNodeComponent";
import QuestionNodeComponent, {
  bgColor as questionBgColor,
} from "../nodes/components/QuestionNodeComponent";
import StatementNodeComponent, {
  bgColor as statementBgColor,
} from "../nodes/components/StatementNodeComponent";
import { toXYFlowEdges, toXYFlowNodes } from "../nodes/utils/xyflowAdapter";
import SideBar from "../sidebar/components/Sidebar";
import FloatingToolbar from "../toolbar/components/FloatingToolbar";
function createGraphNode(
  type: "statement" | "question" | "condition" | "event" | "comment",
  id: string,
  position = { x: 100, y: 100 }
): GraphNode {
  switch (type) {
    case "statement":
      return {
        id,
        type,
        next_node: "",
        node_info: {
          position,
          title: "Nuova frase",
          color: statementBgColor,
        },
        data: {
          speaker: "Matthew",
          mood: "Happy",
          text: "Ciao, sono Matthew. In realtà sono solo un nuovo nodo blu.",
        },
      };
    case "question":
      return {
        id,
        type,
        node_info: {
          position,
          title: "Nuova Domanda",
          color: questionBgColor,
        },
        data: {
          speaker: "Matthew",
          mood: "Happy",
          text: "Ciao, sono Matthew. In realtà sono solo un nuovo nodo blu.",
        },
        choices: [],
      };
    case "condition":
      return {
        id,
        type,
        next_node_true: "",
        next_node_false: "",
        node_info: {
          position,
          title: "Nuova Condition",
          color: conditionBgColor,
        },
        data: {
          condition: "unaCondizione",
        },
      };
    case "event":
      return {
        id,
        type,
        next_node: "",
        node_info: {
          position,
          title: "Nuovo Evento",
          color: eventBgColor,
        },
        data: {
          event_name: "unEvento",
          parameters: { someParam: 7 },
        },
      };
    case "comment":
      return {
        id,
        type,
        node_info: {
          position,
          title: "Nuovo Commento",
          color: commentBgColor,
        },
        data: {
          text: "# Questo è un commento",
        },
      };
  }
}

// custom node types to pass as props to ReactFlow
const nodeTypes = {
  statement: StatementNodeComponent,
  condition: ConditionalNodeComponent,
  question: QuestionNodeComponent,
  event: EventNodeComponent,
  comment: CommentNodeComponent,
};
export let devMode: boolean = false;

export default function GraphEditor() {
  const initialNodes = toXYFlowNodes([]);
  const initialEdges = toXYFlowEdges([]);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const [editingElement, setEditingElement] = useState<Node | Edge | null>(
    null
  );

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  // handler to create and add a new node
  const handleAddNode = useCallback(
    (
      type: "statement" | "question" | "condition" | "event" | "comment",
      position = { x: 100, y: 100 }
    ) => {
      const newId = uuidv4();
      const newFlowNode = {
        type,
        id: newId,
        position,
        data: createGraphNode(type, newId) as any,
      };
      // Create a new GraphNode using an incrementing number 'incr' as id
      setFlowNodes((prev) => [...prev, newFlowNode]);
    },
    [createGraphNode, setFlowNodes]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const editedEdge = { ...params } as Edge;
      const isNewEdge = !editedEdge.id;
      if (isNewEdge) editedEdge.id = `${uuidv4()}`;
      setEdges((eds) => addEdge(editedEdge, eds));

      // open the edit modal only if the source node is a question
      setEditingElement(editedEdge);
      setSidebarOpen(true);
    },
    [setEdges]
  );

  // handler to delete a node and its edges
  // const handleDeleteNode = useCallback(
  //   (deletedId: string) => {
  //     setFlowNodes((nodes) => nodes.filter((n) => n.id !== deletedId));
  //     setEdges((edges) =>
  //       edges.filter((e) => e.source !== deletedId && e.target !== deletedId)
  //     );
  //   },
  //   [setFlowNodes, setEdges]
  // );

  const handleSaveNode = (updatedNode: Record<string, any>) => {
    const node = updatedNode as Node;
    setFlowNodes((nds) => nds.map((n) => (n.id === node.id ? node : n)));
  };

  // Update edges list
  const handleSaveEdge = (updatedEdge: Edge) => {
    setEdges((eds) =>
      eds.map((e) => (e.id === updatedEdge.id ? updatedEdge : e))
    );
  };

  const handleNodeClick: NodeMouseHandler<Node> = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>, node: Node) => {
      switch (node.type) {
        case "statement":
          setEditingElement(node);
          break;
        case "question":
          setEditingElement(node);
          break;
        case "condition":
          setEditingElement(node);
          break;
        case "event":
          setEditingElement(node);
          break;
        case "comment":
          setEditingElement(node);
          break;
      }
      setSidebarOpen(true);
    },
    []
  );

  const handleEdgeClick: EdgeMouseHandler<Edge> = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
      setEditingElement(edge);
      setSidebarOpen(true);
    },
    []
  );
  const handleSidebarClose = () => {
    setEditingElement(null);
    setSidebarOpen(false);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          selectionMode={SelectionMode.Partial}
          connectionRadius={30}
          nodes={flowNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
        >
          <Background />
          <Controls
            showZoom={false}
            showFitView={false}
            showInteractive={false}
            position="bottom-center"
            orientation="horizontal"
            className=""
            style={{
              display: "flex",
              flexDirection: "row",
              columnGap: 8,
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <FloatingToolbar onAddNode={handleAddNode} />
          </Controls>
        </ReactFlow>
        <SideBar
          selectedElement={editingElement}
          open={sidebarOpen}
          onClose={handleSidebarClose}
          onSaveNode={handleSaveNode}
          onSaveEdge={handleSaveEdge}
        ></SideBar>
      </ReactFlowProvider>
    </div>
  );
}
