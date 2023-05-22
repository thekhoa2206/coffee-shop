import { PopoverOrigin, WithStyles } from "@material-ui/core";
import styles from "./DatePicker.styles";
import { TextFieldProps } from "@material-ui/core/TextField";
import { FormControlProps } from "@material-ui/core";

export interface DatePickerProps extends WithStyles<typeof styles> {
  dateRange?: boolean;
  timePicker?: boolean;
  label?: string;
  value: Date | null | undefined;
  defaultValue?: string | Date | null;
  format?: string;
  onChange: (date: Date | null) => void;
  lastValue?: Date | null;
  onChangeLastValue?: (date: Date | null) => void;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  textFieldProps?: TextFieldProps & FormControlProps & { helperText?: string };
  disableToolbar?: boolean;
  selectMonth?: boolean;
  onMonthChange?: (date: Date) => void;
  inputDateRange?: boolean;
  maxDate?: Date | null;
  minDate?: Date | null;
  variant?: "dialog" | "inline" | "static";
  leftArrowIcon?: boolean;
  rightArrowIcon?: boolean;
  hiddenDayOutMonth?: boolean;
  sameDate?: boolean;
}
