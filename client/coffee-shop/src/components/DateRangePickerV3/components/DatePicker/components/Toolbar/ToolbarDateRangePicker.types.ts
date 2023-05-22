import { WithStyles } from "@material-ui/core";
import { Locale } from "moment";
import styles from "./ToolbarDateRangePicker.styles";

export interface ToolbarProps extends WithStyles<typeof styles> {
  onClickFieldLeft?: () => void;
  onClickFieldRight?: () => void;
  locale: Locale;
  maxDate: Date;
  minDate: Date;
  anchorEl?: Element | null | undefined;
}
