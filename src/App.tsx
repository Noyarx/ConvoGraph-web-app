import "@xyflow/react/dist/style.css";

import GraphEditor from "./editor/GraphEditor";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowHistoryProvider } from "./flow-history/FlowHistoryContext";
import { MenuProvider } from "./menu/context/MenuContext";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MenuProvider>
        <ReactFlowProvider>
          <FlowHistoryProvider>
            <GraphEditor />
          </FlowHistoryProvider>
        </ReactFlowProvider>
      </MenuProvider>
    </div>
  );
}
