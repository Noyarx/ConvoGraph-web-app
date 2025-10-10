import "@xyflow/react/dist/style.css";
import { useState } from "react";

import GraphEditor from "./components/GraphEditor";
import type { GraphNode } from "./models/NodeTypes.model";

const initialGraph: GraphNode[] = [
  {
    id: "1",
    type: "statement",
    next_node: "",
    node_info: {
      position: { x: 200, y: 200 },
      title: "Inizio",
      shape: "rect",
      color: "#4e73df",
    },
    data: {
      speaker: "NPC",
      mood: "neutral",
      text: "Benvenuto nel villaggio!",
    },
  },
  {
    id: "2",
    type: "condition",
    node_info: {
      position: { x: 200, y: 100 },
      title: "Condizionale",
      shape: "circle",
      color: "#FFC0CB",
    },
    next_node_true: "3",
    next_node_false: "1",
    data: {
      condition: "negrus",
    },
  },
  {
    id: "3",
    type: "event",
    node_info: {
      position: { x: 100, y: 300 },
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
    next_node: "2",
  },
];

const initialEdges = [{ id: "1-2", source: "1", target: "2" }];

export default function App() {
  const [nodes, setNodes] = useState(initialGraph);
  const [edges, setEdges] = useState(initialEdges);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GraphEditor nodes={nodes} />;
    </div>
  );
}
