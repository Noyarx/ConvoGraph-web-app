import { Input, Textarea, Typography } from "@material-tailwind/react";
import { MenuItem, Select, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useCharacterData,
  type CharacterDataContextType,
} from "../selectItems/CharacterDataContext";
import { operators, type SelectItem } from "../selectItems/SelectItems";
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

const itemClass = "!mx-1.5 !my-1 !rounded";
const itemHoverClass = "hover:!bg-slate-200";

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

  const { speakers, addSpeaker, getMoodsForSpeaker, addMoodToSpeaker } =
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
                    items: getMoodsForSpeaker(data.speaker || ""),
                    onAdd: (label) =>
                      addMoodToSpeaker(data.speaker || "", label),
                    placeholder: "Mood",
                  } as AddableSelectProps)}
                </Stack>
              </Stack>
              <Stack rowGap={0.5}>
                <label htmlFor="textarea">
                  <span className="">
                    <strong>Text:</strong>
                  </span>
                </label>
                <Textarea
                  key={"textarea"}
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
          <Stack direction={"column"} rowGap={2} maxWidth={270}>
            <Stack direction={"column"} rowGap={0.5}>
              <label htmlFor="varname">
                <span className="">
                  <strong>Variable name:</strong>
                </span>
              </label>
              <Input
                id={"varname"}
                key={"varname"}
                color={"info"}
                value={data.var_name || ""}
                onChange={(e) => handleChange("var_name", e.target.value)}
              />
            </Stack>

            <Stack direction={"row"} columnGap={4.5}>
              <Stack direction={"column"} maxWidth={100} rowGap={0.5}>
                <label htmlFor="operator">
                  <span className="">
                    <strong>operator:</strong>
                  </span>
                </label>
                <Select
                  id={"operator"}
                  key={"operator"}
                  value={data.operator || ""}
                  renderValue={(selected) => {
                    if (!selected) return <em>operator</em>;
                    return selected;
                  }}
                  onChange={(e) => handleChange("operator", e.target.value)}
                  sx={{
                    maxHeight: 36,
                    minWidth: 40,
                    maxWidth: 70,
                    textAlign: "center",
                    padding: 0,
                  }}
                  className="!border-none !outline-none hover:!ring-2 hover:!ring-blue-200 "
                >
                  {operators.map((item: any) => (
                    <MenuItem
                      className={`${itemClass} ${itemHoverClass}`}
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <Stack direction={"column"} maxWidth={180} rowGap={0.5}>
                {/* render different field based on operator type */}
                {data.operator === "is" ? (
                  <>
                    <label htmlFor="conditionalvalue">
                      <strong>value:</strong>
                    </label>
                    <Select
                      id={"value"}
                      key={"value"}
                      value={data.value || "null"}
                      renderValue={(selected) => {
                        if (selected !== "true" && selected !== "false")
                          return <em className="text-gray-400">boolean</em>;
                        return selected;
                      }}
                      onChange={(e) => handleChange("value", e.target.value)}
                      sx={{
                        maxHeight: 36,
                        minWidth: 40,
                        maxWidth: 120,
                        padding: 0,
                      }}
                      className="!border-none !outline-none hover:!ring-2 hover:!ring-blue-200 "
                    >
                      <MenuItem
                        className={`${itemClass} ${itemHoverClass}`}
                        key={"true"}
                        value={"true"}
                      >
                        true
                      </MenuItem>
                      <MenuItem
                        className={`${itemClass} ${itemHoverClass}`}
                        key={"false"}
                        value={"false"}
                      >
                        false
                      </MenuItem>
                    </Select>
                  </>
                ) : data.operator === "==" ? (
                  <>
                    <label htmlFor="conditionalvalue">
                      <strong>value:</strong>
                    </label>
                    <Input
                      id={"value"}
                      key={"value"}
                      color={"info"}
                      value={data.value || ""}
                      placeholder="Enter string"
                      onChange={(e) => handleChange("value", e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <label htmlFor="conditionalvalue">
                      <strong>value:</strong>
                    </label>
                    <Input
                      type={"number"}
                      id={"value"}
                      key={"value"}
                      color={"info"}
                      value={data.value || ""}
                      placeholder="0"
                      onChange={(e) => handleChange("value", e.target.value)}
                    />
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
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
