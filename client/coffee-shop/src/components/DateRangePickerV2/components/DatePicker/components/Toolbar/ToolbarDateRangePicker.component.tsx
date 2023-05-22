import React from "react";
import { Box, withStyles } from "@material-ui/core";
import styles from "./ToolbarDateRangePicker.styles";
import { ToolbarComponentProps } from "@material-ui/pickers/Picker/Picker";
import { ToolbarProps } from "./ToolbarDateRangePicker.types";
import MonthSelection from "./components/MonthSelection";

const ToolbarDateRangePicker = (props: ToolbarProps & ToolbarComponentProps) => {
  const {
    classes,
    onMonthChange,
    date,
    maxDate,
    minDate,
  } = props;

  return (
    <Box>
      {onMonthChange && date && (
        <MonthSelection
          maxDate={maxDate}
          minDate={minDate}
          value={date}
          onChange={onMonthChange}
          classes={classes}
        />
      )}
    </Box>
  );
};

export default withStyles(styles)(ToolbarDateRangePicker);
