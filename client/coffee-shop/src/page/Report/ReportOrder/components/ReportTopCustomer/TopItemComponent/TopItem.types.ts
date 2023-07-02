import { WithStyles } from "@material-ui/core";
import styles from "./TopItem.style";
import { ReportCustomerResponse, ReportProductResponse } from "services/ReportOrderService";

export interface TopItemProps extends WithStyles<typeof styles> {
  item?: ReportCustomerResponse;
  index: number;
  isStore?: boolean;
}
