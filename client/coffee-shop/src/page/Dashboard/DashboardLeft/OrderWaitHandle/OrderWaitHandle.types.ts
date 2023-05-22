import { WithStyles } from "@material-ui/core";
import { AuthState } from "store/Authenticate/types";
import { StoreContext } from "store/StoreContext/types";
import { ThemeState } from "store/Theme/types";
import styles from "./OrderWaitHandle.styles";

export interface OrderWaitHandleProps extends WithStyles<typeof styles> {
  theme: ThemeState;
  authContext: AuthState;
  storeContext: StoreContext;
}
