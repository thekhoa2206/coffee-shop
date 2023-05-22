import { WithStyles } from "@material-ui/core";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./Login.styles";

export interface LoginProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
  }