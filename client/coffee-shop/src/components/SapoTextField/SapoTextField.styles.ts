import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";
import { colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
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
  rootVariantOutlined: {
    "& > .MuiFormLabel-root": {
      marginBottom: 7,
      height: 17,
      lineHeight: "17px",
    },
    "& > .MuiFormLabel-root:not(.Mui-disabled)": {
      color: colorInk.primary,
    },
    "& .MuiFormLabel-asterisk": {
      color: theme.palette.error.main,
    },
  },
  rootVariantStandard: {
    "& .MuiInputBase-root.MuiInput-underline": {
      // "&:after": {
      //   borderBottomWidth: 1,
      // },
      "&:before": {
        borderBottomColor: "#D3D5D7",
      },
      "&:hover": {
        "&:before": {
          // borderBottomWidth: 1,
          borderBottomColor: "#7A8086",
        },
      },
    },
    "& .MuiInput-underline.Mui-disabled": {
      "&:before": {
        border: "none",
      },
      "&:after": {
        border: "none",
      },
    },
  },
  textFieldRoot: {
    "& .MuiOutlinedInput-notchedOutline": {
      // top: 0,
    },
    "& .MuiOutlinedInput-root": {
      height: 40,
      "& .MuiInputBase-input": {
        padding: "0 12px",
        height: "100%",
      },
      "&:not(.Mui-error):not(.Mui-disabled):not(.Mui-focused):hover": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#7A8086",
        },
      },
      "&.Mui-disabled": {
        borderColor: "#D3D5D7",
        backgroundColor: colorInk.base20,
      },
      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderWidth: 1,
        },
      },
    },
    "& .MuiFormHelperText-root": {
      fontSize: 12,
      marginLeft: 12,
    },
    "& .MuiOutlinedInput-multiline": {
      height: "auto",
      padding: "11px 12px",
      color: colorInk.primary,
      "& textarea": {
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
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
    },
  },
  textarea: {
    height: "auto",
  },
  tooltipLabel: {
    order: 1,
  },
}));

export default useStyles;
