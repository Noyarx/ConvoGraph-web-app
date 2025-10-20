import { Input, Textarea, Typography } from "@material-tailwind/react";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
interface NodeEditorProps {
  node: Record<string, any>;
  onChange: (updatedNode: Record<string, any>) => void;
}

function NodeEditor({ node, onChange }: NodeEditorProps) {
  const graphNode = node.data;
  const [data, setData] = useState(graphNode.data);

  // update editor field values on node selected change
  useEffect(() => {
    setData(graphNode.data);
  }, [node]);

  const handleChange = (key: string, value: any) => {
    const updatedData = { ...data, [key]: value };
    setData(updatedData);
    onChange({
      ...node,
      data: {
        ...node.data,
        data: updatedData,
      },
    });
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

  return <>{renderNodeFields()}</>;
}

export default NodeEditor;
