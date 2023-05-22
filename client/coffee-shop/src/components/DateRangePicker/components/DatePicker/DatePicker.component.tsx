import DateFnsUtils from "@date-io/date-fns";
import { withStyles } from "@material-ui/core";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { DatePicker as MuiDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import clsx from "clsx";
import CalendarIcon from "components/SVG/CalendarIcon";
import TextField from "components/TextField";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import { formatDate } from "utilities";
import { v4 as uuidv4 } from "uuid";
import Day from "./components/Day";
import styles from "./DatePicker.styles";
import { DatePickerProps } from "./DatePicker.types";
import i18next from "i18next";
const t = i18next.getFixedT(null, "component");
class LocalizedUtils extends DateFnsUtils {
  getWeekdays(): string[] {
    return [
      `${t("datePicker.t2")}`,
      `${t("datePicker.t3")}`,
      `${t("datePicker.t4")}`,
      `${t("datePicker.t5")}`,
      `${t("datePicker.t6")}`,
      `${t("datePicker.t7")}`,
      `${t("datePicker.cn")}`,
    ];
  }
}

const DatePicker = memo((props: DatePickerProps) => {
  const {
    classes,
    dateRange,
    value,
    onChange,
    lastValue,
    onChangeLastValue,
    leftArrowIcon,
    rightArrowIcon,
    defaultValue,
    textFieldProps,
    label,
    inputDateRange,
    selectMonth,
    disableToolbar,
    timePicker,
    onMonthChange,
    hiddenDayOutMonth,
    sameDate,
    ...remainProps
  } = props;
  const [text, setText] = useState<string>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [dateFocus, setDateFocus] = useState<Date | null>();
  const maxDate = props.maxDate || new Date("2100-12-31");
  const minDate = props.minDate || new Date("1900-01-01");
  const configLocalString = localStorage.getItem("i18nextLng");

  useEffect(() => {
    if (remainProps?.variant === "static") {
      setDateFocus(value || new Date());
    }
  }, []);

  const labelFunc = (date?: Date | null) => {
    let format = props.format;
    if (format && timePicker) {
      format = "DD/MM/YYYY HH:mm";
    } else {
      format = "DD/MM/YYYY";
    }

    let label = "";
    if (!value) {
      setText(label);
      return label;
    }
    label = formatDate(value, "", format);
    if (!dateRange || !lastValue) {
      setText(label);
      return label;
    }
    label += ` - ${formatDate(lastValue, "", format)}`;
    setText(label);
    return label;
  };

  const handleChangeDate = (newDate: Date | null) => {
    if (!newDate) {
      return;
    }
    if (minDate && moment(newDate).isBefore(minDate, "day")) {
      return;
    }
    if (maxDate && moment(newDate).isAfter(maxDate, "day")) {
      return;
    }

    if (!value || !dateRange) {
      if (onMonthChange) {
        onMonthChange(newDate);
      }
      onChange(newDate);
      setDateFocus(newDate);
      return;
    }

    if (!onChangeLastValue) {
      return;
    }
    if (sameDate) {
      if (!lastValue && moment(newDate).isAfter(value)) {
        onChangeLastValue(newDate);
        return;
      }
      if (!lastValue && moment(value).isSame(newDate)) {
        onChangeLastValue(newDate);
        return;
      }
    } else {
      if (!lastValue && moment(newDate).isAfter(value)) {
        onChangeLastValue(newDate);
        setDateFocus(newDate);
        return;
      }
      if (moment(value).isSame(newDate)) {
        onChange(null);
        onChangeLastValue(null);
        return;
      }
    }
    if (onMonthChange) {
      onMonthChange(newDate);
    }
    onChange(newDate);
    onChangeLastValue(null);
    setDateFocus(newDate);
  };
  const handleMonthChange = (newMonth: Date | null) => {
    if (!newMonth) {
      return;
    }
    if (minDate && moment(newMonth).isBefore(minDate, "day")) {
      newMonth = minDate;
    }
    if (maxDate && moment(newMonth).isAfter(maxDate, "day")) {
      newMonth = maxDate;
    }
    setDateFocus(newMonth);
  };

  const renderDay = (
    day: Date | null,
    selectedDate: Date | null,
    dayInCurrentMonth: boolean,
    dayComponent: JSX.Element
  ) => {
    if (!day) return dayComponent;
    return (
      <Day
        value={day}
        dayInCurrentMonth={dayInCurrentMonth}
        firstDate={value}
        lastDate={lastValue}
        minDate={minDate}
        maxDate={maxDate}
        onChange={handleChangeDate}
        dateRange={dateRange}
        hiddenDayOutMonth={hiddenDayOutMonth}
      />
    );
  };

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!anchorEl) {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
    setTimeout(() => {
      setDateFocus(value || new Date());
    }, 500);
  };

  //Use in case: input date range
  const handleChangeFieldLeft = (value: string) => {
    //TODO
  };
  const handleChangeFieldRight = (value: string) => {
    //TODO
  };

  const [id] = useState(uuidv4());
  const leftArrowProps: IconButtonProps = {
    classes: {
      root: clsx(classes.icon, { [classes.hidden]: leftArrowIcon === false }),
    },
  };
  const rightArrowProps: IconButtonProps = {
    classes: {
      root: clsx(classes.icon, { [classes.hidden]: rightArrowIcon === false }),
    },
  };

  return (
    <div onClick={handleClick} aria-describedby={id}>
      <MuiPickersUtilsProvider utils={LocalizedUtils} >
        <MuiDatePicker
          allowKeyboardControl={false}
          variant={"inline"}
          renderDay={renderDay}
          value={(onMonthChange && defaultValue) || dateFocus}
          minDate={minDate}
          maxDate={maxDate}
          onChange={() => {}}
          labelFunc={labelFunc}
          leftArrowButtonProps={leftArrowProps}
          rightArrowButtonProps={rightArrowProps}
          onMonthChange={(date: Date | null) => {
            if (!date) return;
            if (selectMonth) {
              handleMonthChange(date);
            }
            if (onMonthChange) {
              onMonthChange(date);
            }
          }}
          TextFieldComponent={() => {
            return (
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <CalendarIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                label={label}
                value={text}
                {...textFieldProps}
              />
            );
          }}
          PopoverProps={{
            id: id,
            open: open,
            anchorEl: anchorEl,
            onClose: handleClose,
            classes: { root: classes.root, paper: classes.paper },
            className: clsx({ selectMonth: selectMonth, selectTime: timePicker }),
            anchorOrigin: {
              vertical: props.anchorOrigin?.vertical || "bottom",
              horizontal: props.anchorOrigin?.horizontal || "right",
            },
            transformOrigin: {
              vertical: props.transformOrigin?.vertical || "top",
              horizontal: props.transformOrigin?.horizontal || "right",
            },
          }}
          ToolbarComponent={() => null}
          {...remainProps}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
});

DatePicker.displayName = "DatePicker";
export default withStyles(styles)(DatePicker);
