import { WithStyles } from "@material-ui/core";
import { AuthState } from "store/Authenticate/types";
import styles from "./TopShipperStore.styles";

export interface TopShipperStoreProps extends WithStyles<typeof styles> {
    authContext: AuthState;
  }