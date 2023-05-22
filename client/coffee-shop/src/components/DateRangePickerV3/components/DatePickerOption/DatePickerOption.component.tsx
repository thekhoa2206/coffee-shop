import { Box, IconButton, InputAdornment, makeStyles, PopperPlacementType, Theme } from "@material-ui/core";
import clsx from "clsx";
import DatePicker from "../DatePicker/DatePicker.component";
import CalendarIcon from "components/SVG/CalendarIcon";
import React, { useEffect, useState } from "react";
import { colorInk } from "theme/palette";
import { isEqual } from "lodash";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    "& .line-space": {
      width: 8,
      height: 1,
      backgroundColor: colorInk.primary,
      margin: "0 12px",
    },
    "&.calendar-left-open, &.calendar-right-open": {
      marginBottom: 284,
    },
    "&.calendar-left-open .text-field-date-left, &.calendar-right-open .text-field-date-right": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .text-field-date-right, & .text-field-date-left": {
      "& input": {
        padding: "0 0 0 16px",
      },
    },
  },
}));

interface DatePickerOptionProps {
  endDate?: Date | null;
  startDate?: Date | null;
  maxDate?: Date | null;
  minDate?: Date | null;
  onChange?: (startDate: Date | null | undefined, DateMax: Date | null | undefined) => void;
  placementCalendarLeft?: PopperPlacementType;
  placementCalenderRight?: PopperPlacementType;
  minWidthPopperCalendar?: string | number;
}

const DatePickerOption = (props: DatePickerOptionProps) => {
  const {
    endDate = null,
    startDate = null,
    minDate,
    maxDate,
    onChange,
    placementCalendarLeft = "bottom-start",
    placementCalenderRight = "bottom-end",
  } = props;
  const classes = useStyles();
  const [_startDate, _setStartDate] = useState(startDate);
  const [_endDate, _setEndDate] = useState(endDate);
  const [calendarLeftOpen, setCalendarLeftOpen] = useState(false);
  const [calendarRightOpen, setCalendarRightOpen] = useState(false);
  useEffect(() => {
    if (!isEqual(startDate, _startDate)) {
      _setStartDate(startDate);
    }
  }, [startDate]);

  useEffect(() => {
    if (!isEqual(endDate, _endDate)) {
      _setEndDate(endDate);
    }
  }, [endDate]);

  useEffect(() => {
    onChange?.(_startDate, _endDate);
  }, [_startDate, _endDate]);

  return (
    <Box
      className={clsx(
        classes.root,
        calendarLeftOpen ? "calendar-left-open" : "",
        calendarRightOpen ? "calendar-right-open" : ""
      )}
    >
      <DatePicker
        onOpen={() => setCalendarLeftOpen(true)}
        onClose={() => setCalendarLeftOpen(false)}
        value={_startDate}
        format="DD/MM/YYYY"
        onChange={_setStartDate}
        borderArrow={true}
        selectMonth
        minDate={minDate}
        maxDate={_endDate || maxDate}
        placement={placementCalendarLeft}
        focusInputOnClose={false}
        disablePortal
        textFieldProps={{
          style: { paddingTop: 0, width: "100%" },
          placeholder: "dd/mm/yyyy",
          classes: { root: "text-field-date-left" },
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton style={{ padding: 6, marginRight: 10 }}>
                  <CalendarIcon style={{ width: 18, height: 20 }} />
                </IconButton>
              </InputAdornment>
            ),
            readOnly: false,
          },
        }}
      />
      <span className="line-space"></span>
      <DatePicker
        onOpen={() => setCalendarRightOpen(true)}
        onClose={() => setCalendarRightOpen(false)}
        value={_endDate}
        format="DD/MM/YYYY"
        onChange={_setEndDate}
        borderArrow={true}
        selectMonth
        maxDate={maxDate}
        minDate={_startDate}
        disablePortal
        focusInputOnClose={false}
        placement={placementCalenderRight}
        textFieldProps={{
          style: { paddingTop: 0, width: "100%" },
          placeholder: "dd/mm/yyyy",
          classes: { root: "text-field-date-right" },
          InputProps: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton style={{ padding: 6, marginRight: 10 }}>
                  <CalendarIcon style={{ width: 18, height: 20 }} />
                </IconButton>
              </InputAdornment>
            ),
            readOnly: false,
          },
        }}
      />
    </Box>
  );
};

export default DatePickerOption;
