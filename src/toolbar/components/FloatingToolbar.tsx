import { Button, Menu } from "@material-tailwind/react";
import { KeyboardArrowUpRounded } from "@mui/icons-material";
import { Stack } from "@mui/material";
import AddNodeMenu from "../../add-node-menu/components/AddNodeMenu";

const toolbarMenuButton = (
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
);

function FloatingToolbar() {
  return (
    <Stack
      direction={"row"}
      spacing={1.3}
      className={
        "flex flex-row p-1 border border-slate-100 rounded-lg shadow-none bg-surface-light bg-opacity-60 justify-around"
      }
    >
      <AddNodeMenu triggerComponent={toolbarMenuButton} />
    </Stack>
  );
}

export default FloatingToolbar;
