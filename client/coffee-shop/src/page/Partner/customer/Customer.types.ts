import { WithStyles } from "@material-ui/core";
import { CustomerResponse } from "services/OrdersService";
import { BaseFilter } from "services/types";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import { StoreContext } from "store/StoreContext/types";
import styles from "./Customer.styles";

export interface CustomerProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
    history: any;
    storeContext?: StoreContext;
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
  storeContext?: StoreContext;
}

export type DialogUpdateCustomerProps = {
  id?: string;
  open: boolean;
  onClose: () => void;
  customer?: CustomerResponse;
  initData: () => void;
  storeContext?: StoreContext;
}