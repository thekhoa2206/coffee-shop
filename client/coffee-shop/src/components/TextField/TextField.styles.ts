import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { colorBorder, colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignSelf: "center",
    paddingTop: 24,
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: "1px",
    },
    "& textarea": {
      "&::-webkit-scrollbar": {
        width: 6,
        height: 6,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#bcbcbc",
        borderRadius: 6,
        "&:hover": {
          backgroundColor: colorInk.base40,
        },
      },
    },
  },
  inputLabelRoot: {
    top: 0,
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
  textFieldRoot: {
    height: 40,
    "& input": {
      height: 40,
      padding: "0 12px",
      color: colorInk.primary,
      "&.Mui-disabled": {
        color: colorInk.base60,
      },
      "&::placeholder": {
        color: colorInk.base40,
        opacity: 1,
      },
    },
    "& .Mui-disabled": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colorBorder.primary.main,
      },
    },
    "& .MuiOutlinedInput-root:hover:not(.Mui-focused)": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colorBorder.primary.dark,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      padding: 0,
      borderColor: colorBorder.primary.main,
    },
    "& .MuiOutlinedInput-multiline": {
      padding: 0,
      color: colorInk.primary,
      "& textarea": {
        padding: "11px 12px",
        "&::placeholder": {
          color: colorInk.base40,
          opacity: 1,
        },
      },
      "& textarea[rows='2']": {
        height: 42,
      },
      "& textarea[rows='3']": {
        height: 50,
      },
    },
    "& .MuiInputBase-root": {
      height: "100%",
    },
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
    },
  },
  textarea: {
    height: "auto",
  },
  helperTextRoot: {
    fontSize: "12px",
    paddingLeft: "12px",
  },
  tooltipLabel: {
    order: 1,
  },
}));
export default useStyles;
