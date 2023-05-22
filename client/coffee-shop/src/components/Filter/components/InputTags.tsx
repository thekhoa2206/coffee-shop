import { Box, Chip, InputBase, makeStyles, Theme } from "@material-ui/core";
import React, { useRef } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { colorInk } from "theme/palette";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    minHeight: 36,
    border: "1px solid #D3D5D7",
    boxSizing: "border-box",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    flexWrap: "wrap",
    "&.focus": {
      borderColor: theme.palette.primary.main,
    },
  },
  rootError: {
    width: "100%",
    minHeight: 36,
    border: "1px solid red",
    boxSizing: "border-box",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    flexWrap: "wrap",
    "&.focus": {
      borderColor: theme.palette.primary.main,
    },
  },
  input: {
    // padding: "0 12px",
    flexGrow: 1,
    minWidth: 20,
    "& input::placeholder": {
      color: colorInk.base40,
      opacity: 1,
    },
    // height: 36,
  },
  inputError: {
    flexGrow: 1,
    minWidth: 20,
    "& input::placeholder": {
      color: "red",
      opacity: 1,
    },
  },
  chip: {
    height: 24,
    maxWidth: "100%",
    borderRadius: 20,
    background: "#E6F4FF",
    fontSize: 14,
    cursor: "pointer",
    margin: 2.5,
    "& .MuiChip-deleteIcon": {
      width: 17.5,
      height: 17.5,
      color: theme.palette.primary.main,
    },
  },
}));

interface InputTagsProps {
  tags: string[];
  placeholder?: string;
  inputValue?: string;
  onKeyDown?: (e: any) => void;
  onClick?: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  onChange?: (e: any) => void;
  onDelete?: (value: string) => void;
  error?: boolean;
}

const InputTags = (props: InputTagsProps) => {
  const { tags, placeholder, inputValue, onClick, onKeyDown, onFocus, onBlur, onChange, onDelete, error } = props;
  const classes = useStyles();
  const inputRef = useRef();
  return (
    <Box className={!error ? classes.root : classes.rootError}>
      {React.Children.toArray(
        tags.map((item) => (
          <Chip
            label={item}
            onDelete={(e) => onDelete?.(item)}
            onClick={() => {}}
            className={classes.chip}
            deleteIcon={<ClearIcon />}
          />
        ))
      )}
      <InputBase
        ref={inputRef}
        onFocus={(e) => {
          (inputRef?.current as any)?.parentElement.classList.add("focus");
          onFocus?.(e);
        }}
        onBlur={(e) => {
          (inputRef?.current as any)?.parentElement.classList.remove("focus");
          onBlur?.(e);
        }}
        inputProps={{
          onKeyDown: (e) => {
            onKeyDown?.(e);
          },
        }}
        className={!error ? classes.input : classes.inputError}
        placeholder={placeholder}
        onClick={onClick}
        value={inputValue}
        onChange={onChange}
      />
    </Box>
  );
};

export default InputTags;
