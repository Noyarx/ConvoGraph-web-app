//#region IMPORTS
import {
  addEdge,
  Background,
  Panel,
  ReactFlow,
  SelectionMode,
  StepEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type EdgeMouseHandler,
  type EdgeTypes,
  type FinalConnectionState,
  type Node,
  type NodeMouseHandler,
  type NodeTypes,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@material-tailwind/react";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import BoxEdgeComponent from "../edges/components/boxEdgeComponent";
import { useFlowHistory } from "../flow-history/FlowHistoryContext";
import Header from "../header/components/Header";
import { getConnectNodeMenuItems } from "../menu/connectNodeMenuItems";
import ContextMenu from "../menu/context-menu/components/ContextMenu";
import { useMenu } from "../menu/context/MenuContext";
import CommentNodeComponent from "../nodes/components/CommentNodeComponent";
import ConditionalNodeComponent from "../nodes/components/ConditionalNodeComponent";
import EventNodeComponent from "../nodes/components/EventNodeComponent";
import QuestionNodeComponent from "../nodes/components/QuestionNodeComponent";
import StatementNodeComponent from "../nodes/components/StatementNodeComponent";
import ConversationPreview from "../preview/ConversationPreview";
import SideBar from "../sidebar/components/Sidebar";
import FloatingToolbar from "../toolbar/components/FloatingToolbar";
import { useGraphActions } from "./UseGraphActions";
//#endregion

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
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const flowHistory = useFlowHistory();
  const actions = useGraphActions();
  const { openMenu } = useMenu();
  const [editingElement, setEditingElement] = useState<Node | Edge | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState({
    open: false,
    position: { x: 0, y: 0 },
    type: null as "node" | "edge" | "pane" | "selection" | null,
    target: null as Node | Edge | Node[] | Edge[] | null,
  });

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
      if (isNewEdge) editedEdge.id = uuidv4();

      flowHistory.saveState();
      // update edges list with new edge
      setEdges((eds) => addEdge(editedEdge, eds));
      // open the edit modal only if the source node is a question
      setEditingElement(editedEdge);
      setSidebarOpen(true);
    },
    [setEdges, flowNodes],
  );

  const handleOnConnectEnd = useCallback(
    (evt: any, connectionState: FinalConnectionState) => {
      if (
        connectionState.isValid ||
        connectionState.fromHandle?.type === "target"
      )
        return;
      const evtPos = { x: evt.clientX, y: evt.clientY };
      const sourceNode = connectionState.fromNode as Node;
      const sourceHandle = connectionState?.fromHandle?.id ?? undefined;
      openMenu({
        id: "connect-node-menu",
        items: getConnectNodeMenuItems({
          actions,
          sourceNode,
          sourceHandle,
          position: evtPos,
        }),
        anchorPosition: evtPos,
      });
    },
    [openMenu, getConnectNodeMenuItems, flowHistory.saveState],
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
      prev.map((n) => (n.id === updatedNode.id ? syncedNode : (n as Node))),
    );

    // Usa la versione sincronizzata per aggiornare la sidebar
    setEditingElement(syncedNode);
  };

  // Update edges list
  const handleSaveEdge = (updatedEdge: Edge) => {
    setEdges((eds) =>
      eds.map((e) => (e.id === updatedEdge.id ? updatedEdge : e)),
    );
    setEditingElement(updatedEdge);
  };

  //#region CLICK HANDLERS
  const handleNodeClick: NodeMouseHandler<Node> = useCallback(
    (_e: React.MouseEvent<Element, MouseEvent>, node: Node) => {
      setEditingElement(node);
      setSidebarOpen(true);
    },
    [flowNodes],
  );

  const handleEdgeClick: EdgeMouseHandler<Edge> = useCallback(
    (_e: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
      // console.log("Clicked edge: ", edge);
      setEditingElement(edge);
      setSidebarOpen(true);
    },
    [edges],
  );
  const handleNodeContextMenu = useCallback(
    (evt: React.MouseEvent<Element, MouseEvent>, node: Node) => {
      evt.preventDefault();
      setContextMenu({
        open: true,
        position: { x: evt.clientX, y: evt.clientY },
        target: node,
        type: "node",
      });
    },
    [flowNodes],
  );
  const handleEdgeContextMenu = useCallback(
    (evt: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
      evt.preventDefault();
      setContextMenu({
        open: true,
        position: { x: evt.clientX, y: evt.clientY },
        target: edge,
        type: "edge",
      });
    },
    [edges],
  );
  const handlePaneContextMenu = useCallback(
    (evt: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
      evt.preventDefault();
      // console.log("click position: ", { x: evt.clientX, y: evt.clientY });
      setContextMenu({
        open: true,
        position: { x: evt.clientX, y: evt.clientY },
        target: null,
        type: "pane",
      });
    },
    [setContextMenu],
  );

  const handleSelectionContextMenu = useCallback(
    (evt: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
      evt.preventDefault();
      setContextMenu({
        open: true,
        position: { x: evt.clientX, y: evt.clientY },
        target: flowNodes.filter((node) => node.selected === true),
        type: "selection",
      });
    },
    [setContextMenu, flowNodes, edges],
  );
  //#endregion

  const handleSidebarClose = () => {
    setEditingElement(null);
    setSidebarOpen(false);
  };

  const handleClose = () => setContextMenu((m) => ({ ...m, open: false }));

  const handleOpenPreview = useCallback(() => {
    if (flowNodes.length < 1) {
      alert("⚠️ There are no nodes to preview!");
      return;
    }
    setPreviewOpen(true);
  }, [flowNodes]);

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
        onSelectionContextMenu={handleSelectionContextMenu}
        onConnectEnd={handleOnConnectEnd}
        onInit={flowHistory.setRfInstance}
        onNodeDragStart={flowHistory.saveState} // save flow state when starting to move a node
        onDelete={flowHistory.saveState} // save flow state before deleting an element
        selectionMode={SelectionMode.Partial}
        selectionOnDrag={true}
        panOnDrag={[1]} // only allow pane drag using middle mouse button
        connectionRadius={40}
        minZoom={0.02}
        fitView
      >
        <Panel className="flex flex-row">
          <Header onPreview={handleOpenPreview} />
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
        <Panel
          position="bottom-center"
          className="rounded-md"
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: 8,
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <FloatingToolbar />
        </Panel>
      </ReactFlow>
      <ContextMenu
        open={contextMenu.open}
        onClose={handleClose}
        position={contextMenu.position}
        targetType={contextMenu.type}
        target={contextMenu.target}
      />
      <SideBar
        selectedElement={editingElement}
        open={sidebarOpen}
        onClose={handleSidebarClose}
        onSaveNode={handleSaveNode}
        onSaveEdge={handleSaveEdge}
        onPreview={handleOpenPreview}
      />
      {previewOpen && (
        <ConversationPreview
          nodes={flowNodes}
          edges={edges}
          startNodeId={
            editingElement && !("source" in editingElement)
              ? editingElement.id
              : null
          }
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
  //#endregion
}
//#endregion
