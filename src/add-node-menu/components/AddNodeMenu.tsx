import { Button, Menu } from "@material-tailwind/react";
import { KeyboardArrowUpRounded } from "@mui/icons-material";
import AltRouteRoundedIcon from "@mui/icons-material/AltRouteRounded";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import TagIcon from "@mui/icons-material/Tag";
import type { nodeTypeString } from "../../models/NodeTypes.model";

const buttonClass = "flex gap-2 bg-none";
const quickColorTrans = {
  transitionProperty: "color, background-color",
  transitionDuration: "0.15s",
};

interface AddNodeMenuProps {
  onAddNode: (type: nodeTypeString) => void;
}

function AddNodeMenu({ onAddNode }: AddNodeMenuProps) {
  return (
    <>
      <Menu>
        <Menu.Trigger
          as={Button}
          variant="gradient"
          className="flex pl-1 pr-2 min-w-20 align-middle justify-evenly"
        >
          <span>
            <KeyboardArrowUpRounded viewBox="0 1 24 24" />
          </span>
          <span>Add Node</span>
        </Menu.Trigger>
        <Menu.Content className="w-40">
          <Menu.Item
            onClick={() => {
              onAddNode("comment");
            }}
            style={quickColorTrans}
            className={`${buttonClass} hover:!bg-green-200`}
          >
            <span>
              <TagIcon></TagIcon>
            </span>
            <span>Comment</span>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onAddNode("event");
            }}
            style={quickColorTrans}
            className={`${buttonClass} hover:!bg-orange-200`}
          >
            <span>
              <NewReleasesRoundedIcon />
            </span>
            <span>Event</span>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onAddNode("condition");
            }}
            style={quickColorTrans}
            className={`${buttonClass}  hover:!bg-pink-200`}
          >
            <span>
              <AltRouteRoundedIcon className="rotate-180" />
            </span>
            <span>Condition</span>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onAddNode("question");
            }}
            style={quickColorTrans}
            className={`${buttonClass} hover:!bg-teal-500 hover:!bg-opacity-40`}
          >
            <span>
              <QuestionMarkIcon />
            </span>
            <span>Question</span>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onAddNode("statement");
            }}
            style={quickColorTrans}
            className={`${buttonClass} hover:!bg-blue-500 hover:!bg-opacity-50`}
          >
            <span>
              <ChatOutlinedIcon />
            </span>
            <span>Statement</span>
          </Menu.Item>
        </Menu.Content>
      </Menu>
    </>
  );
}

export default AddNodeMenu;
