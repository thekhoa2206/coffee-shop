import { ApplicationState } from "./../../store/App/types";
import { WithStyles } from "@material-ui/styles";
import { AuthState } from "store/Authenticate/types";
import styles from "./Header.styles";

export interface HeaderProps extends WithStyles<typeof styles> {
  authState: AuthState;
  application: ApplicationState;
}
