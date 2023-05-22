import { WithStyles } from "@material-ui/styles";
import { AccountResponse } from "services/types";
import styles from "./RevenueProportionSale.styles";
export interface RevenueProportionSaleProps extends WithStyles<typeof styles> {
    account?: AccountResponse;
    id?: string;
}
