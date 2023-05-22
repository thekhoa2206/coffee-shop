import { WithStyles } from "@material-ui/core";
import { AuthState } from "store/Authenticate/types";
import styles from "./BussinessResult.styles";

export interface BussinessResultProps extends WithStyles<typeof styles> {
  authContext: AuthState;
}
