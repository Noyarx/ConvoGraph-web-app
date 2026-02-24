import { Input, Textarea, Typography } from "@material-tailwind/react";
import { IconButton, MenuItem, Select, Stack, Tooltip, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import {
  useCharacterData,
  type CharacterDataContextType,
} from "../selectItems/CharacterDataContext";
import { operators, type SelectItem } from "../selectItems/SelectItems";
import { generateDialogue, fixGrammar, type HistoryMessage } from "../../ai/llamaService";
import { useCharacters } from "../../characters/CharactersContext";

interface NodeEditorProps {
  node: Record<string, any>;
  onChange: (updatedNode: Record<string, any>) => void;
}

interface SelectFieldProps {
  value: string;
  items: SelectItem[];
  onChange: (val: string) => void;
  placeholder?: string;
}

const itemClass = "!mx-1.5 !my-1 !rounded";
const itemHoverClass = "hover:!bg-slate-200";

function NodeEditor({ node, onChange }: NodeEditorProps) {
  const graphNode = node.data;
  const [data, setData] = useState(graphNode.data);
  const [aiLoading, setAiLoading] = useState(false);
  const { getNodes, getEdges } = useReactFlow();
  const { characters } = useCharacters();
  const context = useCharacterData();

  function getHistory(): HistoryMessage[] {
    const nodes = getNodes();
    const edges = getEdges();
    const messages: HistoryMessage[] = [];
    const visited = new Set<string>();
    let currentId = node.id;

    // Walk backward through parent edges, up to 10 dialogue nodes
    while (messages.length < 10) {
      const parentEdge = edges.find(e => e.target === currentId && !visited.has(e.source));
      if (!parentEdge) break;
      visited.add(parentEdge.source);

      const parentNode = nodes.find(n => n.id === parentEdge.source);
      if (!parentNode) break;

      const type = parentNode.type;
      if (type === "statement" || type === "question") {
        const d = (parentNode.data as any).data;
        if (d?.text?.trim()) {
          messages.unshift({ speaker: d.speaker || "", mood: d.mood || "", text: d.text });
        }
      }
      currentId = parentEdge.source;
    }
    return messages;
  }

  function renderSelectField(props: SelectFieldProps) {
    if (!context) return null;
    return (
      <Select
        value={props.value}
        renderValue={(selected) => {
          if (!selected) return <em>{props.placeholder}</em>;
          return props.items.find((e) => e.value === selected)?.label;
        }}
        onChange={(e) => props.onChange(e.target.value)}
        style={{ border: "none", outline: "none" }}
        sx={{ maxHeight: 36, minWidth: 0, width: "100%" }}
        className="hover:!ring-2 hover:!ring-blue-200"
      >
        {props.items.map((item) => (
          <MenuItem
            className={`${itemClass} ${itemHoverClass}`}
            key={item.value}
            value={item.value}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    );
  }

  const { speakers, getMoodsForSpeaker, getDefaultMoodForSpeaker } =
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
              <Stack direction={"row"} columnGap={1} sx={{ width: "100%" }}>
                <Stack rowGap={0.5} sx={{ flex: 1, minWidth: 0 }}>
                  <label htmlFor="speaker">
                    <span className="">
                      <strong>Speaker:</strong>
                    </span>
                  </label>
                  {renderSelectField({
                    value: data.speaker || "",
                    items: speakers,
                    onChange: (val) => {
                      const defaultMood = getDefaultMoodForSpeaker(val);
                      const updatedData = { ...data, speaker: val, mood: defaultMood };
                      setData(updatedData);
                      onChange({
                        ...node,
                        data: {
                          ...graphNode,
                          node_info: { ...graphNode.node_info, position: node.position },
                          data: updatedData,
                        },
                      });
                    },
                    placeholder: "Speaker",
                  })}
                </Stack>

                <Stack rowGap={0.5} sx={{ flex: 1, minWidth: 0 }}>
                  <label htmlFor="mood">
                    <span className="">
                      <strong>Mood:</strong>
                    </span>
                  </label>
                  {renderSelectField({
                    value: data.mood || "",
                    onChange: (val) => handleChange("mood", val),
                    items: getMoodsForSpeaker(data.speaker || ""),
                    placeholder: "Mood",
                  })}
                </Stack>
              </Stack>
              <Stack rowGap={0.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <label htmlFor="textarea">
                    <span>
                      <strong>Text:</strong>
                    </span>
                  </label>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Fix grammar" arrow>
                      <span>
                        <IconButton
                          size="small"
                          disabled={aiLoading || !data.text?.trim()}
                          onClick={async () => {
                            setAiLoading(true);
                            try {
                              const result = await fixGrammar(data.text);
                              handleChange("text", result);
                            } catch (e) {
                              const msg = e instanceof Error ? e.message : "Unknown error";
                              handleChange("text", `[AI Error] ${msg}`);
                            } finally {
                              setAiLoading(false);
                            }
                          }}
                          sx={{ color: "#6366f1", padding: "2px" }}
                        >
                          {aiLoading ? (
                            <CircularProgress size={18} sx={{ color: "#6366f1" }} />
                          ) : (
                            <SpellcheckIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Generate with AI" arrow>
                      <span>
                        <IconButton
                          size="small"
                          disabled={aiLoading || !data.text?.trim()}
                          onClick={async () => {
                            setAiLoading(true);
                            try {
                              const char = characters.find(c => c.name === data.speaker);
                              const result = await generateDialogue({
                                speaker: data.speaker || "",
                                mood: data.mood || "",
                                prompt: data.text,
                                history: getHistory(),
                                description: char?.description || "",
                              });
                              handleChange("text", result);
                            } catch (e) {
                              const msg = e instanceof Error ? e.message : "Unknown error";
                              handleChange("text", `[AI Error] ${msg}`);
                            } finally {
                              setAiLoading(false);
                            }
                          }}
                          sx={{ color: "#6366f1", padding: "2px" }}
                        >
                          {aiLoading ? (
                            <CircularProgress size={18} sx={{ color: "#6366f1" }} />
                          ) : (
                            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </Stack>
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
