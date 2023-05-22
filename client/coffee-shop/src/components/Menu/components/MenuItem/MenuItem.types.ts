import { MenuState } from "store/Menu/types";
import { AuthState } from "./../../../../store/Authenticate/types";
import { MenuItem } from "./../../MenuData/MenuData.types";

export interface MenuItemProps {
  level: number;
  menuItem: MenuItem;
  menuIdOpen: string | null;
  setMenuIdOpen: (id: string) => void;
  menuState: MenuState;
  hasDividerTop?: boolean;
  hasDividerBottom?: boolean;
  authState: AuthState;
  handleEventRouteMenuItem: (item: MenuItem) => void;
  checkDate?: boolean;
}
