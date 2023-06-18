import { Box, makeStyles, Theme, Typography } from "@material-ui/core";
import clsx from "clsx";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { colorInk } from "theme/palette";
import { debounce } from "lodash";
import NumberInputTextField from "../../../NumberInput/NumberInputTextField";
import SapoTextField from "../../../SapoTextField";
import { QuickFilterButtonProps } from "../../QuickFilter/QuickFilterButton";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "4px",
    "& .line-space": {
      width: 14,
      height: 2,
      backgroundColor: '#A3A8AF',
      margin: "0 12px",
    },
    "&.calendar-left-open .text-field-date-left, &.calendar-right-open .text-field-date-right": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .text-field-date-right, & .text-field-date-left": {
      "& input": {
        padding: "0 0 0 16px",
      },
    },
  },
  textFieldDate: {},
  rootPopover: {
    padding: "12px 24px 0 12px",
  },
}));

interface FilterAmountRangeProps {
  maxValue?: number;
  minValue?: number;
  btnProps?: QuickFilterButtonProps;
  label: string;
  placement?: string;
  onChange: (minValue?: number | null, maxValue?: number | null) => void;
  error?: boolean;
}

const FilterAmountRange = (props: FilterAmountRangeProps) => {
  const { minValue, maxValue, btnProps, label, error, onChange } = props;
  const { t } = useTranslation(["component"]);
  const classes = useStyles();
  const [_minValue, setMinValue] = useState<number | undefined | null>(minValue);
  const [_maxValue, setMaxValue] = useState<number | undefined | null>(maxValue);
  const debounceUpdateData = useCallback(
    debounce((nextValue: { value?: number; type: "min" | "max" }) => {
      if (nextValue.type === "min") {
        setMinValue(nextValue.value);
      } else {
        setMaxValue(nextValue.value);
      }
    }, 300),
    []
  );
  useEffect(() => {
    setMaxValue(maxValue);
  }, [maxValue]);
  useEffect(() => {
    setMinValue(minValue);
  }, [minValue]);
  useEffect(() => {
    onChange(_minValue, _maxValue);
  }, [_minValue, _maxValue]);
  return (
    <>
      <Box className={classes.rootPopover}>
        <Fragment>
          <Box>
            <Typography>{label}</Typography>
          </Box>
          <Box className={clsx(classes.root)}>
            <NumberInputTextField
              selectOnFocus
              name={`input-price-range-min`}
              decimalSeparator={true}
              decimalScale={0}
              value={_minValue !== undefined && _minValue !== null ? _minValue : null}
              textFieldProps={{
                variant: "outlined",
              }}
              placeholder="Nhập giá trị"
              allowNegative
              inputComponent={SapoTextField}
              onChange={(event: { target: { name: string; value: string } }) => {
                debounceUpdateData({
                  value: event.target.value ? parseFloat(event.target.value) : undefined,
                  type: "min",
                });
              }}
              style={{ paddingTop: "0" }}
              max={9_999_999_999}
              error={error}
            />
            <span className="line-space" />
            <NumberInputTextField
              selectOnFocus
              name={`input-price-range-max`}
              decimalSeparator={true}
              decimalScale={0}
              value={_maxValue !== undefined && _maxValue !== null ? _maxValue : null}
              textFieldProps={{
                variant: "outlined",
              }}
              placeholder="Nhập giá trị"
              inputComponent={SapoTextField}
              allowNegative
              onChange={(event: { target: { name: string; value: string } }) => {
                debounceUpdateData({
                  value: event.target.value ? parseFloat(event.target.value) : undefined,
                  type: "max",
                });
              }}
              style={{ paddingTop: "0" }}
              max={9_999_999_999}
              error={error}
            />
          </Box>
          {error && (
            <Typography
              style={{
                color: "#FF4D4D",
                fontSize: "12px",
                paddingTop: 4,
              }}
            >
              Giá trị từ không được lớn hơn giá trị đến
            </Typography>
          )}
        </Fragment>
      </Box>
    </>
  );
};

export default FilterAmountRange;
