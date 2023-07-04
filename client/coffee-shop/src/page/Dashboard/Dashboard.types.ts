import { WithStyles } from "@material-ui/core";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./Dashboard.styles";

export interface ReportOrderProps extends WithStyles<typeof styles> {
  menuState: MenuState;
  authState: AuthState;
  history: any;
}
