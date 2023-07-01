import { WithStyles } from "@material-ui/core";
import styles from "./TopItem.style";
import { ReportProductResponse } from "services/ReportOrderService";

export interface TopItemProps extends WithStyles<typeof styles> {
  item?: ReportProductResponse;
  index: number;
  isStore?: boolean;
}
