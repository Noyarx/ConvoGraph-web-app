import { Button } from "@material-tailwind/react";
import AddIcon from "@mui/icons-material/Add";
import type { ReactNode } from "react";

interface AddNodeButtonProps {
  onAddNode: (type: "statement" | "question" | "condition" | "event") => void;
  color: string;
  text?: string;
  type: "statement" | "question" | "condition" | "event";
}

function getButtonClass(
  type: "statement" | "question" | "condition" | "event"
): string {
  switch (type) {
    case "statement":
      return "font-serif border-blue-800 bg-gradient-to-tr from-blue-900 to-blue-500";
    case "question":
      return "font-serif border-teal-800 bg-gradient-to-tr from-cyan-900 to-teal-500";
    case "condition":
      return "font-serif border-pink-800 bg-gradient-to-tr from-pink-700 to-pink-300";
    case "event":
      return "font-serif border-orange-800 bg-gradient-to-tr from-orange-700 to-orange-300";
  }
}

function AddNodeButton({
  onAddNode,
  color,
  text,
  type,
}: AddNodeButtonProps): ReactNode {
  return (
    <Button
      variant="gradient"
      className={getButtonClass(type)}
      onClick={() => {
        onAddNode(type);
      }}
    >
      <AddIcon />
      <span>{text || type}</span>
    </Button>
  );
}

export default AddNodeButton;
