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
  const [data, setData] = useState<Record<string, any> | null>(
    edge.data || null
  );

  useEffect(() => {
    setLabel(edge.label || "");
    setData({ ...edge.data });
  }, [edge.id]);

  const handleChangeData = (key: string, value: any) => {
    const updatedData = { ...data, [key]: value };
    setData(updatedData);
    onChange({
      ...edge,
      data: updatedData,
    });
  };

  const handleChangeLabel = (value: string) => {
    // create a new edge containing edge data + new label
    // also update the data text property as the new label
    const updatedEdge: Edge = {
      ...edge,
      label: value,
      data: { ...data, text: value },
    };
    if (updatedEdge === edge) return;
    setLabel(value);
    onChange(updatedEdge);
  };

  return (
    <>
      {/* Se il nodo source è di tipo 'question' mostra anche il field per la label */}
      {nodes.find((n) => n.id === edge.source)?.type === "question" ? (
        /* Stack del field + label */
        <>
          <Stack rowGap={2} maxWidth={250}>
            <Stack rowGap={0.5}>
              <label>
                <span className="">
                  <strong>Color</strong>
                </span>
              </label>
              <input
                className="rounded-md max-w-10"
                type="color"
                id="label-color"
                value={data?.color || "#F5F5F5"}
                onChange={(e) => handleChangeData("color", e.target.value)}
              />
            </Stack>

            <Stack rowGap={0.5}>
              <label htmlFor="edge-label">
                <span className="">
                  <strong>Edge Label</strong>
                </span>
              </label>
              <Input
                type="text"
                id="edge-label"
                value={(label as string) || ""}
                onChange={(e) => handleChangeLabel(e.target.value)}
                color="secondary"
              />
            </Stack>
            <Stack rowGap={0.5}>
              <label htmlFor="choice-index">
                <span className="">
                  <strong>Choice index</strong>
                </span>
              </label>
              <Input
                className="max-w-20"
                type="number"
                required
                min={0}
                max={10}
                id="choice-index"
                value={(data?.index as number) || ""}
                placeholder="null"
                onChange={(e) => handleChangeData("index", e.target.value)}
                color="secondary"
              />
            </Stack>
          </Stack>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default EdgeEditor;
