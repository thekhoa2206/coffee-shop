import { FormControl, FormControlProps, FormHelperText, InputLabel, TooltipProps, Typography } from "@material-ui/core";
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@material-ui/core/TextField";
import clsx from "clsx";
import { InfoCircle } from "components/SVG";
import TooltipComponent from "components/Tooltip";
import React, { memo, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import useStyles from "./TextField.styles";

type Diff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];
type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

export interface ExtendedTooltipProps extends Overwrite<TooltipProps, TooltipPropsCustom> {}

interface CustomProps {
  helperText?: string | false;
  noteFooterElm?: JSX.Element;
  tooltipProps?: ExtendedTooltipProps;
  tooltipLabelProps?: ExtendedTooltipProps;
  refresh?: number;
  parentValue?: any;
}

interface TooltipPropsCustom {
  children?: React.ReactElement;
}

export type TextFieldProps = CustomProps & MuiTextFieldProps & FormControlProps;

const areEquals = (prevProps: TextFieldProps, nextProps: TextFieldProps): boolean => {
  if (prevProps.error !== nextProps.error) {
    return false;
  }
  if (prevProps.tooltipProps?.title !== nextProps.tooltipProps?.title) {
    return false;
  }
  if (prevProps.helperText !== nextProps.helperText) {
    return false;
  }
  if (prevProps.value !== nextProps.value) {
    return false;
  }
  if (prevProps.disabled !== nextProps.disabled) {
    return false;
  }
  if (prevProps.defaultValue !== nextProps.defaultValue) {
    return false;
  }
  if (prevProps.focused !== nextProps.focused) {
    return false;
  }
  if (prevProps.label !== nextProps.label) {
    return false;
  }
  if (prevProps.refresh !== nextProps.refresh) {
    return false;
  }
  if (prevProps.parentValue !== nextProps.parentValue) {
    return false;
  }
  if (prevProps.onBlur !== nextProps.onBlur) {
    return false;
  }
  if (prevProps.onChange !== nextProps.onChange) {
    return false;
  }
  return true;
};


const TextField = memo((props: TextFieldProps) => {
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
    disabled,
    inputProps,
    refresh,
    parentValue,
    itemID,
    noteFooterElm,
    ...remainProps
  } = props;
  let idInput = useMemo(() => (id ? id : uuidv4()), [id]);
  const classes = useStyles();
  return (
    <FormControl
      classes={{ root: clsx(classes.root, { disabled: disabled }) }}
      style={style}
      error={error}
      fullWidth={fullWidth}
    >
      {label && (
        <InputLabel shrink className={classes.inputLabelRoot} htmlFor={idInput} required={required}>
          {label}
          {tooltipLabelProps?.title && (
            <TooltipComponent placement="top" arrow classes={{ tooltip: classes.tooltipLabel }} {...tooltipLabelProps}>
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
          value={value}
          onChange={(event) => {
            onChange && onChange(event);
          }}
          onBlur={onBlur}
          inputProps={{ "aria-label": "Without label", itemID: itemID, ...inputProps }}
          disabled={disabled}
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
      {noteFooterElm || ""}
      {helperText && error ? (
        <FormHelperText classes={{ root: classes.helperTextRoot }}>{helperText}</FormHelperText>
      ) : (
        ""
      )}
    </FormControl>
  );
}, areEquals);

export default TextField;
