import { WithStyles } from "@material-ui/core";
import styles from "./BoxNoData.styles";

export interface BoxNoDataProps extends WithStyles<typeof styles> {
  width?: string;
  height?: string;
}
