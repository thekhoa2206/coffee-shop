import { FormControlProps, PopoverProps, TextFieldProps } from "@material-ui/core";
import { WithStyles } from "@material-ui/styles";
import React from "react";
import styles from "./DateRangePickerV2.styles";

export interface Option {
  label: string;
  onActive?: () => void;
  isActive?: boolean;
  openDatePicker?: boolean;
}

export interface DateRangePickerProps extends WithStyles<typeof styles> {
  options?: Option[];
  showOptions?: boolean;
  value: Date | null | undefined;
  onChange: (date: Date | null) => void;
  lastValue: Date | null | undefined;
  onChangeLastValue: (date: Date | null) => void;
  maxDate?: Date | null;
  minDate?: Date | null;
  textFieldProps?: TextFieldProps & FormControlProps & { helperText?: string };
  popoverProps?: PopoverProps;
  renderBottom?: (props: EventRenderBottom) => React.ReactNode;
  submitNonDatePicker?: (props: EventRenderBottom) => React.ReactNode;
  sameDate?: boolean;
  isHideText?: boolean;
  defaultIndexOption?: number;
  activeOption?: number;
  onChangeActiveOption?: (number: number | null) => void;
  confirmSetDateRange?: (_startDate: Date, _endDate: Date) => void;
}

export interface EventRenderBottom {
  close: () => void;
  onSubmit?: () => void;
  value: Date | null | undefined;
  lastValue: Date | null | undefined;
}
