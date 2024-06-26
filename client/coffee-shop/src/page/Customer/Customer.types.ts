import { WithStyles } from "@material-ui/core";
import { BaseFilter } from "services/types";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./Customer.styles";

export interface CustomerProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
    history: any;
}

export interface CustomerFilterRequest extends BaseFilter {
  status?: string;
  created_on_predefined?: string;
}

export interface ICustomerQuickFilter extends BaseFilter {
    status?: string;
    created_on_predefined?: string;
    occurAtMax?: string;
    occurAtMin?: string;
  }
  
export type DialogDeleteCustomerProps = {
  id?: string;
  open: boolean;
  onClose: () => void;
  initData: () => void;
}

export type DialogUpdateCustomerProps = {
  id?: string;
  open: boolean;
  onClose: () => void;
  initData: () => void;
}