import { WithStyles } from "@material-ui/core";
import { AccountAnalyticsTopShipper } from "services/OrdersService";
import styles from "./TopItem.style";

export interface TopItemProps extends WithStyles<typeof styles> {
  item?: AccountAnalyticsTopShipper;
  index: number;
  isStore?: boolean;
}
