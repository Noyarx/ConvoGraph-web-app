import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState, type FormEventHandler } from "react";

interface NodeEditorProps {
  node: Record<string, any>;
  onSave: (updatedNode: Record<string, any>) => void;
}

function NodeEditor({ node, onSave }: NodeEditorProps) {
  const [title, setTitle] = useState<string>(node.data.node_info.title);
  const handleSubmit: FormEventHandler = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...node,
      data: {
        ...node.data,
        node_info: { ...node.data.node_info, title: title },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} direction={"column"} sx={{ minWidth: 100 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Node ID: {node.id}
        </Typography>
      </Stack>
      <TextField
        id="edge-text"
        label="Node Title"
        variant="outlined"
        value={title || ""}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Stack direction={"row"}>
        <Button type="submit" variant="contained" color="success">
          Save Changes
        </Button>
      </Stack>
    </form>
  );
}

export default NodeEditor;
