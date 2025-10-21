import { Button } from "@material-tailwind/react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { useReactFlow } from "@xyflow/react";
import { exportTimelineToJSON } from "../../export/JsonExport";
import { importTimelineFromJSON } from "../../import/JsonImport";
import {
  flowToGraphTree,
  toXYFlowEdges,
  toXYFlowNodes,
} from "../../nodes/utils/xyflowAdapter";

function Header() {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const graphNodes = flowToGraphTree(getNodes(), getEdges());

  const handleExport = () => {
    if (getNodes().length < 1) {
      console.log(getNodes().length);
      alert("⚠️ There is no nodes to export!");
      return;
    }
    exportTimelineToJSON(graphNodes);
  };

  const handleImport = async () => {
    const importedTimeline = await importTimelineFromJSON();
    const { nodes } = importedTimeline;
    // console.log(importedTimeline);
    // set reactflow tree graph
    if (nodes) {
      setNodes(toXYFlowNodes(nodes));
      setEdges(toXYFlowEdges(nodes));
    }
  };

  return (
    <div className="fixed top-0 left-0 !m-0 w-screen pointer-events-none">
      <div className="bg-gradient-to-b from-slate-300 to-slate-50">
        <div className="flex flex-row gap-2 justify-between">
          {/* <img className="select-none" src={logo} width="64px" height="64px" /> */}
          <div className="flex flex-row gap-2 pr-2 items-center pointer-events-auto">
            <Button
              className="flex flex-row p-2 gap-2 justify-between"
              type="button"
              variant="gradient"
              onClick={handleImport}
            >
              <p>
                <strong>Import</strong>
              </p>
              <UploadFileRoundedIcon />
            </Button>
            <Button
              className="flex flex-row p-2 gap-2 justify-between"
              type="button"
              variant="gradient"
              onClick={handleExport}
            >
              <p>
                <strong>Export</strong>
              </p>
              <FileDownloadOutlinedIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
