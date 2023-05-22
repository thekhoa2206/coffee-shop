import { createStyles, Theme } from "@material-ui/core";

const HEIGHT_OPTION = 40;

const styles = (theme: Theme) =>
  createStyles({
    textFieldRoot: {
      height: 36,
      width: "100%",
      "& input": {
        padding: "12px",
      },
      "& .MuiInputBase-root": {
        height: "100%",
      },
      "&:focus": { outline: "none" },
      "& .MuiOutlinedInput-adornedStart": {
        paddingLeft: 12,
        "& .MuiInputAdornment-positionStart": {
          marginRight: 0,
        },
      },
      "& .MuiInputAdornment-positionStart + .MuiOutlinedInput-notchedOutline": {
        paddingLeft: 8,
      },
    },
    endAdornment: {
      marginRight: 16,
      top: 0,
      height: "100%",
      display: "flex",
      alignItems: "center",
    },
    clearIndicator: {
      width: 17,
      height: 17,
      fontSize: 17,
      padding: 0,
      color: "#fff",
      backgroundColor: "#A3A8AF",
    },
    listbox: {
      padding: 0,
      maxHeight: HEIGHT_OPTION * 6,
      "&::-webkit-scrollbar": {
        width: 8,
        backgroundColor: "#E8EAEB",
      },
      "&::-webkit-scrollbar-track": {
        borderRadius: 4,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#A3A8AF",
        borderRadius: 4,
      },
    },
    option: {
      minHeight: HEIGHT_OPTION,
      "&[data-focus='true']": {
        backgroundColor: "transparent",
      },
      "&:hover, &:focus, &[aria-selected='true']": {
        backgroundColor: "#F2F9FF",
      },
    },
    searchIcon: {
      fontSize: 16,
      color: "#A3A8AF",
    },
  });

export default styles;
