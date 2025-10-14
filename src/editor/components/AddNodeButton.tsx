import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup/ButtonGroup";

export default function AddNodeButton({ onClick }: any) {
  return (
    <div id="add-node-button-container" className="">
      <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button onClick={onClick}>
          <AddIcon></AddIcon>
        </Button>
      </ButtonGroup>
    </div>
  );
}
