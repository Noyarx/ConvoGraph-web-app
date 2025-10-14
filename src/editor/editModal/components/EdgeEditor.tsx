import { Label } from "@mui/icons-material";
import { Button, Stack, TextField, Typography } from "@mui/material";
import type { Edge } from "@xyflow/react";
import { useState, type FormEventHandler } from "react";

interface EdgeEditorProps {
  edge: Edge;
  onSave: (updatedEdge: Edge) => void;
}

function EdgeEditor({ edge, onSave }: EdgeEditorProps) {
  const [label, setLabel] = useState(edge.label || "");

  const handleSubmit: FormEventHandler = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...edge, label });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} direction={"column"} sx={{ minWidth: 100 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Edge ID: {edge.id}
        </Typography>
      </Stack>
      <TextField
        id="edge-text"
        label="Edge label"
        variant="outlined"
        value={label || ""}
        onChange={(e) => setLabel(e.target.value)}
      />
      <Stack direction={"row"}>
        <Button type="submit" variant="contained" color="success">
          Save Changes
        </Button>
      </Stack>
    </form>
  );
}

export default EdgeEditor;
