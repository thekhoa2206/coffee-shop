import { Box, MenuItem } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/styles";
import clsx from "clsx";
import Select from "components/Select/Index";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  maxDate: Date;
  minDate: Date;
  value: Date;
  onChange: (date: Date) => void;
  locale: Locale;
  classes: ClassNameMap<"box" | "boxCenter" | "selectMonth">;
  anchorPositionSelectMonth?: { top: number; left: number };
  anchorPositionSelectYear?: { top: number; left: number };
}

const MonthSelection = React.memo(function Component(props: Props) {
  const {
    onChange,
    minDate,
    maxDate,
    classes,
    value,
    anchorPositionSelectMonth = { top: 40, left: 42 },
    anchorPositionSelectYear = { top: 40, left: 174 },
  } = props;

  const maxYear = maxDate.getFullYear();
  const minYear = minDate.getFullYear();
  const month = value.getMonth();
  const year = value.getFullYear();
  const { t } = useTranslation(["customer", "utilities", "component"]);
  let monthsElement: JSX.Element[] = [];
  let yearsElement: JSX.Element[] = [];
  for (let i = 0; i < 12; i++) {
    if (year === minYear && i < minDate.getMonth()) {
      continue;
    }
    if (year === maxYear && i > maxDate.getMonth()) {
      continue;
    }
    if (i === 0 || i === 1) {
      monthsElement.push(
        <MenuItem key={`month-${i}`} value={i}>
          {i === 0 ? t("component:datePicker.january") : t("component:datePicker.february")}
        </MenuItem>
      );
    } else if (i === 2 || i === 3) {
      monthsElement.push(
        <MenuItem key={`month-${i}`} value={i}>
          {i === 2 ? t("component:datePicker.march") : t("component:datePicker.aprill")}
        </MenuItem>
      );
    } else if (i === 4 || i === 5) {
      monthsElement.push(
        <MenuItem key={`month-${i}`} value={i}>
          {i === 4 ? t("component:datePicker.may") : t("component:datePicker.june")}
        </MenuItem>
      );
    } else if (i === 6 || i === 7) {
      monthsElement.push(
        <MenuItem key={`month-${i}`} value={i}>
          {i === 6 ? t("component:datePicker.july") : t("component:datePicker.august")}
        </MenuItem>
      );
    } else if (i === 8 || i === 9) {
      monthsElement.push(
        <MenuItem key={`month-${i}`} value={i}>
          {i === 8 ? t("component:datePicker.september") : t("component:datePicker.october")}
        </MenuItem>
      );
    } else if (i === 10 || i === 11) {
      monthsElement.push(
        <MenuItem key={`month-${i}`} value={i}>
          {i === 10 ? t("component:datePicker.november") : t("component:datePicker.december")}
        </MenuItem>
      );
    }
  }
  for (let i = minYear; i <= maxYear; i++) {
    yearsElement.push(
      <MenuItem key={`year-${i}`} value={i}>
        {i}
      </MenuItem>
    );
  }

  const maxHeightSelect = 38 * 5;
  return (
    <Box className={clsx(classes.box, classes.boxCenter, "selectMonth")}>
      <Box>
        <Select
          className={classes.selectMonth}
          style={{ width: 116 }}
          value={month}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            let cloneDate = new Date(value);
            cloneDate.setMonth(event.target.value as number);
            onChange(cloneDate);
          }}
          size="small"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: maxHeightSelect,
                marginTop: 4,
              },
            },
            getContentAnchorEl: null,
            anchorPosition: anchorPositionSelectMonth,
            anchorReference: "anchorPosition",
            disablePortal: true,
          }}
        >
          {monthsElement}
        </Select>
      </Box>
      <Box>
        <Select
          className={classes.selectMonth}
          style={{ width: 92 }}
          value={year}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            let cloneDate = new Date(value);
            cloneDate.setFullYear(event.target.value as number);
            onChange(cloneDate);
          }}
          size="small"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: maxHeightSelect,
                marginTop: 4,
                top: "40px !important",
                left: "42px !important",
              },
            },
            getContentAnchorEl: null,
            anchorPosition: anchorPositionSelectYear,
            anchorReference: "anchorPosition",
            disablePortal: true,
          }}
        >
          {yearsElement}
        </Select>
      </Box>
    </Box>
  );
});

export default MonthSelection;
