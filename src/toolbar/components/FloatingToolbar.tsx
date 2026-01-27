import { Button } from "@material-tailwind/react";
import {
  AltRouteRounded,
  ChatOutlined,
  Fullscreen,
  NewReleasesRounded,
  QuestionMark,
  Tag,
} from "@mui/icons-material";
import { Stack } from "@mui/material";
import type { ReactNode } from "react";
import { useGraphState } from "../../editor/graph-state/GraphStateContext";
import { useGraphActions } from "../../editor/UseGraphActions";
import { getSelectNodeMenuItems } from "../../menu/selectNodeMenuItems";
import SplitButton from "../../menu/split-button/SplitButton";
import type { NodeTypeString } from "../../models/NodeTypes.model";

function getNodeTypeIcon(type: NodeTypeString): ReactNode | null {
  switch (type) {
    case "statement":
      return <ChatOutlined />;
    case "question":
      return <QuestionMark />;
    case "condition":
      return <AltRouteRounded />;
    case "event":
      return <NewReleasesRounded />;
    case "comment":
      return <Tag />;
    default:
      return null;
  }
}

function FloatingToolbar() {
  const actions = useGraphActions();
  // const addNodeMenuItems = getAddNodeMenuItems({ actions });
  const { selectedNodeType } = useGraphState();
  const selectNodeMenuItems = getSelectNodeMenuItems({ actions });
  return (
    <Stack
      direction={"row"}
      spacing={1.3}
      className={
        "flex flex-row p-1 border border-slate-100 rounded-lg shadow-none bg-surface-light bg-opacity-60 justify-around"
      }
    >
      <Button
        className={`rounded-2xl p-2`}
        onClick={() => actions.centerView()}
      >
        <Fullscreen />
      </Button>
      <SplitButton
        items={selectNodeMenuItems}
        icon={getNodeTypeIcon(selectedNodeType)}
        label={`Add ${selectedNodeType}`}
        anchorOffset={{ x: 0, y: -1.5 }}
        onClick={() => {
          actions.handleAddNode({ type: selectedNodeType });
        }}
      />
    </Stack>
  );
}

export default FloatingToolbar;
