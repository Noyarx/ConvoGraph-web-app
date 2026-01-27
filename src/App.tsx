import "@xyflow/react/dist/style.css";

import GraphEditor from "./editor/GraphEditor";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowHistoryProvider } from "./flow-history/FlowHistoryContext";
import { MenuProvider } from "./menu/context/MenuContext";
import { GraphStateProvider } from "./editor/graph-state/GraphStateContext";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GraphStateProvider>
        <MenuProvider>
          <ReactFlowProvider>
            <FlowHistoryProvider>
              <GraphEditor />
            </FlowHistoryProvider>
          </ReactFlowProvider>
        </MenuProvider>
      </GraphStateProvider>
    </div>
  );
}
