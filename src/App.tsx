import "@xyflow/react/dist/style.css";

import GraphEditor from "./editor/GraphEditor";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowHistoryProvider } from "./flow-history/FlowHistoryContext";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <FlowHistoryProvider>
          <GraphEditor />
        </FlowHistoryProvider>
      </ReactFlowProvider>
    </div>
  );
}
