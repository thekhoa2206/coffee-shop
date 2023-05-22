import { IconButton, withStyles, WithStyles } from "@material-ui/core";
import clsx from "clsx";
import moment from "moment";
import React from "react";
import styles from "./Day.styles";
interface Props extends WithStyles<typeof styles> {
  dayInCurrentMonth?: boolean;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  isBetween?: boolean;
  isToday?: boolean;
  dateRange?: boolean;
  isOutRange?: boolean;
  onChange: (date: Date) => void;
  value: Date;
  firstDate?: Date | null;
  lastDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  hiddenDayOutMonth?: boolean;
}

const Day = (props: Props) => {
  const {
    classes,
    dayInCurrentMonth,
    onChange,
    value,
    firstDate,
    lastDate,
    minDate,
    maxDate,
    hiddenDayOutMonth,
  } = props;

  let isFirstDay = false;
  let isLastDay = false;
  let isBetween = false;
  let isToday = false;
  let isOutRange = false;
  if (minDate && moment(value).isBefore(minDate, "day")) {
    isOutRange = true;
  }
  if (maxDate && moment(value).isAfter(maxDate, "day")) {
    isOutRange = true;
  }
  if (firstDate && moment(firstDate).isSame(value, "day")) {
    isFirstDay = true;
  }
  if (lastDate && moment(lastDate).isSame(value, "day")) {
    isLastDay = true;
  }
  if (lastDate && firstDate && moment(value).isBetween(firstDate, lastDate, "day")) {
    isBetween = true;
  }
  if (moment(value).isSame(new Date(), "day")) {
    isToday = true;
  }
  let dateRange = props.dateRange;
  if (firstDate && lastDate && moment(firstDate).isSame(lastDate, "day")) {
    dateRange = false;
  }

  const btnClassName = clsx(classes.btnDay, {
    [classes.btnInActive]: isOutRange,
    [classes.btnNonCurrentMonthDay]: !dayInCurrentMonth,
    [classes.btnHighlightNonCurrentMonthDay]: !dayInCurrentMonth && (isFirstDay || isLastDay),
    [classes.btnHighlight]: isBetween,
    [classes.btnFirstHighlight]: isFirstDay,
    [classes.btnEndHighlight]: isLastDay,
    [classes.btnBorder]: isToday,
  });
  const dayClassName = clsx(classes.root, {
    [classes.dayBetween]: isBetween,
    [classes.dayFirst]: dateRange && isFirstDay,
    [classes.dayLast]: dateRange && isLastDay,
    [classes.hidden]: hiddenDayOutMonth && !dayInCurrentMonth,
  });

  return (
    <div className={dayClassName} onClick={() => onChange(value)}>
      <IconButton className={btnClassName}>
        <span>{value}</span>
      </IconButton>
    </div>
  );
};

export default withStyles(styles)(Day);
