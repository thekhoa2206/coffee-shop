import { WithStyles } from "@material-ui/core";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import { StoreContext } from "store/StoreContext/types";
import styles from "./EditOrder.styles";

export interface EditOrderProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
    storeContext: StoreContext;
  }