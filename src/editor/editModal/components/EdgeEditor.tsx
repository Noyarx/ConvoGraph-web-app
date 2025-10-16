import { Button, Input } from "@material-tailwind/react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Stack, Typography } from "@mui/material";
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
    const updatedEdge = { ...edge, label };
    if (updatedEdge === edge) return;
    onSave(updatedEdge);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack rowGap={2} direction={"column"} sx={{ minWidth: 100 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Edge ID: {edge.id}
        </Typography>

        <Stack rowGap={0.3}>
          {/* Se il nodo source è di tipo 'question' mostra anche il field per la label */}
          {nodes.find((n) => n.id === edge.source)?.type === "question" ? (
            <>
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
            </>
          ) : (
            <></>
          )}
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
