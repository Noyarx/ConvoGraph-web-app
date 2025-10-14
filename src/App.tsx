import "@xyflow/react/dist/style.css";

import GraphEditor from "./editor/components/GraphEditor";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GraphEditor />
    </div>
  );
}
