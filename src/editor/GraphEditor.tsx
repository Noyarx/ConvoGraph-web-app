//#region IMPORTS
import {
  addEdge,
  Background,
  Controls,
  Panel,
  ReactFlow,
  SelectionMode,
  StepEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeMouseHandler,
  type EdgeTypes,
  type Node,
  type NodeMouseHandler,
  type NodeTypes,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@material-tailwind/react";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import ContextMenu from "../context-menu/components/ContextMenu";
import BoxEdgeComponent from "../edges/components/boxEdgeComponent";
import { useFlowHistory } from "../flow-history/FlowHistoryContext";
import Header from "../header/components/Header";
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
//#endregion

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
const nodeTypes: NodeTypes = {
  statement: StatementNodeComponent,
  condition: ConditionalNodeComponent,
  question: QuestionNodeComponent,
  event: EventNodeComponent,
  comment: CommentNodeComponent,
};
// custom edge types to pass as props to ReactFlow
const edgeTypes: EdgeTypes = {
  default: StepEdge,
  box: BoxEdgeComponent,
};

//#region COMPONENT
export default function GraphEditor() {
  const { screenToFlowPosition } = useReactFlow();
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const flowHistory = useFlowHistory();

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
      flowHistory.saveState();
      setFlowNodes((prev) => [...prev, newFlowNode]);
    },
    [createGraphNode, setFlowNodes, flowHistory.saveState]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const isQuestion =
        flowNodes.find((e) => e.id === params.source)?.type === "question";

      const editedEdge = {
        ...params,
        type: isQuestion ? "box" : "default",
        label: "",
        data: {},
      } as Edge;
      const isNewEdge = !editedEdge.id;
      if (isNewEdge) editedEdge.id = `${uuidv4()}`;

      flowHistory.saveState();
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

  //#region CLICK HANDLERS
  const handleNodeClick: NodeMouseHandler<Node> = useCallback(
    (_e: React.MouseEvent<Element, MouseEvent>, node: Node) => {
      setEditingElement(node);
      setSidebarOpen(true);
    },
    [flowNodes]
  );

  const handleEdgeClick: EdgeMouseHandler<Edge> = useCallback(
    (_e: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
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
  //#endregion

  const handleSidebarClose = () => {
    setEditingElement(null);
    setSidebarOpen(false);
  };

  const handleClose = () => setContextMenu((m) => ({ ...m, open: false }));

  //#region SAVE/RESTORE STATE

  useEffect(() => {
    const handleKeyDown = (evt: KeyboardEvent) => {
      if (evt.ctrlKey) {
        switch (evt.key) {
          case "z":
            flowHistory.undo();
            break;
          case "y":
            flowHistory.redo();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [flowHistory.undo, flowHistory.redo]);

  //#endregion

  //#region RETURN
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={flowNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onNodeContextMenu={handleNodeContextMenu}
        onEdgeContextMenu={handleEdgeContextMenu}
        onPaneContextMenu={handlePaneContextMenu}
        onInit={flowHistory.setRfInstance}
        onNodeDragStart={flowHistory.saveState} // save flow state when starting to move a node
        onDelete={flowHistory.saveState} // save flow state before deleting an element
        selectionMode={SelectionMode.Partial}
        connectionRadius={40}
        minZoom={0.2}
        fitView
      >
        <Panel className="flex flex-row">
          <Header />
        </Panel>
        <Panel
          position="bottom-left"
          style={{ boxShadow: "0px 0px 3px 0.1vh #00000014" }}
          className="flex flex-row gap-2 border border-slate-100 rounded-xl p-1 bg-surface-light bg-opacity-60"
        >
          <Button
            onClick={flowHistory.undo}
            className="flex flex-row pl-1.5 pr-2 py-1 gap-1 rounded-2xl justify-between"
          >
            <UndoRounded />
            {/* <span className="font-bold">Undo</span> */}
          </Button>
          <Button
            className="flex flex-row pl-2 pr-1.5 py-1 gap-1 rounded-2xl justify-between"
            onClick={flowHistory.redo}
          >
            {/* <span className="font-bold">Redo</span> */}
            <RedoRounded />
          </Button>
        </Panel>
        <Background />
        <Controls
          showZoom={false}
          showFitView={false}
          showInteractive={false}
          position="bottom-center"
          orientation="horizontal"
          className="rounded-md"
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
  //#endregion
}
//#endregion
