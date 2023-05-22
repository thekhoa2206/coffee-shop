import { FormControl, FormLabel, TooltipProps } from "@material-ui/core";
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@material-ui/core/TextField";
import clsx from "clsx";
import { InfoCircle } from "components/SVG";
import TooltipComponent from "components/Tooltip";
import React, { Fragment } from "react";
import useStyles from "./SapoTextField.styles";

type Diff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];
type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

interface ExtendedTooltipProps extends Overwrite<TooltipProps, TooltipPropsCustom> {}

interface CustomProps {
  helperText?: string | false;
  tooltipProps?: ExtendedTooltipProps;
  tooltipLabelProps?: ExtendedTooltipProps;
  debounceTimeout?: number | null;
}

interface TooltipPropsCustom {
  children?: React.ReactElement;
  maxWidth?: string;
}

export type SapoTextFieldProps = CustomProps & Omit<MuiTextFieldProps, "classes">;


const SapoTextField = React.memo(
  React.forwardRef((props: SapoTextFieldProps, ref: any) => {
    const {
      label,
      error,
      multiline,
      helperText,
      required,
      style,
      id,
      fullWidth,
      className,
      value,
      onChange,
      disabled,
      tooltipProps,
      tooltipLabelProps,
      inputProps,
      debounceTimeout,
      variant = "outlined",
      ...remainProps
    } = props;
    const classes = useStyles();

    const getTextFieldElement = () => (
      <MuiTextField
        {...remainProps}
        ref={ref}
        id={id}
        inputProps={inputProps}
        variant={variant}
        onChange={onChange}
        label={variant === "standard" ? label : ""}
        helperText={error ? helperText : ""}
        classes={{ root: clsx(classes.textFieldRoot, { [classes.textarea]: multiline }) }}
        multiline={multiline}
        value={value}
        error={error}
        disabled={disabled}
        fullWidth={fullWidth}
      />
    );

    return (
      <FormControl
        classes={{
          root: clsx(classes.root, variant === "outlined" ? classes.rootVariantOutlined : classes.rootVariantStandard),
        }}
        error={error}
        disabled={disabled}
        style={style}
        fullWidth={fullWidth}
        className={className}
        required={required}
      >
        {variant === "outlined" && label && (
          <FormLabel required={required} disabled={disabled}>
            {label}
            {tooltipLabelProps?.title && (
              <TooltipComponent
                placement="top"
                arrow
                classes={{ tooltip: classes.tooltipLabel }}
                {...tooltipLabelProps}
              >
                <span style={{ marginLeft: required ? 13 : 6, width: 12, height: 12, position: "absolute", top: 2 }}>
                  <InfoCircle
                    style={{
                      width: 12,
                      height: 12,
                      cursor: "pointer",
                    }}
                    color="primary"
                  />
                </span>
              </TooltipComponent>
            )}
          </FormLabel>
        )}

        {tooltipProps?.title ? (
          <TooltipComponent {...tooltipProps} title={tooltipProps?.title || ""}>
            {getTextFieldElement()}
          </TooltipComponent>
        ) : (
          <Fragment>{getTextFieldElement()}</Fragment>
        )}
      </FormControl>
    );
  })
);

export default SapoTextField;
