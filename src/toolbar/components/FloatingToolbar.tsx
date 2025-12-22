import { Button, Menu } from "@material-tailwind/react";
import { KeyboardArrowUpRounded } from "@mui/icons-material";
import AltRouteRoundedIcon from "@mui/icons-material/AltRouteRounded";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import TagIcon from "@mui/icons-material/Tag";
import { Stack } from "@mui/material";

const flexGapped = "flex gap-2";
const quickColorTrans = {
  transitionProperty: "color, background-color",
  transitionDuration: "0.15s",
};
interface FloatingToolbarProps {
  onAddNode: (
    type: "statement" | "question" | "condition" | "event" | "comment"
  ) => void;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "right"
    | "right-start"
    | "right-end"
    | "left"
    | "left-start"
    | "left-end";
}

function FloatingToolbar({ onAddNode, placement }: FloatingToolbarProps) {
  return (
    <Stack
      direction={"row"}
      spacing={1.3}
      className={
        "flex flex-row p-1 border border-slate-100 rounded-lg shadow-none bg-surface-light bg-opacity-60 justify-around"
      }
    >
      <Menu placement={placement || "top"}>
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
            className={`${flexGapped}  bg-none hover:!bg-green-200`}
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
            className={`${flexGapped} bg-none hover:!bg-orange-200`}
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
            className={`${flexGapped} bg-none  hover:!bg-pink-200`}
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
            className={`${flexGapped} bg-none hover:!bg-teal-500 hover:!bg-opacity-40`}
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
            className={`${flexGapped} bg-none hover:!bg-blue-500 hover:!bg-opacity-50`}
          >
            <span>
              <ChatOutlinedIcon />
            </span>
            <span>Statement</span>
          </Menu.Item>
        </Menu.Content>
      </Menu>
    </Stack>
  );
}

export default FloatingToolbar;
