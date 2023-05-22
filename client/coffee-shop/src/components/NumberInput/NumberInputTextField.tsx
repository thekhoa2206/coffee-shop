import TextField, { ExtendedTooltipProps } from "components/TextField";
import React, { useMemo } from "react";
import NumberFormat from "react-number-format";
import { SapoTextFieldProps } from "components/SapoTextField/SapoTextField";

interface NumberInputTextFieldProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  styleInput?: React.CSSProperties;
  max?: number;
  min?: number;
  decimalSeparator?: boolean;
  selectOnFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: number | null;
  decimalScale?: number;
  id?: string;
  classes?: any;
  inputComponent?: React.ComponentClass<any, any> | React.FunctionComponent<any>;
  label?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  style?: React.CSSProperties;
  onBlur?: () => void;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  allowNegative?: boolean;
  defaultValue?: number;
  tooltipLabelProps?: ExtendedTooltipProps;
  itemID?: string;
  textFieldProps?: Omit<SapoTextFieldProps, "onChange" | "ref" | "value" | "type" | "innerRef" | "defaultValue">;
  debounceTimeout?: number;
}

const NumberInputTextField = React.forwardRef((props: NumberInputTextFieldProps, ref: any) => {
  const {
    onChange,
    styleInput,
    max,
    min,
    decimalSeparator,
    defaultValue,
    tooltipLabelProps,
    textFieldProps,
    debounceTimeout = 100,
    allowNegative,
  } = props;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props.onFocus) {
      props.onFocus();
    }
    if (props.selectOnFocus) {
      e.target.select();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (props.onBlur) {
      props.onBlur();
    }
  };

  const remainProps = useMemo(() => {
    return props.inputComponent
      ? {}
      : {
          tooltipLabelProps: tooltipLabelProps,
        };
  }, []);

  return (
    <NumberFormat
      style={props.style}
      {...(textFieldProps ? textFieldProps : ({} as any))}
      ref={ref}
      autoFocus={props.autoFocus}
      disabled={props.disabled}
      id={props.id}
      name={props.name}
      label={props.label}
      value={props.value}
      classes={props.classes}
      onValueChange={(values) => {
        onChange({ target: { name: props.name, value: values.value } });
      }}
      thousandSeparator
      decimalSeparator={decimalSeparator ? "." : false}
      inputProps={{
        style: {
          ...styleInput,
          width: "100%",
          textAlign: styleInput?.textAlign ? styleInput.textAlign : "right",
        },
        itemID: props.itemID,
      }}
      error={props.error}
      helperText={props.helperText}
      required={props.required}
      fullWidth={props.fullWidth}
      onFocus={handleFocus}
      onKeyDown={props.onKeyDown}
      isNumericString={true}
      allowNegative={props.allowNegative || false}
      customInput={props.inputComponent ? props.inputComponent : TextField}
      decimalScale={props.decimalScale}
      autoComplete="off"
      // allowLeadingZeros={false}
      isAllowed={(values) => {
        const { floatValue } = values;
        return floatValue !== undefined
          ? floatValue <= (max ? max : 9999999999) && floatValue >= (min ? min : -9999999999)
          : true;
      }}
      onBlur={handleBlur}
      placeholder={props.placeholder}
      defaultValue={defaultValue}
      {...remainProps}
    />
  );
});

export default React.memo(NumberInputTextField);
