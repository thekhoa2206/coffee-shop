import { WithStyles } from "@material-ui/styles";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./Profiles.styles";

export interface ProfilesProps extends WithStyles<typeof styles> {
  authState: AuthState;
  menuState: MenuState;
}
