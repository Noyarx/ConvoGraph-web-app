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
import {
  flowToGraphTree,
  toXYFlowEdges,
  toXYFlowNodes,
} from "../nodes/utils/xyflowAdapter";
import SideBar from "../sidebar/components/Sidebar";
import FloatingToolbar from "../toolbar/components/FloatingToolbar";
import { PersistSidebar } from "../features/persist/components/PersistSidebar";
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

export default function GraphEditor() {
  const { screenToFlowPosition } = useReactFlow();
  const initialNodes = toXYFlowNodes([]);
  const initialEdges = toXYFlowEdges([]);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const [editingElement, setEditingElement] = useState<Node | Edge | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // handler to import node tree from json file
  const handleImport = useCallback(() => {
    return [];
  }, []);
  // handler to export node tree and download the json file
  const handleExport = useCallback(() => {
    const graphTree = { nodes: flowToGraphTree(flowNodes, edges) };
    console.log(graphTree);
  }, [flowNodes, edges]);

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
      const editedEdge = { ...params } as Edge;
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
    (_e: React.MouseEvent<Element, MouseEvent>, node: Node) => {
      // console.log(node);
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
  const handleSidebarClose = () => {
    setEditingElement(null);
    setSidebarOpen(false);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <PersistSidebar />
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
        <Panel className="flex flex-row">
          <Header onImport={handleImport} onExport={handleExport} />
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
      <SideBar
        selectedElement={editingElement}
        open={sidebarOpen}
        onClose={handleSidebarClose}
        onSaveNode={handleSaveNode}
        onSaveEdge={handleSaveEdge}
      ></SideBar>
    </div>
  );
}
