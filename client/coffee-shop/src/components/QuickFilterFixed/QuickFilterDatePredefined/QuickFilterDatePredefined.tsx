
import React, { Fragment, useEffect, useRef, useState } from "react";
import Popper from "components/Popper/PopperBase";
import Button from "components/Button";
import { makeStyles } from "@material-ui/styles";
import { Box, Theme } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { DatePickerPredefineProps } from "../DatePickerPredefine/DatePickerPredefined";
import DatePickerPredefined from "../DatePickerPredefine";
import QuickFilterButton from "components/QuickFilter/QuickFilterButton";
const useStyles = makeStyles((theme: Theme) => ({
  wrapperPopper: {
    padding: "12px 4px 16px",
  },
}));

interface QuickFilterDatePredefinedProps extends DatePickerPredefineProps {
  label: string;
  onSubmit: (predefineDate?: string | null, dateRange?: { startDate?: Date | null; endDate?: Date | null }) => void;
}

const QuickFilterDatePredefined = (props: QuickFilterDatePredefinedProps) => {
  const { label, predefinedDate, startDate, endDate, onSubmit, ...remainProps } = props;
  const refPopper = useRef(null);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [_predefinedDate, _setPredefinedDate] = useState(predefinedDate);
  const [_endDate, _setEndDate] = useState(endDate);
  const [_startDate, _setStartDate] = useState(startDate);
  const { t } = useTranslation(["customer", "component"]);
  useEffect(() => {
    if (open) {
      _setStartDate(startDate);
      _setEndDate(endDate);
      _setPredefinedDate(predefinedDate);
    }
  }, [open]);

  const handleSubmit = () => {
    onSubmit(_predefinedDate, { startDate: _startDate, endDate: _endDate });
    setOpen(false);
  };

  return (
    <Fragment>
      <QuickFilterButton
        ref={refPopper}
        active={open}
        onClick={() => {
          setOpen(!open);
        }}
      >
        {label}
      </QuickFilterButton>
      <Popper
        width={350}
        referenceElement={refPopper.current}
        open={open}
        onClose={() => setOpen(false)}
        ignoreEventCloseInRootRef={true}
      >
        <Box className={classes.wrapperPopper}>
          <DatePickerPredefined
            startDate={_startDate}
            endDate={_endDate}
            predefinedDate={_predefinedDate}
            onChange={(predefinedDate, dateRanges) => {
              let __startDate: any = null;
              let __endDate: any = null;
              let __predefinedDate = "";
              if (predefinedDate) {
                __predefinedDate = predefinedDate;
              } else if (dateRanges) {
                __startDate = dateRanges.startDate;
                __endDate = dateRanges.endDate;
              }
              _setStartDate(__startDate);
              _setEndDate(__endDate);
              _setPredefinedDate(__predefinedDate);
            }}
            {...remainProps}
          />
          <Button
            color="primary"
            variant="contained"
            style={{ width: "100%", marginTop: 16 }}
            size="small"
            onClick={handleSubmit}
          >
            Lọc
          </Button>
        </Box>
      </Popper>
    </Fragment>
  );
};

export default QuickFilterDatePredefined;
