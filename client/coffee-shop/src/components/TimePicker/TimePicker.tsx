import DateFnsUtils from "@date-io/date-fns";
import { Box, IconButton, InputAdornment, RootRef } from "@material-ui/core";
import { MuiPickersUtilsProvider, TimePicker as MuiTimePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { WithStyles, withStyles } from "@material-ui/styles";
import { Placement } from "@popperjs/core";
import Popper, { PopperBaseProps } from "components/Popper/PopperBase";
import ClockIcon from "components/SVG/ClockIcon";
import TextField from "components/TextField";
import moment from "moment";
import React, { Fragment, memo, useState } from "react";
import styles from "./TimePicker.styles";

interface TimePickerProps {
  required?: boolean;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  value?: Date | string | null;
  placement?: Placement;
  disablePortal?: boolean;
  label?: string;
  PopoverProps?: PopperBaseProps;
  onChange: (date: MaterialUiPickersDate, value?: string | null) => void;
}

const TimePicker = memo((props: TimePickerProps & WithStyles<typeof styles>) => {
  const {
    classes,
    placement,
    disablePortal,
    value,
    onChange,
    PopoverProps,
    required,
    label,
    fullWidth = true,
    helperText,
    error,
  } = props;
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (date: Date | null) => {
    onChange(date);
  };

  return (
    <Fragment>
      <RootRef rootRef={setAnchorEl}>
        <Box>
          <Popper
            open={open}
            width={390}
            referenceElement={anchorEl}
            onClose={handleClose}
            placement={"bottom-end" || placement}
            disablePortal={disablePortal}
            {...PopoverProps}
          >
            <Box className={classes.picker}>
              <MuiPickersUtilsProvider
                utils={DateFnsUtils}
              >
                <MuiTimePicker
                  ampm={false}
                  orientation="landscape"
                  variant="static"
                  value={value}
                  onChange={handleChange}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </Popper>
          <TextField
            onClick={() => setOpen(true)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <ClockIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required={required}
            label={label}
            inputProps={{
              readOnly: true,
              style: {
                cursor: "pointer",
              },
            }}
            focused={open}
            value={value && moment(value).format("HH:mm")}
            fullWidth={fullWidth}
            helperText={helperText}
            error={error}
          />
        </Box>
      </RootRef>
    </Fragment>
  );
});

TimePicker.displayName = "TimePicker";
export default withStyles(styles)(TimePicker);
