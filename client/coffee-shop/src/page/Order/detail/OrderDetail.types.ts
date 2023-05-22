import { WithStyles } from "@material-ui/core";
import { OrdersResponse } from "services/OrdersService";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import { StoreContext } from "store/StoreContext/types";
import styles from "./OrderDetail.styles";

export interface OrderDetailProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
    storeContext: StoreContext;
  }
  export interface DialogOrderCancel{
    open: boolean;
    onClose: () => void;
    authState: AuthState;
    id: string;
    initOrder: (order: OrdersResponse) => void;
  }

  export interface DialogAddPaymentOrdersProps{
    open: boolean;
    onClose: () => void;
    authState: AuthState;
    id: string;
    initOrder: (order: OrdersResponse) => void;
    order?: OrdersResponse;
  }

  export type DialogDeleteOrderProps = {
    open: boolean;
    onClose: () => void;
    id: string;
  }