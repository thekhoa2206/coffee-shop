import React from "react";
import { Box, withStyles } from "@material-ui/core";
import styles from "./Toolbar.styles";
import { ToolbarComponentProps } from "@material-ui/pickers/Picker/Picker";
import TextField from "components/TextField";
import LineIcon from "components/SVG/LineIcon";
import { ToolbarProps } from "./Toolbar.types";
import MonthSelection from "./components/MonthSelection";
import TimeSelection from "./components/TimeSelection";
import TimeSelectionV2 from "./components/TimeSelectionV2/TimeSelectionV2";

const Toolbar = (props: ToolbarProps & ToolbarComponentProps) => {
  const {
    classes,
    valueLeft,
    valueRight,
    onChangeFieldLeft,
    onChangeFieldRight,
    onTimeChange,
    selectMonth,
    onMonthChange,
    inputDateRange,
    date,
    maxDate,
    minDate,
    hours,
    minutes,
    anchorPositionSelectMonth,
    anchorPositionSelectYear,
    onChangeTime,
    timeFrom,
    timeTo,
    periodPicker,
    times,
  } = props;

  return (
    <Box>
      {periodPicker && date && (
        <TimeSelectionV2
          onChange={onChangeTime}
          classes={classes}
          timeFrom={timeFrom}
          timeTo={timeTo}
          date={date}
          times={times}
        />
      )}
      {inputDateRange && (
        <Box className={classes.box}>
          <Box className={classes.textBox}>
            <TextField
              className={classes.textField}
              value={valueLeft || ""}
              onChange={(event: any) => {
                if (onChangeFieldLeft) {
                  onChangeFieldLeft(event.target.value as string);
                }
              }}
            />
          </Box>
          <Box className={classes.lineBox}>
            <LineIcon className={classes.lineIcon} />
          </Box>
          <Box className={classes.textBox}>
            <TextField
              className={classes.textField}
              value={valueRight || ""}
              onChange={(event: any) => {
                if (onChangeFieldRight) {
                  onChangeFieldRight(event.target.value as string);
                }
              }}
            />
          </Box>
        </Box>
      )}
      {selectMonth && onMonthChange && date && (
        <MonthSelection
          maxDate={maxDate}
          minDate={minDate}
          value={date}
          onChange={onMonthChange}
          classes={classes}
          anchorPositionSelectMonth={anchorPositionSelectMonth}
          anchorPositionSelectYear={anchorPositionSelectYear}
        />
      )}
      {onTimeChange && date && (
        <TimeSelection onChange={onTimeChange} classes={classes} hours={hours} minutes={minutes} />
      )}
    </Box>
  );
};

export default withStyles(styles)(Toolbar);
