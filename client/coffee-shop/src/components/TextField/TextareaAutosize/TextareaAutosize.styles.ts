import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { colorBorder, colorInk } from "theme/palette";
import { TextareaAutosizeProps } from "./TextareaAutosize";

const useStyles = (props: TextareaAutosizeProps) =>
  makeStyles((theme: Theme) => ({
    root: {
      position: "relative",
    },
    input: {
      fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      width: "100%",
      fontSize: 14,
      padding: 10,
      color: colorInk.primary,
      borderColor: props.error ? theme.palette.error.main : "#D3D5D7",
      borderRadius: 3,
      border: "1px solid",
      "&::placeholder": {
        color: colorInk.base40,
        opacity: 1,
      },
      "&:not(.disabled):hover": {
        borderColor: colorBorder.primary.dark,
      },
      "&:focus": {
        outline: "none",
        borderColor: props.error ? theme.palette.error.main : theme.palette.primary.main,
      },
      "&:disabled": {
        color: colorInk.base60,
        backgroundColor: colorInk.base20,
      },
      resize: "none",
      "&::-webkit-scrollbar": {
        width: 8,
        height: 12,
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#E8EAEB",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#bcbcbc",
        borderRadius: 4,
        border: "2px solid #E8EAEB",
        "&:hover": {
          backgroundColor: "#A3A8AF",
        },
      },
    },
    inputLabelRoot: {
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
      marginBottom: 8,
    },
    helperTextRoot: {
      fontSize: "12px",
      color: theme.palette.error.main,
      paddingLeft: "12px",
    },
    tooltipLabel: {
      order: 1,
    },
    tooltipAddLink: {
      maxWidth: "unset !important",
    },
    toolbar: {
      position: "absolute",
      top: props.height && props.height + 24,
      bottom: props.height ? "unset" : 6,
      right: 1,
      borderRadius: 3,
      width: "calc(100% - 2px)",
      "&>.TextareaAutosize-Toolbar-body": {
        display: "flex",
        alignItems: "flex-end",
        "& .addLinkBtn": {
          padding: 0,
          marginLeft: 12,
          marginBottom: -2,
          "&:hover": {
            backgroundColor: "transparent",
          },
          "&>.addLinkIcon": {
            height: 10,
            width: 20,
            marginBottom: -2,
            cursor: "pointer",
            color: colorInk.base80,
          },
        },
        "& .counter": {
          marginLeft: "auto",
          marginRight: 8,
          color: colorInk.base80,
          padding: 0,
        },
      },
    },
  }));

export default useStyles;
