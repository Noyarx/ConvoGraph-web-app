import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import type { MenuRequest } from "./menu.model";
import GenericMenu from "../GenericMenu";

interface MenuContextValue {
  openMenu: (req: MenuRequest) => void;
  closeMenu: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: PropsWithChildren) {
  const [menuRequest, setMenuRequest] = useState<MenuRequest | null>(null);

  const openMenu = (req: MenuRequest) => {
    setMenuRequest(req);
  };

  const closeMenu = () => {
    setMenuRequest(null);
  };

  return (
    <MenuContext.Provider value={{ openMenu, closeMenu }}>
      {children}

      {menuRequest && (
        <GenericMenu
          open
          anchorEl={menuRequest.anchorEl ?? null}
          anchorPosition={menuRequest.anchorPosition}
          items={menuRequest.items}
          onClose={closeMenu}
        />
      )}
    </MenuContext.Provider>
  );
}

export function useMenu(): MenuContextValue {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }

  return context;
}
