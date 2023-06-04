import { WithStyles } from "@material-ui/core";
import { BaseFilter } from "services/types";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./Items.styles";

export interface ItemsProps extends WithStyles<typeof styles> {
  menuState: MenuState;
  authState: AuthState;
  history: any;
}

export interface ItemFilterRequest extends BaseFilter {
  status?: string;
  created_on_predefined?: string;
}

export interface IItemQuickFilter extends BaseFilter {
  status?: string;
  created_on_predefined?: string;
  occurAtMax?: string;
  occurAtMin?: string;
}
