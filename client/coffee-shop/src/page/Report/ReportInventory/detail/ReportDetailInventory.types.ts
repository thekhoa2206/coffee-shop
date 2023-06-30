import { WithStyles } from "@material-ui/core";
import { BaseFilter } from "services/types";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "../ReportInventory.styles";
import { IOInventoryFilter } from "services/InventoryService/types";

export interface ReportDetailInventoryProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
    history: any;
    filter:IOInventoryFilter;
}