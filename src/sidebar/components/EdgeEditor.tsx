import { Button, Input } from "@material-tailwind/react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import { useNodes, type Edge } from "@xyflow/react";
import { useEffect, useState, type FormEventHandler } from "react";
interface EdgeEditorProps {
  edge: Edge;
  onSave: (updatedEdge: Edge) => void;
  onCancel: () => void;
}

function EdgeEditor({ edge, onSave, onCancel }: EdgeEditorProps) {
  const [label, setLabel] = useState(edge.label || "");
  const nodes = useNodes();
  useEffect(() => {
    setLabel(edge.label || "");
  }, [edge]);

  const handleSubmit: FormEventHandler = (e: React.FormEvent) => {
    e.preventDefault();
    // create a new edge containing edge data + new label
    // also update the data text property as the new label
    const updatedEdge: Edge = {
      ...edge,
      label,
      data: { ...edge.data, text: label },
    };
    if (updatedEdge === edge) return;
    onSave(updatedEdge);
  };

  return (
    <form onSubmit={handleSubmit}>
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
                onChange={(e) => setLabel(e.target.value)}
                type="text"
                color="secondary"
              />
            </Stack>
          ) : (
            <></>
          )}

          {/* Stack tra i pulsanti */}
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
        </Stack>
      </Stack>
    </form>
  );
}

export default EdgeEditor;
