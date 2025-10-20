import { Input } from "@material-tailwind/react";
import { Stack } from "@mui/material";
import { useNodes, type Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
interface EdgeEditorProps {
  edge: Edge;
  onChange: (updatedEdge: Edge) => void;
}

function EdgeEditor({ edge, onChange }: EdgeEditorProps) {
  const nodes = useNodes();
  const [label, setLabel] = useState(edge.label || "");
  useEffect(() => {
    setLabel(edge.label || "");
  }, [edge]);

  const handleChange = (value: string) => {
    // create a new edge containing edge data + new label
    // also update the data text property as the new label
    const updatedEdge: Edge = {
      ...edge,
      label: value,
      data: { ...edge.data, text: value },
    };
    if (updatedEdge === edge) return;
    setLabel(value);
    onChange(updatedEdge);
  };

  return (
    <>
      {/* Row tra gruppo field e gruppo pulsanti */}
      <Stack rowGap={1} direction={"column"} sx={{ minWidth: 100 }}>
        {/* Stack tra field */}
        <Stack rowGap={0}>
          {/* Se il nodo source è di tipo 'question' mostra anche il field per la label */}
          {nodes.find((n) => n.id === edge.source)?.type === "question" ? (
            /* Stack del field + label */
            <Stack rowGap={0.3}>
              <label htmlFor="edge-label">
                <span className="">
                  <strong>Edge Label</strong>
                </span>
              </label>

              <Input
                id="edge-label"
                value={(label as string) || ""}
                onChange={(e) => handleChange(e.target.value)}
                type="text"
                color="secondary"
              />
            </Stack>
          ) : (
            <></>
          )}
        </Stack>
      </Stack>
    </>
  );
}

export default EdgeEditor;
