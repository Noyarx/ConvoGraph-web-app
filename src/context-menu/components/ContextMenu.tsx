import {
  alpha,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  styled,
  type MenuProps,
} from "@mui/material";
import type { Edge, Node } from "@xyflow/react";
import { useMemo } from "react";
import { useEdgeActionHandlers } from "../handlers/edgeActionHandlers";
import { useNodeActionHandlers } from "../handlers/nodeActionHandlers";
import { usePaneActionHandlers } from "../handlers/paneActionHandlers";
import { useSelectionActionHandlers } from "../handlers/selectionActionHandlers";
import { createEdgeMenuSections } from "../menuItems/edgeMenuSections";
import { createNodeMenuSections } from "../menuItems/nodeMenuSections";
import { createPaneMenuSections } from "../menuItems/paneMenuSections";
import { createSelectionMenuSections } from "../menuItems/selectionMenuSections";
import type { MenuSection } from "../models/MenuAction.model";

interface ContextMenuProps {
  x: number;
  y: number;
  open: boolean;
  onClose: () => void;
  onEditElement: (element: Node | Edge) => void;
  targetType: "node" | "edge" | "pane" | "selection" | null;
  target: any;
}

// style classes for menu items
const itemClass = "!mx-1.5 !my-1 !rounded";
const getVariantClass = (item: any): string =>
  item?.variant === "critical"
    ? "!text-red-600 !text-opacity-85 hover:!bg-red-100"
    : "hover:!bg-slate-200 hover:!bg-opacity-90";
const getKbdVariant = (item: any): string =>
  item?.variant === "critical"
    ? "border-red-200 group-hover:border-red-300"
    : "border-slate-300 group-hover:border-slate-400";

// mui style for context menu
const StyledMenu = styled((props: MenuProps) => (
  <Menu elevation={0} anchorReference="anchorPosition" {...props} />
))(({ theme }: any) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      paddingLeft: 8,
      "& .MuiSvgIcon-root": {
        fontSize: 20,
        // marginRight: theme.spacing(0),
        ...theme.applyStyles("dark", {
          //   color: "inherit",
        }),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

function ContextMenu({
  x,
  y,
  open,
  onClose,
  onEditElement,
  targetType,
  target,
}: ContextMenuProps) {
  const nodeHandlers = useNodeActionHandlers({ onEditElement });
  const edgeHandlers = useEdgeActionHandlers({ onEditElement });
  const paneHandlers = usePaneActionHandlers({ x, y });
  const selectionHandlers = useSelectionActionHandlers();

  const sections: MenuSection[] =
    targetType === "node"
      ? createNodeMenuSections(nodeHandlers)
      : targetType === "edge"
      ? createEdgeMenuSections(edgeHandlers)
      : targetType === "selection"
      ? createSelectionMenuSections(selectionHandlers)
      : createPaneMenuSections(paneHandlers);

  const renderActionButtons = useMemo(() => {
    return sections.map((sec, index) => (
      <div key={sec.id}>
        {sec.items.map((item) => (
          <MenuItem
            className={`group ${itemClass} ${getVariantClass(item)}`}
            key={item.id}
            onClick={() => {
              item.onClick(target);
              onClose();
            }}
          >
            <ListItemIcon className={`${getVariantClass(item)}`}>
              {item.icon}
            </ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
            {item.shortcut && (
              <kbd
                className={`ml-4 px-2 py-0 text-sm rounded-md shadow border border-slate-200 ${getKbdVariant(
                  item
                )} ${getVariantClass(item)} `}
              >
                {item.shortcut}
              </kbd>
            )}
          </MenuItem>
        ))}
        {/* after each section render a Divider */}
        {index < sections.length - 1 && <Divider />}
      </div>
    ));
  }, [sections]);

  return (
    <StyledMenu
      open={open}
      onClose={onClose}
      anchorPosition={{ top: y, left: x }}
      className="!rounded-2xl !shadow-none"
    >
      <MenuList className="!py-0 !outline-none">{renderActionButtons}</MenuList>
    </StyledMenu>
  );
}

export default ContextMenu;
