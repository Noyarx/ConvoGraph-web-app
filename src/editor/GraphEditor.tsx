import {
  addEdge,
  Background,
  Controls,
  Panel,
  ReactFlow,
  SelectionMode,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeMouseHandler,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import { useCallback, useState } from "react";

import React from "react";
import { v4 as uuidv4 } from "uuid";
import ContextMenu from "../context-menu/components/ContextMenu";
import Header from "../header/components/Header";
import type { DialogueChoice } from "../models/DialogueChoice.model";
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
          mood: "happy",
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
          mood: "happy",
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
          var_name: "weaponsFound",
          operator: ">=",
          value: 2,
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

export default function GraphEditor() {
  const { screenToFlowPosition } = useReactFlow();
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const [editingElement, setEditingElement] = useState<Node | Edge | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [contextMenu, setContextMenu] = useState({
    open: false,
    x: 0,
    y: 0,
    type: null as "node" | "edge" | "pane" | null,
    target: null as Node | Edge | null,
  });
  // handler to create and add a new node
  const handleAddNode = useCallback(
    (
      type: "statement" | "question" | "condition" | "event" | "comment",
      position = screenToFlowPosition({
        x: screen.width / 2,
        y: screen.height / 2,
      })
    ) => {
      const newId = uuidv4();
      const newFlowNode = {
        type,
        id: newId,
        position,
        data: createGraphNode(type, newId, position) as any,
      };
      // Create a new GraphNode using an incrementing number 'incr' as id
      setFlowNodes((prev) => [...prev, newFlowNode]);
    },
    [createGraphNode, setFlowNodes]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const editedEdge = { ...params, label: "", data: {} } as Edge;
      const isNewEdge = !editedEdge.id;
      if (isNewEdge) editedEdge.id = `${uuidv4()}`;

      // find the node this edge is coming from
      const sourceNode: Node = flowNodes.find(
        (n) => n.id === params.source
      ) as Node;

      if (sourceNode?.type === "question") {
        // add a empty choice to question node choices list
        const choices = sourceNode.data.choices as DialogueChoice[];
        choices.push({} as DialogueChoice);
        // populate new choices with this edge data
        const choice = {
          index: choices.length - 1,
          text: editedEdge.label,
          next_node: editedEdge.target,
        } as DialogueChoice;
        // set this edge's data as the choice it's representing
        editedEdge.data = choice as Record<string, any>;
      }
      // update edges list with new edge
      setEdges((eds) => addEdge(editedEdge, eds));

      // open the edit modal only if the source node is a question
      setEditingElement(editedEdge);
      setSidebarOpen(true);
    },
    [setEdges, flowNodes]
  );

  const handleSaveNode = (updatedNode: Record<string, any>) => {
    const syncedNode = {
      ...(updatedNode as Node),
      position:
        flowNodes.find((n) => n.id === updatedNode.id)?.position ??
        updatedNode.position,
      data: {
        ...updatedNode.data,
        node_info: {
          ...updatedNode.data.node_info,
          position:
            flowNodes.find((n) => n.id === updatedNode.id)?.position ??
            updatedNode.data.node_info.position,
        },
      },
    };

    setFlowNodes((prev) =>
      prev.map((n) => (n.id === updatedNode.id ? syncedNode : (n as Node)))
    );

    // Usa la versione sincronizzata per aggiornare la sidebar
    setEditingElement(syncedNode);
  };

  // Update edges list
  const handleSaveEdge = (updatedEdge: Edge) => {
    setEdges((eds) =>
      eds.map((e) => (e.id === updatedEdge.id ? updatedEdge : e))
    );
    setEditingElement(updatedEdge);
  };

  const handleNodeClick: NodeMouseHandler<Node> = useCallback(
    (_e: React.MouseEvent<Element, MouseEvent>, node: Node) => {
      setEditingElement(node);
      setSidebarOpen(true);
    },
    [flowNodes]
  );

  const handleEdgeClick: EdgeMouseHandler<Edge> = useCallback(
    (_e: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
      // console.log(edge);
      setEditingElement(edge);
      setSidebarOpen(true);
    },
    [edges]
  );
  const handleNodeContextMenu = useCallback(
    (evt: React.MouseEvent<Element, MouseEvent>, node: Node) => {
      evt.preventDefault();
      setContextMenu({
        open: true,
        x: evt.clientX,
        y: evt.clientY,
        target: node,
        type: "node",
      });
    },
    [flowNodes]
  );
  const handleEdgeContextMenu = useCallback(
    (evt: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
      evt.preventDefault();
      setContextMenu({
        open: true,
        x: evt.clientX,
        y: evt.clientY,
        target: edge,
        type: "edge",
      });
    },
    [edges]
  );
  const handlePaneContextMenu = useCallback(
    (evt: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
      evt.preventDefault();
      setContextMenu({
        open: true,
        x: evt.clientX,
        y: evt.clientY,
        target: null,
        type: "pane",
      });
    },
    []
  );

  const handleSidebarClose = () => {
    setEditingElement(null);
    setSidebarOpen(false);
  };

  const handleClose = () => setContextMenu((m) => ({ ...m, open: false }));

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        onDragOver={() => {}}
        selectionMode={SelectionMode.Partial}
        connectionRadius={40}
        nodes={flowNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onNodeContextMenu={handleNodeContextMenu}
        onEdgeContextMenu={handleEdgeContextMenu}
        onPaneContextMenu={handlePaneContextMenu}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
      >
        <Panel className="flex flex-row">
          <Header />
        </Panel>
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
      <ContextMenu
        open={contextMenu.open}
        onClose={handleClose}
        onEditElement={(element) => {
          setEditingElement(element);
          setSidebarOpen(true);
        }}
        x={contextMenu.x}
        y={contextMenu.y}
        targetType={contextMenu.type}
        target={contextMenu.target}
      />
      <SideBar
        selectedElement={editingElement}
        open={sidebarOpen}
        onClose={handleSidebarClose}
        onSaveNode={handleSaveNode}
        onSaveEdge={handleSaveEdge}
      />
    </div>
  );
}
