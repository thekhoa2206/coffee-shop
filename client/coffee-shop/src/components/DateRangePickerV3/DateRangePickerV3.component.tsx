import { Box, Button, Collapse, Popover, Typography, withStyles } from "@material-ui/core";
import TextField from "components/TextField";
import moment from "moment";
import React, { Fragment, memo, useEffect, useRef, useState } from "react";
import { DateRangeType, GetNameDateRangeType } from "utilities/DateRangeType";
import { v4 as uuidv4 } from "uuid";
import styles from "./DateRangePickerV3.styles";
import { DateRangePickerProps, Option } from "./DateRangePickerV3.types";
import { useTranslation } from "react-i18next";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import DatePickerOption from "./components/DatePickerOption";

const DateRangePickerV3 = memo((props: DateRangePickerProps) => {
  const { t } = useTranslation(["common"]);
  const {
    classes,
    textFieldProps,
    popoverProps,
    value,
    lastValue,
    showOptions,
    renderBottom,
    submitNonDatePicker,
    isHideText,
    defaultIndexOption,
    confirmSetDateRange,
  } = props;
  const [maxDate, setMaxDate] = useState<Date | null>(lastValue || new Date("2100-12-31"));
  const [minDate, setMinDate] = useState<Date | null>(value || new Date("1900-01-01"));
  const [text, setText] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [id] = useState(uuidv4());

  const selectToday = () => {
    const today = new Date();
    confirmSetDateRange?.(today, today);
  };
  const selectYesterday = () => {
    let firstDate = moment().clone().subtract(1, "d").toDate();
    let lastDate = moment().clone().subtract(1, "d").toDate();
    confirmSetDateRange?.(firstDate, lastDate);
  };
  const selectLast7day = () => {
    let firstDate = moment().clone().subtract(6, "d").toDate();
    let lastDate = new Date();
    confirmSetDateRange?.(firstDate, lastDate);
  };
  const selectLastMonth = () => {
    let firstDate = moment().clone().subtract(1, "M").startOf("M").toDate();
    let lastDate = moment().clone().subtract(1, "M").endOf("M").toDate();
    confirmSetDateRange?.(firstDate, lastDate);
  };
  const selectCurrentMonth = () => {
    let firstDate = moment().clone().startOf("M").toDate();
    let lastDate = new Date();
    confirmSetDateRange?.(firstDate, lastDate);
  };
  const selectLast30day = () => {
    let firstDate = moment().clone().subtract(29, "d").toDate();
    let lastDate = new Date();
    confirmSetDateRange?.(firstDate, lastDate);
  };
  const selectThisYear = () => {
    let first = new Date(new Date().getFullYear(), 0, 1);
    let last = new Date();
    confirmSetDateRange?.(first, last);
  };
  const selectLastYear = () => {
    let first = new Date(new Date().getFullYear() - 1, 0, 1);
    let last = new Date(new Date().getFullYear() - 1, 11, 31);
    confirmSetDateRange?.(first, last);
  };

  const setDateRange = () => {
    if (confirmSetDateRange && (minDate || maxDate)) {
      confirmSetDateRange?.(minDate || maxDate || new Date(), maxDate || minDate || new Date());
    }
  };

  const defaultOption: Option[] = [
    { key: DateRangeType.TODAY, label: GetNameDateRangeType(DateRangeType.TODAY), onActive: selectToday },
    { key: DateRangeType.YESTERDAY, label: GetNameDateRangeType(DateRangeType.YESTERDAY), onActive: selectYesterday },
    { key: DateRangeType.DAY_LAST_7, label: GetNameDateRangeType(DateRangeType.DAY_LAST_7), onActive: selectLast7day },
    { key: DateRangeType.DAY_LAST_30, label: GetNameDateRangeType(DateRangeType.DAY_LAST_30), onActive: selectLast30day },
    { key: DateRangeType.LAST_MONTH, label: GetNameDateRangeType(DateRangeType.LAST_MONTH), onActive: selectLastMonth },
    { key: DateRangeType.THIS_MONTH, label: GetNameDateRangeType(DateRangeType.THIS_MONTH), onActive: selectCurrentMonth },
    { key: DateRangeType.THIS_YEAR, label: GetNameDateRangeType(DateRangeType.THIS_YEAR), onActive: selectThisYear },
    { key: DateRangeType.LAST_YEAR, label: GetNameDateRangeType(DateRangeType.LAST_YEAR), onActive: selectLastYear },
    { key: "", label: `${t("common:custom")}`, openDatePicker: true, onActive: setDateRange },
  ];
  let options: Option[];
  if (props.options && props.options.length) {
    options = props.options;
  } else {
    options = defaultOption;
  }

  const getSelectIdx = () => {
    for (let i = 0; i < options.length; i++) {
      const element = options[i];
      if (!element.isActive) {
        continue;
      }
      return i;
    }
    return 0;
  };
  const [selectIdx, setSelectIdx] = useState<number>(getSelectIdx());

  useEffect(() => {
    if (defaultIndexOption !== undefined) {
      setSelectIdx(defaultIndexOption);
      refOptionSelected.current = defaultIndexOption;
    }
  }, [defaultIndexOption]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const refOptionSelected = useRef<number>(defaultIndexOption || 8);

  const handleSubmit = () => {
    const option = options[selectIdx];
    refOptionSelected.current = selectIdx;
    if (option && option.onActive && !submitNonDatePicker) {
      option.onActive();
    }
    handleClose();
  };
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (open) {
      if (refOptionSelected.current === undefined) {
        refOptionSelected.current = selectIdx;
      } else {
        setSelectIdx(refOptionSelected.current);
        setOpenDatePicker(!!options[refOptionSelected.current].openDatePicker);
        setText(options[refOptionSelected.current].key);
      }
    }
  }, [open]);

  const handleItemClick = (event: React.MouseEvent<HTMLElement>, label: string | null) => {
    let index = -1;
    for (let i = 0; i < options.length; i++) {
      if (options[i].key === label) {
        index = i;
        break;
      }
    }
    if (index === -1) return;
    const option = options[index];
    if (index !== -1) {
      setSelectIdx(index);
    }
    setText(option.key);
    if (option.openDatePicker) {
      setOpenDatePicker(true);
      return;
    }
    setOpenDatePicker(false);
  };


  return (
    <Fragment>
      <TextField onClick={handleClick} aria-describedby={id} value={isHideText ? "" : text} focused={open} {...textFieldProps}/>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{ paper: classes.popoverPaper }}
        {...popoverProps}
      >
        <Box>
          {showOptions && (
            <ToggleButtonGroup
              value={text}
              exclusive
              onChange={handleItemClick}
              classes={{ root: classes.groupPredefined }}
            >
              {React.Children.toArray(
                options.map((option, index) => (
                  <ToggleButton
                    value={option.key}
                    classes={
                      option.label !== `${t("common:custom")}`
                        ? { root: classes.toggleButton }
                        : { root: classes.buttonOpenDatepicker }
                    }
                  >
                    <Typography color="textPrimary">{option.label}</Typography>
                  </ToggleButton>
                ))
              )}
            </ToggleButtonGroup>
          )}
          <Collapse in={openDatePicker}>
            <DatePickerOption
              endDate={lastValue}
              startDate={value}
              onChange={(_minDate, _maxDate) => {
                setMinDate(_minDate || null);
                setMaxDate(_maxDate || null);
              }}
            />
          </Collapse>
          <Button
            color="primary"
            variant="contained"
            style={{ width: "100%", marginTop: 16, borderRadius: 4 }}
            size="small"
            onClick={handleSubmit}
          >
            {t("component:filter.filterBtnText")}
          </Button>
          {openDatePicker && renderBottom && renderBottom({ close: handleClose, onSubmit: handleSubmit, value: value, lastValue: lastValue})}
        </Box>
      </Popover>
    </Fragment>
  );
});

DateRangePickerV3.displayName = "DateRangePickerV3";
export default withStyles(styles)(DateRangePickerV3);