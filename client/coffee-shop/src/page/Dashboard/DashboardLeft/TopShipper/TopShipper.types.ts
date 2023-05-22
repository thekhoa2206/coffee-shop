import { WithStyles } from "@material-ui/core";
import { AuthState } from "store/Authenticate/types";
import styles from "./TopShipper.styles";

export interface TopShipperProps extends WithStyles<typeof styles> {
    authContext: AuthState;
  }