import DateFnsUtils from "@date-io/date-fns";
import { Box, PopoverOrigin, PopperPlacementType, WithStyles, withStyles } from "@material-ui/core";
import { IconButtonProps } from "@material-ui/core/IconButton";
import { DatePicker as MuiDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import clsx from "clsx";
import Popper from "components/Popper/PopperBase";
import i18next from "i18next";
import _ from "lodash";
import moment, { Locale } from "moment";
import React, { memo, useEffect, useState } from "react";
import { formatDate } from "utilities/Helpers";
import Day from "./components/Day";
import Toolbar from "./components/Toolbar";
import styles from "./DatePicker.styles";
const t = i18next.getFixedT(null, "component");
export class LocalizedUtils extends DateFnsUtils {
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

interface DatePickerBaseBaseProps extends WithStyles<typeof styles> {
  dateRange?: boolean;
  timePicker?: boolean;
  value: string | Date | null | undefined;
  defaultValue?: string | Date | null | undefined;
  format?: string;
  onChange: (date: Date | null) => void;
  lastValue?: Date | null;
  onChangeLastValue?: (date: Date | null) => void;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  disableToolbar?: boolean;
  selectMonth?: boolean;
  onMonthChange?: (date: Date) => void;
  inputDateRange?: boolean;
  locale?: Locale;
  maxDate?: Date | null;
  minDate?: Date | null;
  leftArrowIcon?: boolean;
  rightArrowIcon?: boolean;
  hiddenDayOutMonth?: boolean;
  onChangeRange?: (firstDate: Date | null | undefined, lastDate: Date | null | undefined) => void;
  minWidthPopper?: number | string;
  anchorPositionSelectMonth?: { top: number; left: number };
  anchorPositionSelectYear?: { top: number; left: number };
  placement?: PopperPlacementType;
  style?: React.CSSProperties;
  className?: string;
  disablePortal?: boolean;
  open: boolean;
  onClose: () => void;
  referenceElement: any;
}

const DatePickerBase = memo((props: DatePickerBaseBaseProps) => {
  const {
    open,
    classes,
    onChange,
    lastValue,
    dateRange,
    timePicker,
    selectMonth,
    minWidthPopper,
    onMonthChange,
    onChangeRange,
    leftArrowIcon,
    rightArrowIcon,
    inputDateRange,
    hiddenDayOutMonth,
    onChangeLastValue,
    anchorPositionSelectMonth,
    anchorPositionSelectYear,
    placement = "bottom-end",
    onClose,
    style,
    className,
    disablePortal,
    referenceElement,
  } = props;

  const maxDate = props.maxDate || new Date("2100-12-31");
  const minDate = props.minDate || new Date("1900-01-01");
  let format = props.format || "DD/MM/YYYY";
  if (!props.format && timePicker) {
    format = "DD/MM/YYYY HH:mm";
  }
  let value: Date | null = null;
  if (props.value && moment(props.value, format, true).isValid()) {
    value = moment(props.value, format).toDate();
  }
  let defaultValue: Date | null = null;
  if (props.defaultValue && moment(props.defaultValue, format, true).isValid()) {
    defaultValue = moment(props.defaultValue, format).toDate();
  }

  const [hours, setHours] = useState<number>(value?.getHours() || 0);
  const [minutes, setMinutes] = useState<number>(value?.getMinutes() || 0);
  const [dateFocus, setDateFocus] = useState<Date>(value ? moment(value).toDate() : defaultValue || new Date());
  const configLocalString = localStorage.getItem("i18nextLng");

  useEffect(() => {
    if (_.isNil(props.value)) {
      setDateFocus(defaultValue || new Date());
      return;
    }
    if (moment(props.value, format, true).isValid() && !_.isEqual(props.value, dateFocus)) {
      setDateFocus(moment(props.value).toDate());
    }
  }, [props.value]);

  const labelFunc = (): string => {
    let label = "";
    if (!value) {
      return label;
    }
    label = formatDate(value, "", format);
    if (!dateRange || !lastValue) {
      return label;
    }
    label += ` - ${formatDate(lastValue, "", format)}`;
    return label;
  };

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
        if (!timePicker) {
          handleClose();
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
      handleClose();
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

  const handleClose = () => {
    onClose();
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

  return (
    <Box style={style} className={className}>
      <Popper
        open={open}
        width={minWidthPopper || 334}
        referenceElement={referenceElement}
        onClose={handleClose}
        placement={placement}
        disablePortal={disablePortal}
      >
        <Box className={clsx([classes.popper], { selectMonth: selectMonth, selectTime: timePicker })}>
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
              ToolbarComponent={(toolbarProps) => {
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
                  anchorPositionSelectYear={anchorPositionSelectYear}                  />
                );
              }}
            />
          </MuiPickersUtilsProvider>
        </Box>
      </Popper>
    </Box>
  );
});

export default withStyles(styles)(DatePickerBase);
