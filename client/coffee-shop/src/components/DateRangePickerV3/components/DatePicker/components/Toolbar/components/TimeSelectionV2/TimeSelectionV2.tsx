import { Box, MenuItem } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/styles";
import Select from "components/Select/Index";
import React from "react";
import clsx from "clsx";
import { TimeType } from "components/DatePicker/DatePicker.types";

interface Props {
  onChange?: (dateTime: TimeType) => void;
  classes: ClassNameMap<
    "wrapperSelectTimes" | "box" | "selectPeriod" | "boxCenter" | "wrapperPopperContent" | "periodPicker"
  >;
  timeFrom?: string | null;
  timeTo?: string | null;
  disabled?: boolean;
  timePicker?: boolean;
  date?: Date | null;
  times?: any[];
}

const TimeSelectionV2 = React.memo(function Component(props: Props) {
  const { classes, timeFrom, onChange, timeTo, times } = props;

  const onDateTimeChange = (
    timeForm: string | null | undefined,
    timeTo: string | null | undefined,
    source: "timeFrom" | "timeTo"
  ) => {
    if (onChange && times) {
      let values: TimeType = { timeFrom: timeForm, timeTo: timeTo };
      if (!timeForm) {
        values.timeFrom = times[0];
      }
      if (!timeTo) {
        values.timeTo = times[times.length - 1];
      }
      if (times.findIndex((item) => item === values.timeFrom) > times.findIndex((item) => item === values.timeTo)) {
        if (source === "timeFrom") {
          values.timeTo = timeForm;
        } else if (source === "timeTo") {
          values.timeFrom = timeTo;
        }
      }
      onChange(values);
    }
  };
  return (
    <Box className={clsx(classes.box, classes.boxCenter, classes.periodPicker)}>
      <Select
        value={timeFrom || "00:00"}
        placeholder=""
        className={classes.selectPeriod}
        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
          onDateTimeChange(event.target.value as string, timeTo, "timeFrom");
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200,
              marginTop: 4,
            },
          },
          getContentAnchorEl: null,
          anchorPosition: { top: 55, left: 11 },
          anchorReference: "anchorPosition",
          disablePortal: true,
        }}
      >
        {times &&
          times.map((item, index) => (
            <MenuItem
              key={index}
              value={item}
              style={timeTo !== times[times.length - 1] && item === times[times.length - 1] ? { display: "none" } : {}}
            >
              {item}
            </MenuItem>
          ))}
      </Select>
      <span style={{ color: "#A3A8AF" }}>-</span>
      <Select
        value={timeTo || "23:59"}
        placeholder=""
        className={classes.selectPeriod}
        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
          onDateTimeChange(timeFrom, event.target.value as string, "timeTo");
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200,
              marginTop: 4,
            },
          },
          getContentAnchorEl: null,
          anchorPosition: { top: 55, left: 135 },
          anchorReference: "anchorPosition",
          disablePortal: true,
        }}
      >
        {times &&
          times.map((item, index) => (
            <MenuItem
              key={index}
              value={item}
              style={timeTo !== "23:59" && item === "23:59" ? { display: "none" } : {}}
            >
              {item}
            </MenuItem>
          ))}
      </Select>
    </Box>
  );
});

export default TimeSelectionV2;
