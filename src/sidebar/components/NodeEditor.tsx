import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import { useEffect, useState, type FormEventHandler } from "react";
interface NodeEditorProps {
  node: Record<string, any>;
  onSave: (updatedNode: Record<string, any>) => void;
  onCancel: () => void;
}

function NodeEditor({ node, onSave, onCancel }: NodeEditorProps) {
  const graphNode = node.data;
  const [data, setData] = useState(graphNode.data);

  // update editor field values on node selected change
  useEffect(() => {
    setData(graphNode.data);
  }, [node]);

  const handleChange = (path: string, value: any) => {
    let updated = {
      ...data,
    };
    if (path.startsWith("node_info.")) {
      const key = path.replace("node_info.", "");
      updated.node_info = {
        ...updated.node_info,
        [key]: value,
      };
    } else {
      updated[path] = value;
    }
    setData(updated);
  };

  const handleSubmit: FormEventHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedNode = { ...node, data: { ...graphNode, data } };
    onSave(updatedNode);
  };

  // Choose what fields to render based on selected node type
  const renderNodeFields = () => {
    switch (node.type) {
      case "question":
      case "statement":
        return (
          <>
            <Stack rowGap={2}>
              <Stack direction={"row"} columnGap={2}>
                <Stack rowGap={0.5}>
                  <label htmlFor="speaker-label">
                    <span className="">
                      <strong>Speaker:</strong>
                    </span>
                  </label>
                  <Input
                    value={data.speaker || ""}
                    onChange={(e) => handleChange("speaker", e.target.value)}
                  />
                </Stack>
                <Stack rowGap={0.5}>
                  <label htmlFor="mood-label">
                    <span className="">
                      <strong>Mood:</strong>
                    </span>
                  </label>
                  <Input
                    value={data.mood || ""}
                    onChange={(e) => handleChange("mood", e.target.value)}
                  />
                </Stack>
              </Stack>
              <Stack rowGap={0.5}>
                <label htmlFor="text-label">
                  <span className="">
                    <strong>Text:</strong>
                  </span>
                </label>
                <Textarea
                  value={data.text || ""}
                  onChange={(e) => handleChange("text", e.target.value)}
                />
              </Stack>
            </Stack>
          </>
        );
      case "condition":
        return (
          <>
            <Input
              value={data.condition || ""}
              onChange={(e) => handleChange("condition", e.target.value)}
            />
          </>
        );
      case "event":
        return (
          <>
            <Input
              value={data.event_name || ""}
              onChange={(e) => handleChange("event_name", e.target.value)}
            />
          </>
        );
      case "comment":
        return (
          <>
            <Input
              value={data.text || ""}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </>
        );
      default:
        return (
          <Typography fontSize={14}>
            Nessun editor disponibile per il tipo di nodo "{node.type}".
          </Typography>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderNodeFields()}
      <Stack
        paddingTop={1.2}
        direction={"row"}
        justifyContent={"flex-start"}
        gap={1.2}
      >
        <Button
          type="submit"
          variant="gradient"
          color="success"
          style={{ transition: "background-color 0.2s" }}
        >
          <CheckIcon />
        </Button>
        <Button
          type="button"
          style={{ transition: "background-color 0.2s" }}
          variant="outline"
          color="error"
          onClick={onCancel}
        >
          <CloseIcon />
        </Button>
      </Stack>
    </form>
  );
}

export default NodeEditor;
