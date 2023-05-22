import { Box, MenuItem, MenuList, Popover, withStyles } from "@material-ui/core";
import DatePicker from "./components/DatePicker";
import TextField from "components/TextField";
import moment from "moment";
import React, { Fragment, memo, useEffect, useRef, useState } from "react";
import { DateRangeType, GetNameDateRangeType } from "utilities/DateRangeType";
import { v4 as uuidv4 } from "uuid";
import { formatDate } from "./../../utilities/Helpers";
import styles from "./DateRangePicker.styles";
import { DateRangePickerProps, Option } from "./DateRangePicker.types";
import { useTranslation } from "react-i18next";

const DateRangePicker = memo((props: DateRangePickerProps) => {
  const { t } = useTranslation(["common"]);
  const {
    classes,
    minDate,
    maxDate,
    textFieldProps,
    popoverProps,
    value,
    lastValue,
    onChange,
    onChangeLastValue,
    showOptions,
    renderBottom,
    submitNonDatePicker,
    sameDate,
    isHideText,
    defaultIndexOption,
  } = props;
  const [dateFocus, setDateFocus] = useState<Date | null>(moment(new Date()).subtract(1, "M").toDate());
  const dateFocusRight = dateFocus && moment(dateFocus).add(1, "M").toDate();
  const [text, setText] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [id] = useState(uuidv4());

  const selectToday = () => {
    const today = new Date();
    onChange(today);
    onChangeLastValue(today);
  };
  const selectYesterday = () => {
    let firstDate = moment().clone().subtract(1, "d").toDate();
    let lastDate = moment().clone().subtract(1, "d").toDate();
    onChange(firstDate);
    onChangeLastValue(lastDate);
  };
  const selectLast7day = () => {
    let firstDate = moment().clone().subtract(6, "d").toDate();
    let lastDate = new Date();
    onChange(firstDate);
    onChangeLastValue(lastDate);
  };
  const selectLastMonth = () => {
    let firstDate = moment().clone().subtract(1, "M").startOf("M").toDate();
    let lastDate = moment().clone().subtract(1, "M").endOf("M").toDate();
    onChange(firstDate);
    onChangeLastValue(lastDate);
  };
  const selectCurrentMonth = () => {
    let firstDate = moment().clone().startOf("M").toDate();
    let lastDate = new Date();
    onChange(firstDate);
    onChangeLastValue(lastDate);
  };
  const selectLast30day = () => {
    let firstDate = moment().clone().subtract(29, "d").toDate();
    let lastDate = new Date();
    onChange(firstDate);
    onChangeLastValue(lastDate);
  };
  const selectThisYear = () => {
    let first = new Date(new Date().getFullYear(), 0, 1);
    let last = new Date();
    onChange(first);
    onChangeLastValue(last);
  };
  const selectLastYear = () => {
    let first = new Date(new Date().getFullYear() - 1, 0, 1);
    let last = new Date(new Date().getFullYear() - 1, 11, 31);
    onChange(first);
    onChangeLastValue(last);
  };

  const defaultOption: Option[] = [
    { label: GetNameDateRangeType(DateRangeType.TODAY), onActive: selectToday },
    { label: GetNameDateRangeType(DateRangeType.YESTERDAY), onActive: selectYesterday },
    { label: GetNameDateRangeType(DateRangeType.DAY_LAST_7), onActive: selectLast7day },
    { label: GetNameDateRangeType(DateRangeType.DAY_LAST_30), onActive: selectLast30day },
    { label: GetNameDateRangeType(DateRangeType.LAST_MONTH), onActive: selectLastMonth },
    { label: GetNameDateRangeType(DateRangeType.THIS_MONTH), onActive: selectCurrentMonth },
    { label: GetNameDateRangeType(DateRangeType.THIS_YEAR), onActive: selectThisYear },
    { label: GetNameDateRangeType(DateRangeType.LAST_YEAR), onActive: selectLastYear },
    { label: `${t("common:custom")}`, openDatePicker: true },
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
    if (defaultIndexOption) {
      setSelectIdx(defaultIndexOption);
      setOpenDatePicker(options[defaultIndexOption].openDatePicker || false);
    }
  }, [defaultIndexOption]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const refOptionSelected = useRef<number>();

  const handleSubmit = () => {
    const option = options[selectIdx];
    refOptionSelected.current = selectIdx;
    if (option && option.onActive) {
      option.onActive();
    }
  };
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (open) {
      if (refOptionSelected.current === undefined) {
        refOptionSelected.current = selectIdx;
      } else {
        setSelectIdx(refOptionSelected.current);
        setOpenDatePicker(!!options[refOptionSelected.current].openDatePicker);
      }
    }
  }, [open]);

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setSelectIdx(index);
    const option = options[index];
    if (option.onActive && !submitNonDatePicker) {
      option.onActive();
    }
    if (option.openDatePicker) {
      setOpenDatePicker(true);
      return;
    }
    setOpenDatePicker(false);
    setText(option.label);
  };

  useEffect(() => {
    if (selectIdx !== undefined && showOptions) {
      const option = options[selectIdx];
      if (!option.openDatePicker) {
        return;
      }
    }
    let format = "DD/MM/YYYY";
    let label = "";
    if (!value) {
      setText(label);
      return;
    }
    label = formatDate(value, "", format);
    if (!lastValue) {
      setText(label);
      return;
    }
    label += ` - ${formatDate(lastValue, "", format)}`;

    setText(label);
  }, [value, lastValue]);

  return (
    <Fragment>
      <TextField onClick={handleClick} aria-describedby={id} value={isHideText ? "" : text} {...textFieldProps} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        classes={{ paper: classes.popoverPaper }}
        {...popoverProps}
      >
        <Box className={classes.box}>
          {showOptions && (
            <MenuList className={classes.menuList}>
              {options.map((option, index) => (
                <MenuItem
                  key={`dateRange-${index}`}
                  selected={index === selectIdx}
                  onClick={(event) => {
                    handleMenuItemClick(event, index);
                    if (!option.openDatePicker && !submitNonDatePicker) handleClose();
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
              {!openDatePicker &&
                submitNonDatePicker &&
                submitNonDatePicker({ close: handleClose, onSubmit: handleSubmit })}
            </MenuList>
          )}
          <Box style={{ display: "flex", flexDirection: "column" }}>
            {(openDatePicker || !showOptions) && (
              <Box className={classes.dateWrapper}>
                <Box className={classes.dateLeft}>
                  <DatePicker
                    value={value}
                    onChange={onChange}
                    lastValue={lastValue}
                    onChangeLastValue={onChangeLastValue}
                    variant="static"
                    minDate={minDate}
                    maxDate={maxDate}
                    dateRange
                    hiddenDayOutMonth
                    rightArrowIcon={false}
                    defaultValue={dateFocus && moment(dateFocus).format("YYYY-MM")}
                    onMonthChange={setDateFocus}
                    sameDate={sameDate}
                  />
                </Box>
                <Box className={classes.dateRight}>
                  <DatePicker
                    value={value}
                    onChange={onChange}
                    lastValue={lastValue}
                    onChangeLastValue={onChangeLastValue}
                    variant="static"
                    minDate={minDate}
                    maxDate={maxDate}
                    dateRange
                    hiddenDayOutMonth
                    leftArrowIcon={false}
                    defaultValue={dateFocusRight && moment(dateFocusRight).format("YYYY-MM")}
                    onMonthChange={(date: Date) => setDateFocus(moment(date).subtract(1, "M").toDate())}
                    sameDate={sameDate}
                  />
                </Box>
              </Box>
            )}
            {openDatePicker && renderBottom && renderBottom({ close: handleClose, onSubmit: handleSubmit })}
          </Box>
        </Box>
      </Popover>
    </Fragment>
  );
});

DateRangePicker.displayName = "DateRangePicker";
export default withStyles(styles)(DateRangePicker);
