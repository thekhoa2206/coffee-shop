import { colorBorder, colorInk } from "theme/palette";
import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      "& .MuiInputBase-root": {
        minHeight: 72,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "5px 5px 5px 5px",
        paddingRight: "5px !important",
      },
      '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input': {
        paddingLeft: 6,
        paddingRight: 6,
      },
      "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
        borderColor: colorBorder.primary.main,
      },
    },
    paper: {
      margin: 0,
      boxShadow:
        "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)",
      "& .MuiAutocomplete-option": {
        borderRadius: 3,
        margin: "6px 0",
      },
      "& .MuiAutocomplete-option[aria-selected='true']": {
        backgroundColor: "#D9EDFF",
      },
      "& .MuiAutocomplete-option[data-focus='true']": {
        backgroundColor: "#D9EDFF",
        color: theme.palette.primary.main,
      },
      "& .MuiAutocomplete-listbox": {
        padding: "3px 5px",
        maxHeight: 324,
        "&::-webkit-scrollbar": {
          width: 6,
          height: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#bcbcbc",
          borderRadius: 6,
          "&:hover": {
            backgroundColor: "#A3A8AF",
          },
        },
      },
    },
    textFieldRoot: {
      "& .MuiOutlinedInput-root": {
        borderRadius: 3,
        color: colorInk.primary,
        "&:hover:not(.Mui-focused):not(.Mui-disabled)": {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colorBorder.primary.dark,
          },
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderWidth: "1px",
        },
        "& input": {
          "&::placeholder": {
            color: colorInk.base40,
            opacity: 1,
          },
          "&:disabled": {
            display: "none",
          },
        },
      },
    },
    inputLabelRoot: {
      top: 0,
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      color: colorInk.base80,
      "&.MuiInputLabel-shrink": {
        transform: "none",
        fontSize: 14,
        lineHeight: "17px",
      },
      "&.Mui-error": {
        color: colorInk.base80,
      },
      "& .MuiFormLabel-asterisk": {
        color: theme.palette.error.main,
      },
    },
    tooltipLabel: {
      order: 1,
    },
    tag: {
      margin: 4,
      backgroundColor: "#D9EDFF",
      color: "#2B4263",
      padding: "2px 0px",
      whiteSpace: "normal",
      height: "unset",
      minHeight: 24,
      userSelect: "auto",
      "&>.MuiChip-label": {
        whiteSpace: "normal",
      },
      "&:not(.MuiChip-deletable)": {
        minHeight: 24,
        borderRadius: 16,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 15px",
      },
    },
    closeTagIcon: {
      width: 12,
      height: 12,
      marginTop: -2,
      marginRight: 12,
      color: theme.palette.primary.main,
    },
  });

export default styles;
