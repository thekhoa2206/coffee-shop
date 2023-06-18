import { Box, makeStyles, Theme, Typography } from "@material-ui/core";
import clsx from "clsx";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import NumberInputTextField from "../../../NumberInput/NumberInputTextField";
import SapoTextField from "../../../SapoTextField";
import QuickFilterButton, { QuickFilterButtonProps } from "../../QuickFilter/QuickFilterButton";
import Popper from "components/Popper/PopperBase";
import Button from "../../../Button";
import { useTranslation } from "react-i18next";
import CheckboxComponent from '../../../Checkbox';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& .line-space": {
      width: 8,
      height: 1,
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
    padding: "12px",
  },
}));

interface QuickFilterAmountRangeProps {
  maxValue?: number;
  minValue?: number;
  btnProps?: QuickFilterButtonProps;
  label: string;
  placement?: string;
  onSubmit?: (position: boolean, minValue?: number, maxValue?: number) => void;
  withPositive?: boolean;
  position?: boolean;
}

const QuickFilterAmountRange = (props: QuickFilterAmountRangeProps) => {
  const {
    minValue,
    maxValue,
    btnProps,
    label,
    placement,
    onSubmit,
    withPositive,
    position
  } = props;
  const { t } = useTranslation(["component"]);
  const classes = useStyles();
  const [_minValue, setMinValue] = useState<number | undefined>(minValue);
  const [_maxValue, setMaxValue] = useState<number | undefined>(maxValue);
  const [_position, setPosition] = useState<boolean>(position || false);

  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<boolean>(false);
  const refPopper = useRef(null);
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
    setMinValue(minValue);
    setMaxValue(maxValue);
    setPosition(position || false);
  }, [open, minValue, maxValue, position]);
  const handleSubmit = () => {
    if (_maxValue && _minValue && _minValue > _maxValue) {
      setErrors(true);
      return;
    }
    setOpen(false);
    if (onSubmit) {
      onSubmit(_position, _minValue, _maxValue);
    }
  };
  return (
    <>
      <QuickFilterButton
        ref={refPopper}
        active={open}
        onClick={() => {
          setOpen(!open);
        }}
        children={label}
        {...btnProps}
      />
      <Popper
        referenceElement={refPopper.current}
        width={350}
        open={open}
        ignoreEventCloseInRootRef={true}
        onClose={() => {
          setOpen(false);
        }}
        placement={placement}
      >
        <Box className={classes.rootPopover}>
          <Fragment>
            <Box className={clsx(classes.root)}>
              <NumberInputTextField
                selectOnFocus
                name={`input-price-range-min`}
                decimalSeparator={true}
                decimalScale={0}
                value={_minValue}
                textFieldProps={{
                  variant: "outlined",
                }}
                placeholder="Nhập giá trị"
                inputComponent={SapoTextField}
                allowNegative
                onChange={(event: { target: { name: string; value: string } }) => {
                  debounceUpdateData({
                    value: event.target.value ? parseFloat(event.target.value) : undefined,
                    type: "min",
                  });
                  if (event.target.value) {
                    setPosition(false);
                  }
                  setErrors(false);
                }}
                style={{ paddingTop: "0" }}
                error={errors}
                max={9_999_999_999}
              />
              <span className="line-space" />
              <NumberInputTextField
                selectOnFocus
                name={`input-price-range-max`}
                decimalSeparator={true}
                decimalScale={0}
                value={_maxValue}
                textFieldProps={{
                  variant: "outlined",
                }}
                placeholder="Nhập giá trị"
                allowNegative
                inputComponent={SapoTextField}
                onChange={(event: { target: { name: string; value: string } }) => {
                  debounceUpdateData({
                    value: event.target.value ? parseFloat(event.target.value) : undefined,
                    type: "max",
                  });
                  if (event.target.value) {
                    setPosition(false);
                  }
                  setErrors(false);
                }}
                style={{ paddingTop: "0" }}
                error={errors}
                max={9_999_999_999}
              />
            </Box>
            {errors && (
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

            {withPositive &&
                <Box style={{ paddingTop: 12, display: 'flex', justifyContent: 'flex-start' }}>
                    <CheckboxComponent
                        name={"group.value"}
                        value={"group.value"}
                        onChange={(event, checked) => setPosition(checked)}
                        checked={_position}
                    />
                    <Typography style={{ paddingTop: 2 }}>Nợ cuối kỳ khác 0</Typography>
                </Box>
            }
            <Button
              size="small"
              color="primary"
              variant="contained"
              style={{ width: "100%", marginTop: 16, marginBottom: 0 }}
              onClick={handleSubmit}
            >
              {`${t("component:filter.filterBtnText")}`}
            </Button>
          </Fragment>
        </Box>
      </Popper>
    </>
  );
};

export default QuickFilterAmountRange;
