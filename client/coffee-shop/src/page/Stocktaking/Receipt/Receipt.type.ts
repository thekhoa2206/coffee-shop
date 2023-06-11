import { WithStyles } from "@material-ui/core";
import { BaseFilter } from "services/types";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./Receipt.styles";

export interface ReceiptProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
    history: any;
}

