import DateFnsUtils from "@date-io/date-fns";
import { Box, RootRef, withStyles } from "@material-ui/core";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { DatePicker as MuiDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import clsx from "clsx";
import Popper from "components/Popper/PopperBase";
import CalendarIcon from "components/SVG/CalendarIcon";
import moment from "moment";
import React, { Fragment, memo, useEffect, useState } from "react";
import { formatDate, formatDateHour } from "./../../utilities/Helpers";
import TextField from "./../TextField";
import Day from "./components/Day";
import Toolbar from "./components/Toolbar";
import styles from "./DatePicker.styles";
import { DatePickerProps, DateTimeType, TimeType } from "./DatePicker.types";
import i18next from "i18next";

const t = i18next.getFixedT(null, "component");

export class LocalizedUtils extends DateFnsUtils {
  getWeekdays(): string[] {
    return [
      `T2`,
      `T3`,
      `T4`,
      `T5`,
      `T6`,
      `T7`,
      `CN`,
    ];
  }
}


const DatePicker = withStyles(styles)(
  memo(
    React.forwardRef((props: DatePickerProps, ref) => {
      const {
        label,
        classes,
        onChange,
        required,
        lastValue,
        dateRange,
        timePicker,
        selectMonth,
        minWidthPopper,
        onMonthChange,
        onChangeRange,
        textFieldProps,
        leftArrowIcon,
        rightArrowIcon,
        inputDateRange,
        disableChangeText,
        hiddenDayOutMonth,
        onChangeLastValue,
        appendDefaultOnClick,
        anchorPositionSelectMonth,
        anchorPositionSelectYear,
        placement = "bottom-end",
        onOpen,
        onClose,
        focusInputOnClose = true,
        style,
        className,
        disablePortal,
        onChangeTime,
        timeFrom,
        timeTo,
        periodPicker,
        times,
        autoComplete,
        isDisabled,
        error,
        helperText,
      } = props;
      let format = props.format || "DD/MM/YYYY";
      if (!props.format && timePicker) {
        format = "DD/MM/YYYY HH:mm";
      }
      if (!props.format && periodPicker) {
        format = "DD/MM/YYYY";
      }
      let value: Date | null = null;
      if (props.value && moment(props.value).isValid()) {
        value = moment(props.value).toDate();
      }
      let defaultValue: Date | null = null;
      if (props.defaultValue && moment(props.defaultValue).isValid()) {
        defaultValue = moment(props.defaultValue).toDate();
      }
      const [text, setText] = useState<string>();
      const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
      const [open, setOpen] = useState(false);
      const [hours, setHours] = useState<number>(value?.getHours() || 0);
      const [minutes, setMinutes] = useState<number>(value?.getMinutes() || 0);
      const [dateFocus, setDateFocus] = useState<Date>(value ? moment(value).toDate() : defaultValue || new Date());
      const maxDate = props.maxDate || new Date("2100-12-31");
      const minDate = props.minDate || new Date("1900-01-01");
      const configLocalString = localStorage.getItem("i18nextLng");
      const labelFunc = (): string => {
        let label = "";
        if (!value) {
          setText(label);
          return label;
        }
        if (periodPicker) {
          label = formatDateHour(value, "", format, timeFrom, timeTo);
        } else {
          label = formatDate(value, "", format);
        }

        if (!dateRange || !lastValue) {
          setText(label);
          return label;
        }
        label += ` - ${formatDate(lastValue, "", format)}`;
        setText(label);
        return label;
      };

      useEffect(() => {
        if (open) onOpen?.();
        else onClose?.();
      }, [open]);

      const handleTimeChange = (hours: number, minutes: number) => {
        setHours(hours);
        setMinutes(minutes);
        if (!value) {
          return;
        }
        const cloneValue = new Date(value);
        cloneValue.setHours(hours, minutes);
        onChange(cloneValue);
      };

      const handlePeriodChange = (time: TimeType) => {
        if (!value) {
          value = new Date();
        }
        let values: DateTimeType = { date: new Date(value), timeFrom: time.timeFrom, timeTo: time.timeTo };
        if (onChangeTime) {
          onChangeTime(values);
        }
      };
      const handleChangeDate = (newDate: Date | null) => {
        if (!newDate) {
          return;
        }
        if (timePicker) {
          newDate.setHours(hours, minutes);
        }
        if (minDate && moment(newDate).isBefore(minDate, "day")) {
          return;
        }
        if (maxDate && moment(newDate).isAfter(maxDate, "day")) {
          return;
        }

        if (!value || !dateRange) {
          if (selectMonth && onMonthChange) {
            onMonthChange(newDate);
          }
          onChangeRange && onChangeRange(newDate, lastValue);
          onChange(newDate);
          if (!dateRange) {
            if (!timePicker && !periodPicker) {
              setOpen(false);
            }
          } else {
            setDateFocus(newDate);
          }
          return;
        }

        if (!onChangeLastValue) {
          return;
        }
        if (!lastValue && moment(newDate).isAfter(value)) {
          onChangeRange && onChangeRange(value, newDate);
          onChangeLastValue(newDate);
          setDateFocus(newDate);
          setOpen(false);
          return;
        }
        if (moment(value).isSame(newDate)) {
          onChangeRange && onChangeRange(null, null);
          onChange(null);
          onChangeLastValue(null);
          return;
        }
        if (selectMonth && onMonthChange) {
          onMonthChange(newDate);
        }
        onChangeRange && onChangeRange(newDate, null);
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

      const inputRef = React.useRef<any>(null);
      const handleClick = (event: any) => {
        renderText(localText);
        setOpen(true);
        if (!value) {
          const newVal = defaultValue || new Date();
          appendDefaultOnClick && onChange(newVal);
        }
      };

      const handleClose = () => {
        setOpen(false);
        if (focusInputOnClose) {
          inputRef.current.focus();
          inputRef.current.select();
        }
        setTimeout(() => {
          setDateFocus(value || defaultValue || new Date());
        }, 500);
      };

      //Use in case: input date range
      const handleChangeFieldLeft = (value: string) => {
        //TODO
      };
      const handleChangeFieldRight = (value: string) => {
        //TODO
      };

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
      const validateDate = (date: Date): boolean => {
        if (minDate && moment(date).isBefore(minDate, "day")) {
          return false;
        }
        if (maxDate && moment(date).isAfter(maxDate, "day")) {
          return false;
        }
        return true;
      };
      const [localText, setLocalText] = useState<string>("");
      useEffect(() => {
        setLocalText(text || "");
      }, [text]);

      const renderText = (str: string | Date) => {
        if (dateRange) {
          if (typeof str === "string") {
            if (!str || str.trim() === "") {
              onChange(null);
              onChangeLastValue && onChangeLastValue(null);
              setDateFocus(defaultValue || new Date());
              setLocalText("");
              return;
            }
            let newText = "";
            let arr = str.split("-").map((e) => e.trim());
            let dateFirst: Date | null = null;
            let dateLast: Date | null = null;
            if (arr[0] && moment(arr[0], format).isValid()) {
              dateFirst = moment(arr[0], format).toDate();
              if (dateFirst && validateDate(dateFirst)) {
                onChange(dateFirst);
                setDateFocus(dateFirst);
                newText = formatDate(dateFirst, "", format);
              }
            }
            if (arr[1] && moment(arr[1], format).isValid()) {
              dateLast = moment(arr[1], format).toDate();
              if (dateLast && dateFirst && moment(dateLast).isBefore(dateFirst, "day")) {
                setLocalText(text || "");
                return;
              }
              if (dateLast && validateDate(dateLast)) {
                onChangeLastValue && onChangeLastValue(dateLast);
                newText += ` - ${formatDate(dateLast, "", format)}`;
              }
            }
            setLocalText(newText);
          }
        } else {
          if (typeof str === "string") {
            if (!str || str.trim() === "") {
              onChange(null);
              setDateFocus(defaultValue || new Date());
              setLocalText("");
              return;
            }
          }
          if (moment(str, format).isValid()) {
            const date = moment(str, format).toDate();
            if (validateDate(date)) {
              onChange(date);
              setDateFocus(date);
            } else {
              setLocalText(text || "");
            }
          } else {
            setLocalText(text || "");
          }
        }
      };

      useEffect(() => {
        const newText = labelFunc();
        if (text && text.localeCompare(newText) === 0) {
          return;
        }
        setLocalText(newText);
      }, [value, lastValue]);

      return (
        <Fragment>
          <RootRef rootRef={setAnchorEl}>
            <Box style={style} className={className}>
              <Popper
                open={open}
                width={minWidthPopper || 308}
                referenceElement={anchorEl}
                onClose={handleClose}
                placement={placement}
                disablePortal={disablePortal}
                ignoreEventCloseInRootRef
              >
                <Box
                  className={clsx([classes.popper], {
                    selectMonth: selectMonth,
                    selectTime: timePicker,
                    periodPicker: periodPicker,
                  })}
                >
                  <MuiPickersUtilsProvider
                    utils={LocalizedUtils}
                  >
                    <MuiDatePicker
                      allowKeyboardControl={false}
                      variant={"static"}
                      renderDay={renderDay}
                      value={dateFocus}
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
                      ToolbarComponent={
                        (toolbarProps) => {
                          return (
                            <Toolbar
                              {...toolbarProps}
                              date={dateFocus}
                              hours={hours}
                              minutes={minutes}
                              minDate={minDate}
                              maxDate={maxDate}
                              onTimeChange={timePicker && handleTimeChange}
                              selectMonth={selectMonth}
                              inputDateRange={dateRange && inputDateRange}
                              valueLeft={value && formatDate(value, "", props.format)}
                              valueRight={lastValue && formatDate(lastValue, "", props.format)}
                              onChangeFieldLeft={handleChangeFieldLeft}
                              onChangeFieldRight={handleChangeFieldRight}
                              anchorPositionSelectMonth={anchorPositionSelectMonth}
                              anchorPositionSelectYear={anchorPositionSelectYear}
                              onChangeTime={handlePeriodChange}
                              timeFrom={timeFrom}
                              timeTo={timeTo}
                              periodPicker={periodPicker}
                              times={times}
                            />
                          );
                        }
                        // {...remainProps}
                      }
                    />
                  </MuiPickersUtilsProvider>
                </Box>
              </Popper>
              <TextField
                error={error}
                helperText={helperText}
                required={required}
                inputRef={inputRef}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <CalendarIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  readOnly: disableChangeText,
                }}
                autoComplete={autoComplete}
                focused={open}
                label={label}
                onBlur={(e: any) => {
                  renderText(localText);
                }}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    renderText(localText);
                  }
                }}
                onClick={(e: any) => {
                  if (!isDisabled) handleClick(e);
                }}
                inputProps={{
                  readOnly: disableChangeText,
                  style: {
                    cursor: disableChangeText && isDisabled ? "not-allowed" : disableChangeText ? "pointer" : undefined,
                  },
                }}
                value={localText || ""}
                onChange={(e: any) => {
                  if (disableChangeText) {
                    return;
                  }
                  setLocalText(e.target.value);
                }}
                {...textFieldProps}
              />
            </Box>
          </RootRef>
        </Fragment>
      );
    })
  )
);

DatePicker.displayName = "DatePicker";
export default DatePicker;
