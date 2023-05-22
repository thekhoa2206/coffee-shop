import { WithStyles } from "@material-ui/core";
import { TimeType } from "components/DatePicker/DatePicker.types";
import styles from "./Toolbar.styles";

export interface ToolbarProps extends WithStyles<typeof styles> {
  valueLeft?: string | null;
  valueRight?: string | null;
  onClickFieldLeft?: () => void;
  onClickFieldRight?: () => void;
  inputDateRange?: boolean;
  selectMonth?: boolean;
  onTimeChange?: ((hours: number, mins: number) => void) | false;
  onChangeFieldLeft?: (value: string) => void;
  onChangeFieldRight?: (value: string) => void;
  maxDate: Date;
  minDate: Date;
  hours: number;
  minutes: number;
  anchorEl?: Element | null | undefined;
  anchorPositionSelectMonth?: { top: number; left: number };
  anchorPositionSelectYear?: { top: number; left: number };
  onChangeTime?: (dateTime: TimeType) => void;
  timeFrom?: string | null;
  timeTo?: string | null;
  periodPicker?: boolean;
  times?: any[];
}
