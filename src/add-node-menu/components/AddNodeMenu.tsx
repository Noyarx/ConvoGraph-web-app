import { Menu } from "@material-tailwind/react";
import AltRouteRoundedIcon from "@mui/icons-material/AltRouteRounded";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import TagIcon from "@mui/icons-material/Tag";
import type { JSX } from "react";
import { useGraphActions } from "../../editor/UseGraphActions";

const buttonClass = "flex gap-2 bg-none";
const quickColorTrans = {
  transitionProperty: "color, background-color",
  transitionDuration: "0.15s",
};

interface AddNodeMenuProps {
  triggerComponent: JSX.Element;
}

function AddNodeMenu({ triggerComponent }: AddNodeMenuProps) {
  const { handleAddNode } = useGraphActions();
  return (
    <>
      <Menu>
        {triggerComponent}
        <Menu.Content className="w-40">
          <Menu.Item
            onClick={() => {
              handleAddNode({
                type: "comment",
              });
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
              handleAddNode({
                type: "event",
              });
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
              handleAddNode({
                type: "condition",
              });
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
              handleAddNode({
                type: "question",
              });
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
              handleAddNode({
                type: "statement",
              });
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
