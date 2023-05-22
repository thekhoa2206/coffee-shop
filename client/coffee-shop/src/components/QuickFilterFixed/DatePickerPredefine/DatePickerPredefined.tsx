import { Box, Button, Collapse, Typography } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import CalendarIcon from "components/SVG/CalendarIcon";
import moment from "moment";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterDateRange from "../FilterDateRange";
import useStyles from "./DatePickerPredefined.styles";

export type TypeRangesPredefined = {
  key: string;
  label: string;
};
export interface DatePickerPredefineProps {
  startDate?: Date | null;
  endDate?: Date | null;
  predefinedDate?: string;
  ranges: TypeRangesPredefined[];
  onChange?: (predefineDate?: string | null, dateRange?: { startDate?: Date | null; endDate?: Date | null }) => void;
  isDisableIconCalenderOption?: boolean;
}

const DATE_FORMAT = "DD/MM/YYYY";

const DatePickerPredefined = (props: DatePickerPredefineProps) => {
  const { t } = useTranslation(["common", "utilities"]);
  const { startDate, endDate, ranges, predefinedDate, onChange, isDisableIconCalenderOption } = props;
  const classes = useStyles();
  const [_predefinedDate, _setPredefinedDate] = React.useState<string | null>(predefinedDate || "");
  const [_startDate, _setStartDate] = useState<Date | null>(startDate || null);
  const [_endDate, _setEndDate] = useState<Date | null>(endDate || null);
  const refButtonCalendar = useRef(null);
  const [open, setOpen] = useState(false);

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, key: string | null) => {
    setOpen(false);
    _setPredefinedDate(key);
    _setStartDate(null);
    _setEndDate(null);
    onChange?.(key, undefined);
  };

  useEffect(() => {
    _setStartDate(startDate || null);
    _setEndDate(endDate || null);
  }, [startDate, endDate]);

  useEffect(() => {
    _setPredefinedDate(predefinedDate || "");
  }, [predefinedDate]);

  useEffect(() => {
    onChange?.(_predefinedDate, { startDate: _startDate, endDate: _endDate });
  }, [_startDate, _endDate]);

  const renderDatePicker = () => {
    return (
      <Box className={classes.wrapperDatePicker} marginTop="4px" width="100%">
        <FilterDateRange
          endDate={_endDate}
          startDate={_startDate}
          minWidthPopperCalendar={342}
          onChange={(__startDate, __endDate) => {
            _setStartDate(__startDate || null);
            _setEndDate(__endDate || null);
          }}
        />
      </Box>
    );
  };

  const getDateString = () => {
    let label = "Tùy chọn";
    if (!open && (_startDate || _endDate)) {
      label = `${
        _startDate
          ? moment(_startDate).format(DATE_FORMAT)
          : `Từ Trước`
      } - ${_endDate ? moment(_endDate).format(DATE_FORMAT) : `${t("Từ")} ${t("hiện tại")}`}`;
    }
    return label;
  };

  return (
    <Box>
      <ToggleButtonGroup
        value={_predefinedDate}
        exclusive
        onChange={handleAlignment}
        classes={{ root: classes.groupPredefined }}
      >
        {React.Children.toArray(
          ranges.map((item) => (
            <ToggleButton value={item.key} classes={{ root: classes.toggleButton }}>
              <Typography color="textPrimary">{item.label}</Typography>
            </ToggleButton>
          ))
        )}
      </ToggleButtonGroup>
      {
        !isDisableIconCalenderOption 
        ?
        (<Button
          ref={refButtonCalendar}
          onClick={() => {
            setOpen(!open);
            _setPredefinedDate("");
            if (_predefinedDate) {
              onChange?.(undefined, { startDate: _startDate, endDate: _endDate });
            }
          }}
          classes={{ root: classes.buttonOpenDatepicker }}
          className={_startDate || _endDate ? "active" : ""}
        >
          <Typography>{`${getDateString()}`}</Typography>
          <CalendarIcon />
        </Button>)
        : 
        (<Button
          ref={refButtonCalendar}
          onClick={() => {
            setOpen(!open);
            _setPredefinedDate("");
            if (_predefinedDate) {
              onChange?.(undefined, { startDate: _startDate, endDate: _endDate });
            }
          }}
          classes={{ root: classes.buttonOpenDatepicker }}
          className={_startDate || _endDate ? "active" : ""}
          style={{display: "block"}}
        >
          <Typography>{`${getDateString()}`}</Typography>
        </Button>)
      }
      <Collapse in={open}>
        <Fragment>
          <Box className={classes.wrapperDatePickerInline}>{renderDatePicker()}</Box>
        </Fragment>
      </Collapse>
    </Box>
  );
};

export default DatePickerPredefined;
