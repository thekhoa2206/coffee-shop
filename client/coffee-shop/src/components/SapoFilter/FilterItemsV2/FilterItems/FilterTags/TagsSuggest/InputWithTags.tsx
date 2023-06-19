import { Box, Chip, ClickAwayListener, IconButton, InputBase as MuiInputBase } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { isEqual } from "lodash";
import React, { FocusEvent, Fragment, useEffect, useRef, useState } from "react";
import { colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  rootInputSearch: {
    height: 36,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #D3D5D7",
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    padding: "0 12px",

    "& .MuiInputBase-input": {
      color: colorInk.primary,
      "&::placeholder": {
        color: colorInk.base40,
        opacity: 1,
      },
    },

    "&.focused": {
      borderColor: theme.palette.primary.main,
    },
    "& .search-icon, .clear-icon": {
      color: "#A3A8AF",
    },
    "& .clear-icon": {
      cursor: "pointer",
    },
    "& .input-element": {
      width: "100%",
      height: "100%",
      padding: "0 4px",
    },
    "& .delete-chip-button": {
      height: 24,
      borderRadius: 20,
      background: "#D9EDFF",
      color: "#2B4263",
      fontSize: 14,
      cursor: "pointer",
      "& .MuiChip-deleteIcon": {
        width: 17.5,
        height: 17.5,
        color: theme.palette.primary.main,
      },
    },
    "&.root-input-tags": {
      flexWrap: "wrap",
      minHeight: 36,
      height: "unset",
      justifyContent: "flex-start",
      paddingTop: 3,
      paddingBottom: 3,
      boxSizing: "border-box",
      "& .input-tags": {
        width: "0",
        minWidth: 80,
        flexGrow: 1,
      },
      "& .chip-tag": {
        maxWidth: "100%",
        height: 24,
        margin: "4px 8px 4px 0",
        background: "#D9EDFF",
        fontSize: 14,
        color: "#2B4263",
        "& .MuiSvgIcon-root": {
          color: theme.palette.primary.main,
          width: 18,
          height: 18,
        },
      },
    },
  },
}));

interface InputWithTagsProps {
  values: string[];
  placeholder?: string;
  onChange?: (values: string[]) => void;
  onInputChange?: (value: string) => void;
}

const InputWithTags = (props: InputWithTagsProps) => {
  const { placeholder, onChange, onInputChange } = props;
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>();
  const classes = useStyles();
  const [values, setValues] = useState(props.values);
  const inputValueRef = useRef<string>(inputValue);
  const valuesRef = useRef<string[]>(values);
  const onDeleteTag = (item: string) => {
    let newOptions = values.filter((m) => !isEqual(m, item));
    onChange?.(newOptions);
    setValues(newOptions);
  };

  useEffect(() => {
    inputValueRef.current = inputValue;
    valuesRef.current = values;
  }, [inputValue, values]);

  useEffect(() => {
    return () => {
      if (inputValueRef.current && valuesRef.current) {
        if (!valuesRef.current.some((m) => isEqual(m, inputValueRef.current))) {
          let newOptions = [...valuesRef.current, ...(inputValueRef.current.trim().split(",") as any)];
          onChange?.(newOptions);
        }
      }
    };
  }, []);

  const handleInputFocus = () => {
    setIsInputFocus(true);
  };

  const handleInputBlur = () => {
    if (inputValue.trim() && values.length <= 0) {
      if (!values.some((m) => isEqual(m, inputValue))) {
        let newOptions = [...values, ...(inputValue.trim().split(",") as any)];
        onChange?.(newOptions);
        setValues(newOptions);
        setInputValue("");
      }
    }
  };

  console.log(inputValue);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputValue && inputValue.trim() && (event.key === "Enter" || event.key === ",")) {
      if (!values.some((m) => isEqual(m, inputValue))) {
        let newOptions = [...values, ...(inputValue.trim().split(",") as any)];
        onChange?.(newOptions);
        setValues(newOptions);
      }
      setInputValue("");
    } else if (event.key === "Backspace" && inputValue === "") {
      let newOptions = [...values];
      newOptions.pop();
      onChange?.(newOptions);
      setValues(newOptions);
    }
  };

  return (
    <Fragment>
      <ClickAwayListener onClickAway={() => setIsInputFocus(false)} mouseEvent="onMouseDown">
        <Box
          className={clsx(classes.rootInputSearch, "root-input-tags", isInputFocus ? "focused" : "")}
          onClick={() => {
            setIsInputFocus(true);
            inputRef?.current?.querySelector("input")?.focus();
          }}
        >
          {React.Children.toArray(
            values.map((item) => (
              <Chip
                label={item}
                onDelete={(e) => onDeleteTag(item)}
                onClick={() => {}}
                className="chip-tag"
                deleteIcon={<ClearIcon />}
              />
            ))
          )}
          <MuiInputBase
            autoFocus
            input-type="sapo-autocomplete-input"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              let _inputValue = e.target.value;
              if (_inputValue.indexOf(",") === 0) {
                _inputValue = _inputValue.slice(1, _inputValue.length);
              }
              setInputValue(_inputValue);
              onInputChange?.(_inputValue);
            }}
            className="input-tags"
            ref={inputRef}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
          />
        </Box>
      </ClickAwayListener>
    </Fragment>
  );
};

export default InputWithTags;
