import { WithStyles } from "@material-ui/core";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./ChannelPos.styles";

export interface ChannelPosProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
    history: any;
}