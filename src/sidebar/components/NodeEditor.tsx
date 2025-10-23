import { Input, Textarea, Typography } from "@material-tailwind/react";
import { MenuItem, Select, Stack } from "@mui/material";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { moods, speakers } from "../selectItems/itemLists";
interface NodeEditorProps {
  node: Record<string, any>;
  onChange: (updatedNode: Record<string, any>) => void;
}
const itemClass = "!mx-1.5 !my-1 !rounded";
const itemHoverClass = "hover:!bg-slate-200";
function NodeEditor({ node, onChange }: NodeEditorProps) {
  const graphNode = node.data;
  const [data, setData] = useState(graphNode.data);

  // update editor field values on node selected change
  useEffect(() => {
    setData(graphNode.data);
  }, [node.id]);

  const handleChange = (key: string, value: any) => {
    const updatedData = { ...data, [key]: value };
    setData(updatedData);
    onChange({
      ...node,
      data: {
        ...graphNode,
        node_info: {
          ...graphNode.node_info,
          position: node.position,
        },
        data: updatedData,
      },
    });
  };

  const speakerItems = useMemo((): ReactNode[] => {
    return speakers.map((e) => (
      <MenuItem className={`${itemClass} ${itemHoverClass}`} value={e.value}>
        {e.label}
      </MenuItem>
    ));
  }, [speakers]);

  const moodItems = useMemo((): ReactNode[] => {
    return moods.map((e) => (
      <MenuItem className={`${itemClass} ${itemHoverClass}`} value={e.value}>
        {e.label}
      </MenuItem>
    ));
  }, [moods]);

  // Choose what fields to render based on selected node type
  const renderNodeFields = () => {
    switch (node.type) {
      case "question":
      case "statement":
        return (
          <>
            <Stack rowGap={2}>
              <Stack direction={"row"} columnGap={4}>
                <Stack rowGap={0.5}>
                  <label htmlFor="speaker">
                    <span className="">
                      <strong>Speaker:</strong>
                    </span>
                  </label>

                  <Select
                    className="h-10 w-32 border rounded-md"
                    value={data.speaker || ""}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>Speaker</em>;
                      }

                      return speakers.find((e) => e.value === selected)?.label;
                    }}
                    onChange={(e: any) =>
                      handleChange("speaker", e.target.value)
                    }
                  >
                    {speakerItems}
                  </Select>
                </Stack>
                <Stack rowGap={0.5}>
                  <label htmlFor="mood">
                    <span className="">
                      <strong>Mood:</strong>
                    </span>
                  </label>
                  <Select
                    className="h-10 w-32 border rounded-md"
                    value={data.mood || ""}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>Mood</em>;
                      }

                      return moods.find((e) => e.value === selected)?.label;
                    }}
                    onChange={(e: any) => handleChange("mood", e.target.value)}
                  >
                    {moodItems}
                  </Select>
                </Stack>
              </Stack>
              <Stack rowGap={0.5}>
                <label htmlFor="text-label">
                  <span className="">
                    <strong>Text:</strong>
                  </span>
                </label>
                <Textarea
                  color="info"
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
