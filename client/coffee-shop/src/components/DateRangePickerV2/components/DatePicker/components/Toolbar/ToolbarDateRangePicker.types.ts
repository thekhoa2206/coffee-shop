import { WithStyles } from "@material-ui/core";
import styles from "./ToolbarDateRangePicker.styles";

export interface ToolbarProps extends WithStyles<typeof styles> {
  onClickFieldLeft?: () => void;
  onClickFieldRight?: () => void;
  maxDate: Date;
  minDate: Date;
  anchorEl?: Element | null | undefined;
}
