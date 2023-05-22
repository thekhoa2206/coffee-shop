import { WithStyles } from "@material-ui/styles";
import { AccountResponse } from "services/types";
import styles from "./RevenueCODShipper.styles";
export interface RevenueCODShipperProps extends WithStyles<typeof styles> {
    account?: AccountResponse;
}
