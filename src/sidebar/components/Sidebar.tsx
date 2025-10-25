import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { type Edge, type Node } from "@xyflow/react";
import { useEffect, useState, type ReactNode } from "react";
import EdgeEditor from "./EdgeEditor";
import NodeEditor from "./NodeEditor";
import { CharacterDataProvider } from "../selectItems/CharacterDataContext";

// (in futuro aggiungeremo anche NodeEditor ecc.)

interface SidebarEditorProps {
  open: boolean;
  onClose: () => void;
  selectedElement: Node | Edge | null;
  onSaveNode: (node: Node) => void;
  onSaveEdge: (edge: Edge) => void;
}

function Sidebar({
  open,
  onClose,
  selectedElement,
  onSaveNode,
  onSaveEdge,
}: SidebarEditorProps) {
  const [element, setElement] = useState<Node | Edge | null>(selectedElement);
  const [modified, setModified] = useState(false);

  // update sidebar on newly selected node
  useEffect(() => {
    if (selectedElement) {
      setElement(selectedElement);
      setModified(false);
    }
  }, [selectedElement]);

  // set modified based on wether the changed element is equal to the one before the changes or not
  useEffect(() => {
    if (!selectedElement || !element) return;
    setModified(JSON.stringify(selectedElement) !== JSON.stringify(element));
  }, [selectedElement, element]);

  // send the changed nodes to GraphEditor
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElement || !modified) return;
    if ("source" in selectedElement) {
      onSaveEdge(element as Edge);
    } else {
      onSaveNode(element as Node);
    }
    setModified(false);
  };

  // Simulates form submit whenever user unfocuses fields
  function simulateSubmit() {
    const submitter = document.createElement("button");
    submitter.type = "submit";
    submitter.style.display = "none";
    const form: HTMLFormElement = document.querySelector(
      "#node-edit-form"
    ) as HTMLFormElement;
    form.appendChild(submitter);
    submitter.click();
    form.removeChild(submitter);
  }

  function handleChange(value: any) {
    setElement(value);
  }

  const renderContent = (): ReactNode => {
    return (
      <>
        <CharacterDataProvider>
          {!selectedElement ? (
            <Typography color="text.secondary" fontSize={20}>
              Seleziona un nodo o un collegamento per modificarne le proprietà.
            </Typography>
          ) : "source" in selectedElement ? (
            <EdgeEditor edge={selectedElement} onChange={handleChange} />
          ) : (
            <NodeEditor node={selectedElement} onChange={handleChange} />
          )}
        </CharacterDataProvider>
      </>
    );
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
        {selectedElement?.id ? (
          <Typography variant="subtitle1" fontWeight={600}>
            ID: {selectedElement.id}
          </Typography>
        ) : (
          <></>
        )}
        <form
          id="node-edit-form"
          onBlur={simulateSubmit}
          onSubmit={handleSubmit}
        >
          {/* FORM MODULARE */}
          {renderContent()}
          {/* PULSANTI */}
          <Stack
            id="ciao"
            paddingTop={2}
            direction={"row"}
            justifyContent={"center"}
            gap={1.2}
          >
            {/* <Button
              type="submit"
              variant={"outline"}
              disabled={modified ? false : true}
              color={modified ? "success" : "secondary"}
              className="w-56"
              style={{ transition: "background-color 0.2s" }}
            >
              <CheckIcon />
            </Button> */}
          </Stack>
        </form>
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

export default Sidebar;
