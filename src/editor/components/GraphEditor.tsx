import {
  addEdge,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
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
import DialogueNodeComponent, {
  bgColor as statementBgColor,
} from "../../nodes/components/StatementNodeComponent";
import { toXYFlowEdges, toXYFlowNodes } from "../../nodes/utils/xyflowAdapter";
import AddNodeButton from "./AddNodeButton";
import StatementNodeComponent from "../../nodes/components/StatementNodeComponent";
import EditModal from "../editModal/components/EditModal";
import EdgeEditor from "../editModal/components/EdgeEditor";
import NodeEditor from "../editModal/components/NodeEditor";

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

  const [flowNodes, setFlowNodes] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const [EditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [titleElement, setTitleElement] = useState<string>("");
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null);
  const [editingNode, setEditingNode] = useState<Node | null>(null);

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
      setEdges((eds) => addEdge(params, eds));
      if (flowNodes.find((n) => n.id === params.source)?.type === "question") {
        setTitleElement("an edge");
        setEditingEdge({ ...params } as Edge); // in realtà è di tipo Connection e non contiene un id
        setEditingNode(null); // probabilmente da togliere
        setEditModalOpen(true);
      }
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

  const onNodeContextMenu: NodeMouseHandler<Node> = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>, node: Node) => {
      e.preventDefault();
      setTitleElement("a node");
      const fakeNode: Node = {
        ...node,
      };
      setEditingEdge(null);
      setEditingNode(fakeNode);
      setEditModalOpen((value) => !value);
    },
    [setEditModalOpen]
  );

  const onEdgeContextMenu: EdgeMouseHandler<Edge> = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
      e.preventDefault();
      setTitleElement("an edge");
      const fakeEdge: Edge = {
        ...edge,
      };
      setEditingNode(null);
      setEditingEdge(fakeEdge);
      setEditModalOpen((value) => !value);
    },
    [setEditModalOpen, setEditingEdge]
  );

  const handleEditClose = useCallback(() => {}, []);

  const handleSaveEdge = (updatedEdge: Edge) => {
    setEdges((eds) =>
      eds.map((e) => (e.id === updatedEdge.id ? updatedEdge : e))
    );
    setEditModalOpen(false);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={flowNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeContextMenu={onEdgeContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
      >
        <AddNodeButton onClick={() => handleAddNode("statement")} />
        <Background />
        <Controls />
      </ReactFlow>
      <EditModal
        open={EditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Editing ${titleElement}`}
      >
        {editingEdge && (
          <EdgeEditor edge={editingEdge} onSave={handleSaveEdge} />
        )}
        {editingNode && <NodeEditor node={editingNode as any}></NodeEditor>}
      </EditModal>
    </div>
  );
}
