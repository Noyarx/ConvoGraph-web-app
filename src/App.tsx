import "@xyflow/react/dist/style.css";
import { useEffect, useState } from "react";

import GraphEditor from "./editor/GraphEditor";
import type { GraphNode } from "./models/NodeTypes.model";
import AddNodeButton from "./editor/AddNodeButton";
import type { Edge } from "@xyflow/react";

const initialGraph: GraphNode[] = [
  {
    id: "1",
    type: "statement",
    next_node: "2",
    node_info: {
      position: { x: 0, y: 0 },
      title: "Inizio",
      shape: "rect",
      color: "#4e73df",
    },
    data: {
      speaker: "Matthew",
      mood: "Annoyed",
      text: "Benvenuto nel villaggio!",
    },
  },
  {
    id: "2",
    type: "condition",
    node_info: {
      position: { x: 40, y: 150 },
      title: "Condizionale",
      shape: "circle",
      color: "#fc7bdbff",
    },
    next_node_true: "3",
    next_node_false: "4",
    data: {
      condition: "negrus",
    },
  },
  {
    id: "3",
    type: "event",
    node_info: {
      position: { x: -100, y: 250 },
      title: "Funzione",
      shape: "rombo",
      color: "#FFA500",
    },
    data: {
      event_name: "startCinematic",
      parameters: {
        negro: 5,
      },
    },
    next_node: "",
  },
  {
    id: "4",
    type: "question",
    node_info: {
      position: { x: 200, y: 250 },
      title: "Domanda",
      shape: "circle",
      color: "#33cfbaff",
    },
    data: {
      speaker: "Gregson",
      mood: "curious",
      text: "Che cazzo hai fatto a quell'ora, Evans?!",
    },
    choices: [
      {
        index: 0,
        text: "Parco",
        next_node: "5",
      },
      {
        index: 1,
        text: "Casa",
        next_node: "5",
      },
      {
        index: 2,
        text: "Casa vittima",
        next_node: "5",
      },
    ],
  },
  {
    id: "5",
    type: "statement",
    next_node: "",
    node_info: {
      position: { x: 100, y: 350 },
      title: "Inizio",
      shape: "rect",
      color: "#4e73df",
    },
    data: {
      speaker: "Matthew",
      mood: "Annoyed",
      text: "Benvenuto nel villaggio!",
    },
  },
];
const nodo: GraphNode = {
  id: "00",
  type: "statement",
  next_node: "",
  node_info: {
    position: { x: -500, y: 200 },
    title: "NuovoNodo",
    shape: "rect",
    color: "#4e73df",
  },
  data: {
    speaker: "Matthew",
    mood: "Happy",
    text: "Ho creato questo nodo col pulsante!",
  },
};
const initialEdges = [{ id: "1-2", source: "1", target: "2" }];

export default function App() {
  const [nodes, setNodes] = useState<GraphNode[]>(initialGraph);
  const [_edges, _setEdges] = useState<Edge[]>(initialEdges);
  const [incr, setIncr] = useState(0);
  const [newNode, setNewNode] = useState<GraphNode>(nodo);

  const onAddNodeClick = () => {
    // Create a new GraphNode using an incrementing number 'incr' as id
    setNewNode(() => ({
      id: String(incr),
      type: "statement",
      next_node: "",
      node_info: {
        position: { x: -500, y: 200 },
        title: "NuovoNodo",
        shape: "rect",
        color: "#4e73df",
      },
      data: {
        speaker: "Matthew",
        mood: "Happy",
        text: "Ho creato questo nodo col pulsante!",
      },
    }));
  };

  // When newNode state changes, add it to nodes list, then increase 'incr'
  useEffect(() => {
    setNodes(() => [...nodes, newNode]);
    setIncr(() => incr + 1);
  }, [newNode]);

  // Console log the GraphNode list each time it changes
  useEffect(() => {
    console.log(nodes);
  }, [nodes]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <AddNodeButton onClick={onAddNodeClick} />
      <GraphEditor nodes={nodes} />;
    </div>
  );
}
