import { WithStyles } from "@material-ui/core";
import styles from "./OrderWaitHandleItem.styles";

export interface OrderWaitHandleItemProps extends WithStyles<typeof styles> {
  icon: JSX.Element;
  count: number;
  decription: string;
  href?: string;
}
