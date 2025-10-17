import React from "react";
import { Drawer, IconButton } from "@mui/material";
import { PersisterService, type ListItem } from "../service/test";
import { AddCircleOutline } from "@mui/icons-material";
import { RichTreeView } from "@mui/x-tree-view";
export interface PersistSidebarProps { }
const ps = PersisterService.getInstance();
export function PersistSidebar({ }: PersistSidebarProps) {

    const [open, setOpen] = React.useState(true);

    const [files, setFiles] = React.useState<ListItem[]>([]);

    React.useEffect(() => {
        const id = setTimeout(async () => {
            if (ps.isInitialized) {
                const fileList = await ps.readdir('/');
                setFiles(fileList);
            }
        }, 1000);
        return () => clearTimeout(id);
    }, [ps]);

    const onAddFile = async () => {
        const filename = window.prompt('Enter file name');
        if (filename) {
            if (filename.startsWith('/')) {
                await ps.mkdir(`${filename.slice(1)}`);
            }
            else {
                await ps.writeFile(filename, '');
            }
            const fileList = await ps.readdir();
            setFiles(fileList);
        }
    }

    return (
        <Drawer anchor="left" open={open} onClose={() => setOpen(false)}
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
            <RichTreeView
                items={files}
                getItemId={(item) => item.path}
                getItemChildren={(item) => item.child}
                getItemLabel={item => item.label}
            />
            <IconButton onClick={onAddFile}> <AddCircleOutline /> </IconButton>
        </Drawer>
    );
}