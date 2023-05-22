import React from "react";
import NumberFormat from "react-number-format";

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  style?: React.CSSProperties;
  max?: number;
  decimalSeparator?: boolean;
  selectonfocus?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: number;
  decimalScale?: number;
}

export default function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, onChange, style, max, decimalSeparator, ...other } = props;

  // const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  //   if (props.selectonfocus === "true") {
  //     e.target.select();
  //   }
  // };

  return (
    <NumberFormat
      {...other}
      value={props.value}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({ target: { name: props.name, value: values.value } });
      }}
      thousandSeparator
      decimalSeparator={decimalSeparator ? "." : false}
      style={{
        ...style,
        textAlign: style?.textAlign ? style.textAlign : "right",
      }}
      // onFocus={handleFocus}
      onKeyDown={props.onKeyDown}
      isNumericString={true}
      allowNegative={false}
      decimalScale={props.decimalScale}
      autoComplete="off"
      // allowLeadingZeros={false}
      isAllowed={(values) => {
        const { floatValue } = values;
        return floatValue !== undefined ? floatValue <= (max ? max : 9999999999) : true;
      }}
    />
  );
}
