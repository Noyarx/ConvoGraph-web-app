import { Button, Stack, TextField, Typography } from "@mui/material";
import type { Node } from "@xyflow/react";
import { useState, type FormEvent } from "react";

interface NodeEditorProps {
  node: Record<string, any>;
}

function NodeEditor({ node }: NodeEditorProps) {
  const [title, setTitle] = useState<string>(node.data.node_info.title);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error("Function not implemented.");
  }

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
        // onChange={(e) => setLabel(e.target.value)}
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
