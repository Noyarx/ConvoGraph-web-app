import { Button } from "@material-tailwind/react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { useReactFlow } from "@xyflow/react";
import { exportTimelineToJSON } from "../../export/JsonExport";
import { importTimelineFromJSON } from "../../import/JsonImport";
import {
  flowToGraphTree,
  toXYFlowEdges,
  toXYFlowNodes,
} from "../../nodes/utils/xyflowAdapter";
import { useFlowHistory } from "../../flow-history/FlowHistoryContext";
import { usePreviewContext } from "../../preview/PreviewContext";

interface HeaderProps {
  onPreview: () => void;
}

function Header({ onPreview }: HeaderProps) {
  const flowHistory = useFlowHistory();
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const { active: isPreview } = usePreviewContext();

  const handleExport = () => {
    const graphNodes = flowToGraphTree(getNodes(), getEdges());
    if (getNodes().length < 1) {
      alert("⚠️ There is no nodes to export!");
      return;
    }
    exportTimelineToJSON(graphNodes);
  };

  const handleImport = async () => {
    const importedTimeline = await importTimelineFromJSON();
    const { nodes } = importedTimeline;
    // Set reactflow tree graph
    if (nodes) {
      setNodes(toXYFlowNodes(nodes));
      setEdges(toXYFlowEdges(nodes));
    }
    // Reset undo-redo history stacks
    flowHistory.clearHistory();
  };

  return (
    <div className="fixed top-0 left-0 !m-0 w-screen pointer-events-none">
      <div className="shadow-none border-b border-gray-50 p-1 bg-surface-light bg-opacity-60">
        <div className="flex flex-row gap-2 justify-between">
          {/* <img className="select-none" src={logo} width="64px" height="64px" /> */}
          <div className="flex flex-row gap-2 pr-2 items-center pointer-events-auto">
            <Button
              style={{
                transitionProperty: "background-color color",
                transitionDuration: "0.2s",
              }}
              className="flex flex-row p-2 gap-2 justify-between"
              type="button"
              variant="solid"
              onClick={handleImport}
              disabled={isPreview}
            >
              <p>
                <strong>Import</strong>
              </p>
              <UploadFileRoundedIcon />
            </Button>
            <Button
              style={{
                transitionProperty: "background-color color",
                transitionDuration: "0.2s",
              }}
              className="flex flex-row p-2 gap-2 justify-between"
              type="button"
              variant="solid"
              onClick={handleExport}
              disabled={isPreview}
            >
              <p>
                <strong>Export</strong>
              </p>
              <FileDownloadOutlinedIcon />
            </Button>
          </div>
          <div className="flex flex-row gap-2 pl-2 items-center pointer-events-auto">
            <Button
              style={{
                transitionProperty: "background-color color",
                transitionDuration: "0.2s",
              }}
              className="flex flex-row p-2 gap-2 justify-between"
              type="button"
              variant="solid"
              onClick={onPreview}
            >
              <PlayArrowRounded />
              <p>
                <strong>Preview</strong>
              </p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
