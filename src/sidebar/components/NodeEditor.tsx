import { Input, Textarea, Typography } from "@material-tailwind/react";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useCharacterData,
  type CharacterDataContextType,
} from "../selectItems/CharacterDataContext";
import { type SelectItem } from "../selectItems/SelectItems";
import AddableSelect from "../selectItems/components/AddableSelect";
interface NodeEditorProps {
  node: Record<string, any>;
  onChange: (updatedNode: Record<string, any>) => void;
}

interface AddableSelectProps {
  value: string;
  items: SelectItem[];
  onChange: (val: string) => void;
  onAdd: (label: string) => void;
  placeholder?: string;
}

function NodeEditor({ node, onChange }: NodeEditorProps) {
  const graphNode = node.data;
  const [data, setData] = useState(graphNode.data);
  const context = useCharacterData();

  function renderSelectField(props: AddableSelectProps) {
    if (!context) return null;
    return (
      <AddableSelect
        value={props.value}
        onChange={props.onChange}
        onAdd={props.onAdd}
        items={props.items}
        placeholder={props.placeholder}
      />
    );
  }

  const { speakers, moods, addSpeaker, addMood } =
    context as CharacterDataContextType;

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

  // Choose what fields to render based on selected node type
  const renderNodeFields = () => {
    switch (node.type) {
      case "question":
      case "statement":
        return (
          <>
            <Stack rowGap={2}>
              <Stack direction={"row"} columnGap={1}>
                <Stack rowGap={0.5}>
                  <label htmlFor="speaker">
                    <span className="">
                      <strong>Speaker:</strong>
                    </span>
                  </label>
                  {renderSelectField({
                    value: data.speaker || "",
                    items: speakers,
                    onChange: (val) => handleChange("speaker", val),
                    onAdd: addSpeaker,
                    placeholder: "Speaker",
                  } as AddableSelectProps)}
                </Stack>

                <Stack rowGap={0.5}>
                  <label htmlFor="mood">
                    <span className="">
                      <strong>Mood:</strong>
                    </span>
                  </label>
                  {renderSelectField({
                    value: data.mood || "",
                    onChange: (val) => handleChange("mood", val),
                    items: moods,
                    onAdd: addMood,
                    placeholder: "Mood",
                  } as AddableSelectProps)}
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
