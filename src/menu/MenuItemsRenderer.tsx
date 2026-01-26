import {
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import { getMenuActionItemColors } from "./context-menu/components/ContextMenuStyle";
import type { MenuItem } from "./models/MenuItem.model";
import { SubmenuItem } from "./SubMenuItem";

export interface MenuItemsRendererProps {
  items: MenuItem[];

  openPath: string[];
  setOpenPath: (path: string[]) => void;
  parentPath?: string[];

  isActive?: boolean;

  onClose: () => void;
}

export function MenuItemsRenderer({
  items,
  openPath,
  setOpenPath,
  parentPath,
  isActive,
  onClose,
}: MenuItemsRendererProps) {
  const currentPath = parentPath ?? [];
  return (
    <>
      {items.map((item, index) => {
        switch (item.type) {
          case "separator":
            return (
              <Divider
                key={`sep-${index}`}
                className="place-self-center w-44"
              />
            );

          case "action":
            return (
              <MuiMenuItem
                key={item.id}
                onMouseEnter={() => {
                  setOpenPath(currentPath);
                }}
                onClick={() => {
                  if (!isActive) return;
                  item.command();
                  onClose();
                }}
                className={`${getMenuActionItemColors(item)}`}
              >
                {item.icon && (
                  <ListItemIcon className={`!text-inherit`}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText>{item.label}</ListItemText>
                {item.shortcut && (
                  <kbd style={{ marginLeft: 16, opacity: 0.6 }}>
                    {item.shortcut}
                  </kbd>
                )}
              </MuiMenuItem>
            );

          case "submenu":
            return (
              <SubmenuItem
                key={item.id}
                item={item}
                openPath={openPath}
                setOpenPath={setOpenPath}
                parentPath={currentPath}
                isActive={isActive}
                onClose={onClose}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
