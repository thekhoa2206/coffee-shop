import { FormControl, FormControlProps, FormHelperText, InputLabel, TooltipProps, Typography } from "@material-ui/core";
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@material-ui/core/TextField";
import clsx from "clsx";
import { InfoCircle } from "components/SVG";
import TooltipComponent from "components/Tooltip";
import React, { memo, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useStyles from "./TextField.styles";
import useDebounce from "hocs/useDebounce";

interface CustomProps {
  helperText?: string | false;
  tooltipProps?: TooltipProps;
  tooltipLabelProps?: TooltipProps;
  debounceTimeout?: number | null;
}

export type TextFieldProps = CustomProps & MuiTextFieldProps & FormControlProps;


const TextField = memo(
  React.forwardRef((props: TextFieldProps, ref: any) => {
    const {
      label,
      error,
      multiline,
      helperText,
      required,
      style,
      id,
      fullWidth,
      onBlur,
      value,
      onChange,
      tooltipProps,
      tooltipLabelProps,
      inputProps,
      debounceTimeout,
      ...remainProps
    } = props;
    const [valueInput, setValueInput] = useState(value);
    const valueTerm = useDebounce(valueInput, debounceTimeout ? debounceTimeout : 0);
    const classes = useStyles();
    useEffect(() => {
      if (debounceTimeout && value !== valueInput) {
        setValueInput(value);
      }
    }, [value]);
    useEffect(() => {
      if (debounceTimeout && onChange && value !== valueTerm) {
        onChange(valueTerm);
      }
    }, [valueTerm]);
    let idInput = useMemo(() => (id ? id : uuidv4()), [id]);
    return (
      <FormControl classes={{ root: classes.root }} style={style} error={error} fullWidth={fullWidth}>
        {label && (
          <InputLabel shrink className={classes.inputLabelRoot} htmlFor={idInput} required={required}>
            {label}
            {tooltipLabelProps?.title && (
              <TooltipComponent
                placement="top"
                arrow
                classes={{ tooltip: classes.tooltipLabel }}
                {...tooltipLabelProps}
              >
                <Typography variant="caption">
                  <InfoCircle
                    style={{
                      width: 12,
                      height: 12,
                      cursor: "pointer",
                      marginLeft: 6,
                    }}
                    color="primary"
                  />
                </Typography>
              </TooltipComponent>
            )}
          </InputLabel>
        )}
        <TooltipComponent {...tooltipProps} title={tooltipProps?.title || ""}>
          <MuiTextField
            ref={ref}
            value={debounceTimeout ? valueInput : value}
            onChange={(event) => {
              if (debounceTimeout) {
                onChange && setValueInput(event.target.value);
              } else {
                onChange && onChange(event);
              }
            }}
            onBlur={onBlur}
            inputProps={{ "aria-label": "Without label", ...inputProps }}
            {...remainProps}
            multiline={multiline}
            error={error}
            required={required}
            label=""
            helperText=""
            variant="outlined"
            id={idInput}
            classes={{ root: clsx(classes.textFieldRoot, { [classes.textarea]: multiline }) }}
            fullWidth={fullWidth}
          />
        </TooltipComponent>
        {helperText && error ? (
          <FormHelperText classes={{ root: classes.helperTextRoot }}>{helperText}</FormHelperText>
        ) : (
          ""
        )}
      </FormControl>
    );
  })
);

export default TextField;
