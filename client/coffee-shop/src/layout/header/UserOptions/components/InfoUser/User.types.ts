import { WithStyles } from "@material-ui/styles";
import { AuthState } from "store/Authenticate/types";
import styles from "./User.styles";

export interface UserInfoProp extends WithStyles<typeof styles> {
  authState: AuthState;
}
