// src/components/SidebarEditor.tsx
import { Box, Divider, Drawer, IconButton, Typography } from "@mui/material";
import type { Edge, Node } from "@xyflow/react";
import { type ReactNode } from "react";
import EdgeEditor from "./EdgeEditor";

// (in futuro aggiungeremo anche NodeEditor ecc.)

interface SidebarEditorProps {
  open: boolean;
  onClose: () => void;
  selectedElement: Node | Edge | null;
  onSaveNode: (node: Node) => void;
  onSaveEdge: (edge: Edge) => void;
}

function SidebarEditor({
  open,
  onClose,
  selectedElement,
  onSaveNode,
  onSaveEdge,
}: SidebarEditorProps) {
  const renderContent = (): ReactNode => {
    if (!selectedElement)
      return (
        <Typography color="text.secondary" fontSize={20}>
          Seleziona un nodo o un collegamento per modificarne le proprietà.
        </Typography>
      );

    if ("source" in selectedElement) {
      // È un Edge
      return (
        <EdgeEditor
          edge={selectedElement}
          onCancel={onClose}
          onSave={(updated) => {
            onSaveEdge(updated);
          }}
        />
      );
    } else {
      // È un Node (in futuro gestiremo i tipi)
      return (
        <Typography color="text.secondary" fontSize={14}>
          Qui andrà il NodeEditor per i nodi di tipo {selectedElement.type}.
        </Typography>
      );
    }
  };

  const getTitle = () => {
    if (!selectedElement) return "Inspector";
    if ("source" in selectedElement) return "Edit Edge";
    return "Edit Node";
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="persistent"
      sx={{
        width: 320,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 320,
          boxSizing: "border-box",
          backgroundColor: "#fafafa",
          borderLeft: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          py: 1.5,
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        <IconButton
          style={{ outline: "none", color: "#252525ff" }}
          onClick={onClose}
          size="small"
        >
          {
            <svg
              width="24px"
              stroke-width="1.5"
              height="24px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
            >
              <path
                d="M19 21L5 21C3.89543 21 3 20.1046 3 19L3 5C3 3.89543 3.89543 3 5 3L19 3C20.1046 3 21 3.89543 21 5L21 19C21 20.1046 20.1046 21 19 21Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M9.5 21V3"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M5.5 10L7.25 12L5.5 14"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          }
        </IconButton>
        <Typography variant="subtitle1" fontWeight={600}>
          {getTitle()}
        </Typography>
        <span />
      </Box>

      {/* CONTENUTO */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {renderContent()}
      </Box>

      <Divider />
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          color: "text.secondary",
          fontSize: 12,
        }}
      >
        ConvoGraph © 2025
      </Box>
    </Drawer>
  );
}

export default SidebarEditor;
