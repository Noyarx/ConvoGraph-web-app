import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, type ReactNode } from "react";

interface EditModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

function EditModal({ open, title, onClose, children }: EditModalProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const originalOverflow = document.body.style.overflow;

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow || "";
    }

    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [open]);

  return (
    <Dialog
      disableScrollLock
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      //   PaperComponent={motion.div as any}
      PaperProps={{
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { type: "spring", stiffness: 300, damping: 25 },
        style: { borderRadius: 16, overflow: "hidden" },
      }}
    >
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default EditModal;
