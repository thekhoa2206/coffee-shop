import { WithStyles } from "@material-ui/core";
import { BaseFilter } from "services/types";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./Orders.styles";

export interface OrdersProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
    history: any;
}

export interface OrderFilterRequest extends BaseFilter {
  status?: string;
  created_on_predefined?: string;
}

export interface IOrderQuickFilter extends BaseFilter {
    status?: string;
    created_on_predefined?: string;
    occurAtMax?: string;
    occurAtMin?: string;
  }
  