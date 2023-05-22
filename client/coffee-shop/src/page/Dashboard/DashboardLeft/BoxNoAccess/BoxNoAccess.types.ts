import { WithStyles } from "@material-ui/core";
import styles from "./BoxNoAccess.styles";

export interface BoxNoAccessProps extends WithStyles<typeof styles> {
  type: string;
  width?: string;
  height?: string;
  label?: React.ReactNode;
}
