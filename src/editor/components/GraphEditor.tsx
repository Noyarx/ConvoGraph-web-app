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
} from "@xyflow/react";
import { useCallback } from "react";

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
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <AddNodeButton onClick={() => handleAddNode("statement")} />

      <ReactFlow
        nodes={flowNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
