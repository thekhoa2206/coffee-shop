
import React, { Fragment, useRef, useState } from "react";
import ButtonFilterDatePredefined from "./ButtonFilterDatePredefined";
import Popper from "components/Popper/PopperBase";
import { makeStyles } from "@material-ui/styles";
import { Box, Theme } from "@material-ui/core";
import { getNameStartEndDate } from "../../../../../utilities";
import { isNil } from "lodash";
import DatePickerPredefined from "components/QuickFilterFixed/DatePickerPredefine";
import { DatePickerPredefineProps } from "components/QuickFilterFixed/DatePickerPredefine/DatePickerPredefined";

const FilterDatePredefined = React.forwardRef((props: QuickFilterDatePredefinedProps) => {
  const {
    onSubmit,
    placeholder,
    label,
    startDate,
    endDate,
    predefinedDate,
    isDisableIconCalenderOption,
    fillColorEndIcon,
    ...remainProps
  } = props;
  const refPopper = useRef(null);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <Fragment>
      <ButtonFilterDatePredefined
        ref={refPopper}
        active={open}
        focus={!isNil(startDate) || !isNil(endDate) || !isNil(predefinedDate)}
        onClick={() => setOpen(!open)}
        label={label}
        placeholder={getNameStartEndDate(startDate, endDate, predefinedDate, placeholder)}
        fillColorEndIcon={fillColorEndIcon}
      />
      <Popper
        width={294}
        referenceElement={refPopper.current}
        open={open}
        onClose={() => setOpen(false)}
        ignoreEventCloseInRootRef={true}
      >
        <Box className={classes.wrapperPopper}>
          <DatePickerPredefined
            isDisableIconCalenderOption={isDisableIconCalenderOption}
            startDate={startDate}
            endDate={endDate}
            predefinedDate={predefinedDate}
            onChange={(predefinedDate, dateRanges) => {
              let newStartDate: any = null;
              let newEndDate: any = null;
              let newPredefinedDate = "";
              if (predefinedDate) {
                newPredefinedDate = predefinedDate;
              } else if (dateRanges) {
                newStartDate = dateRanges.startDate;
                newEndDate = dateRanges.endDate;
              }
              onSubmit(newPredefinedDate, { startDate: newStartDate, endDate: newEndDate });
            }}
            {...remainProps}
          />
        </Box>
      </Popper>
    </Fragment>
  );
});

export default FilterDatePredefined;

const useStyles = makeStyles((theme: Theme) => ({
  wrapperPopper: {
    padding: "4px 8px 8px",
    "& .MuiToggleButtonGroup-root": {
      "&>.MuiToggleButton-root": {
        width: "calc(50% - 4px)",
        margin: "4px 0",
      },
    },
    "& .MuiInputAdornment-root": {
      marginLeft: 4,
      "& .MuiButtonBase-root": {
        marginRight: "4px !important",
      },
    },
    "& .line-space": {
      margin: "0 9px",
    },
    "& .text-field-date-right, & .text-field-date-left": {
      "& input": {
        padding: "0 0 0 8px",
      },
    },
  },
}));

interface QuickFilterDatePredefinedProps extends DatePickerPredefineProps {
  label?: string;
  placeholder?: string;
  isDisableIconCalenderOption?: boolean;
  onSubmit: (predefineDate?: string | null, dateRange?: { startDate?: Date | null; endDate?: Date | null }) => void;
  fillColorEndIcon?: string;
}
