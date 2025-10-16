import {
  addEdge,
  applyNodeChanges,
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

import { v4 as uuidv4 } from "uuid";
import type { GraphNode } from "../../models/NodeTypes.model";
import ConditionalNodeComponent, {
  bgColor as conditionBgColor,
} from "../../nodes/components/ConditionalNodeComponent";
import EventNodeComponent, {
  bgColor as eventBgColor,
} from "../../nodes/components/EventNodeComponent";
import QuestionNodeComponent, {
  bgColor as questionBgColor,
} from "../../nodes/components/QuestionNodeComponent";
import StatementNodeComponent, {
  bgColor as statementBgColor,
} from "../../nodes/components/StatementNodeComponent";
import { toXYFlowEdges, toXYFlowNodes } from "../../nodes/utils/xyflowAdapter";
import SidebarEditor from "../editModal/components/SidebarEditor";
import AddNodeButton from "./AddNodeButton";
const initialGraphNodes: GraphNode[] = [
  {
    id: uuidv4(),
    type: "statement",
    next_node: "2",
    node_info: {
      position: { x: 0, y: 0 },
      title: "Inizio",

      color: "#4e73df",
    },
    data: {
      speaker: "Matthew",
      mood: "Annoyed",
      text: "Benvenuto nel villaggio!",
    },
  },
  {
    id: uuidv4(),
    type: "condition",
    node_info: {
      position: { x: 40, y: 150 },
      title: "Condizionale",

      color: "#fc7bdbff",
    },
    next_node_true: "3",
    next_node_false: "4",
    data: {
      condition: "someCondition",
    },
  },
  {
    id: uuidv4(),
    type: "event",
    node_info: {
      position: { x: -100, y: 250 },
      title: "Funzione",

      color: "#FFA500",
    },
    data: {
      event_name: "startCinematic",
      parameters: {
        param: 5,
      },
    },
    next_node: "",
  },
  {
    id: uuidv4(),
    type: "question",
    node_info: {
      position: { x: 200, y: 250 },
      title: "Domanda",

      color: "#33cfbaff",
    },
    data: {
      speaker: "Gregson",
      mood: "curious",
      text: "Che hai fatto a quell'ora, Evans?!",
    },
    choices: [
      {
        index: 0,
        text: "Parco",
        next_node: "",
      },
      {
        index: 1,
        text: "Casa",
        next_node: "",
      },
      {
        index: 2,
        text: "Casa vittima",
        next_node: "",
      },
    ],
  },
  {
    id: uuidv4(),
    type: "statement",
    next_node: "",
    node_info: {
      position: { x: 100, y: 350 },
      title: "Inizio",

      color: "#4e73df",
    },
    data: {
      speaker: "Matthew",
      mood: "Annoyed",
      text: "Benvenuto nel villaggio!",
    },
  },
];

function createGraphNode(
  type: "statement" | "question" | "condition" | "event",
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
          title: "Nuovo Event",
          color: eventBgColor,
        },
        data: {
          event_name: "unEvento",
          parameters: { someParam: 7 },
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
};

export default function GraphEditor() {
  const initialNodes = toXYFlowNodes(initialGraphNodes);
  const initialEdges = toXYFlowEdges(initialGraphNodes);

  const [flowNodes, setFlowNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const [editingElement, setEditingElement] = useState<Node | Edge | null>(
    null
  );

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  // handler to create and add a new node
  const handleAddNode = useCallback(
    (
      type: "statement" | "question" | "condition" | "event",
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

  const onNodesChange = useCallback(
    (changes: any) => {
      setFlowNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setFlowNodes]
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
  const handleDeleteNode = useCallback(
    (deletedId: string) => {
      setFlowNodes((nodes) => nodes.filter((n) => n.id !== deletedId));
      setEdges((edges) =>
        edges.filter((e) => e.source !== deletedId && e.target !== deletedId)
      );
    },
    [setFlowNodes, setEdges]
  );

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
  const onSidebarClose = () => {
    setEditingElement(null);
    setSidebarOpen(false);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {/* <AddNodeButton onClick={() => handleAddNode("statement")} /> */}
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
            className="rounded-md shadow-none border border-gray-50 p-1 bg-surface-light bg-opacity-60"
            style={{
              display: "flex",
              flexDirection: "row",
              columnGap: 8,
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <AddNodeButton
              type="statement"
              color={statementBgColor}
              onAddNode={handleAddNode}
            />
            <AddNodeButton
              type="question"
              color={questionBgColor}
              onAddNode={handleAddNode}
            />
            <AddNodeButton
              type="condition"
              color={conditionBgColor}
              onAddNode={handleAddNode}
            />
            <AddNodeButton
              type="event"
              color={eventBgColor}
              onAddNode={handleAddNode}
            />
          </Controls>
        </ReactFlow>
        <SidebarEditor
          selectedElement={editingElement}
          open={sidebarOpen}
          onClose={onSidebarClose}
          onSaveNode={handleSaveNode}
          onSaveEdge={handleSaveEdge}
        ></SidebarEditor>
      </ReactFlowProvider>
    </div>
  );
}
