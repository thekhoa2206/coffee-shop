import { WithStyles } from "@material-ui/core";
import { BaseFilter } from "services/types";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./Combos.styles";

export interface CombosProps extends WithStyles<typeof styles> {
  menuState: MenuState;
  authState: AuthState;
  history: any;
}

export interface ComboFilterRequest extends BaseFilter {
  status?: string;
  created_on_predefined?: string;
}
export interface ComboQuickFilter extends BaseFilter {
  status?: string;
  created_on_predefined?: string;
  occurAtMax?: string;
  occurAtMin?: string;
}
