import { WithStyles } from "@material-ui/styles";
import { AuthState } from "store/Authenticate/types";
import styles from "./UserOptions.styles";

export interface UserOptionsProp extends WithStyles<typeof styles> {
  authState: AuthState;
}
