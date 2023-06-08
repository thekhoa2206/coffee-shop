import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@material-ui/core";
import { InputQuantityProps } from "./InputQuantity.types";
import NumberInputTextField from "../NumberInput/NumberInputTextField";
import useDebounce from "hocs/useDebounce";
import useStyles from "./InputQuantity.styles";
import RemoveCircleOutlinedIcon from "@material-ui/icons/RemoveCircleOutlined";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";
import clsx from "clsx";
import SapoTextField from "components/SapoTextField";

const InputQuantity = (props: InputQuantityProps) => {
  const {
    max,
    onChange,
    value,
    decimalScale = 3,
    decimalSeparator = true,
    className,
    style,
    autoHidden,
    name = "quantity",
    disabled,
    styleInput,
  } = props;
  const classes = useStyles();
  const [valueInput, setValueInput] = useState(value);
  const valueTerm = useDebounce(valueInput, 100);

  useEffect(() => {
    if (!(isNaN(valueInput) && value === 0)) {
      if (value !== valueInput) {
        setValueInput(value);
      }
    }
  }, [value]);

  useEffect(() => {
    if (value !== valueTerm) {
      onChange(valueTerm);
    }
  }, [valueTerm]);

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let quantity = event.target.value;
    setValueInput(parseFloat(quantity));
  };

  const handleClickBtn = (name: string) => {
    if (name === "down") {
      onKeyPress("down");
    }
    if (name === "up") {
      onKeyPress("up");
    }
    setTimeout(() => {
      document.getElementsByName(props.name || "quantity")?.[0]?.focus();
    });
  };
  const handleKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.keyCode === 40) {
      e.preventDefault();
      onKeyPress("down");
    }
    if (e.keyCode === 38) {
      e.preventDefault();
      onKeyPress("up");
    }
  };

  const onKeyPress = (key: string) => {
    if (value > 0 && key === "down") {
      setValueInput(parseFloat(!isNaN(valueInput) && valueInput >= 1 ? (valueInput - 1).toFixed(3) : "0"));
    }
    if ((valueInput < max || isNaN(valueInput)) && key === "up") {
      setValueInput(parseFloat(!isNaN(valueInput) ? (valueInput + 1).toFixed(3) : "1"));
    }
  };

  return (
    <Box className={clsx(classes.root, className)}>
      {/* <IconButton
        disabled={disabled}
        classes={{ root: classes.iconButton }}
        className={clsx("icon-btn btn-subtract", autoHidden ? "auto-hidden" : "")}
        onClick={() => handleClickBtn("down")}
      >
        <RemoveCircleOutlinedIcon fontSize="small" />
      </IconButton> */}
      <NumberInputTextField
        inputComponent={SapoTextField}
        textFieldProps={{
          variant: "standard",
          className: classes.textField,
        }}
        name={name}
        disabled={disabled}
        onChange={onChangeInput as any}
        value={valueInput}
        decimalSeparator={decimalSeparator}
        decimalScale={decimalScale}
        onKeyDown={handleKey}
        styleInput={styleInput ? styleInput : { textAlign: "center" } }
        selectOnFocus={true}
        max={max}
        style={style}
      />
{/* 
      <IconButton
        disabled={disabled}
        classes={{ root: classes.iconButton }}
        className={clsx("icon-btn btn-add", autoHidden ? "auto-hidden" : "")}
        onClick={(e) => handleClickBtn("up")}
      >
        <AddCircleOutlinedIcon fontSize="small" />
      </IconButton> */}
    </Box>
  );
};

export default InputQuantity;
