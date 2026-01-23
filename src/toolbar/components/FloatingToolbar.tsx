import { Button } from "@material-tailwind/react";
import { Add, Fullscreen } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { useGraphActions } from "../../editor/UseGraphActions";
import { getAddNodeMenuItems } from "../../menu/addNodeMenuItems";
import ButtonMenu from "../../menu/button-menu/ButtonMenu";

function FloatingToolbar() {
  const actions = useGraphActions();
  const addNodeMenuItems = getAddNodeMenuItems({ actions });
  return (
    <Stack
      direction={"row"}
      spacing={1.3}
      className={
        "flex flex-row p-1 border border-slate-100 rounded-lg shadow-none bg-surface-light bg-opacity-60 justify-around"
      }
    >
      <Button
        className={`rounded-xl p-1.5`}
        onClick={() => actions.centerView()}
      >
        <Fullscreen />
      </Button>
      <ButtonMenu
        anchorOffset={{ x: 0, y: -1.5 }}
        label={"Add new node"}
        startIcon={<Add />}
        items={addNodeMenuItems}
      />
    </Stack>
  );
}

export default FloatingToolbar;
