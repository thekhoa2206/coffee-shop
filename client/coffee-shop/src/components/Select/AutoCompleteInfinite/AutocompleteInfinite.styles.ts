import { makeStyles, Theme } from "@material-ui/core";
import { colorBorder, colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    "& .MuiInputBase-root.MuiInputBase-adornedEnd": {
      "&>svg": { color: colorInk.base40, margin: "0 7px" },
      "&:hover:not(&.Mui-disabled, &.Mui-focused)": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: colorBorder.primary.dark,
        },
      },
      "&.Mui-focused": {
        "&>svg": {
          color: theme.palette.primary.main,
          transform: "rotate(180deg)",
        },
      },
    },
  },
  list: {
    display: "flex",
    flexDirection: "column",
    "& .infinite-scroll-component": {
      scrollbarColor: "#A3A8AF #E8EAEB",
      scrollbarWidth: "thin",
      "&::-webkit-scrollbar": {
        width: 6,
        height: 8,
        backgroundColor: colorInk.base30,
      },
      "&::-webkit-scrollbar-track": {
        background: colorInk.base30,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#A3A8AF",
        borderRadius: 6,
        "&:hover": {
          backgroundColor: colorInk.base40,
        },
      },
    },
    "& .InfiniteScroll-BoxCreate": {
      minHeight: "unset",
      height: "auto",
      padding: "4px 16px",
      justifyContent: "flex-start",
      position: "relative",
      textAlign: "left",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "break-spaces",
      "&:after": {
        content: "''",
        position: "absolute",
        backgroundColor: colorInk.base30,
        height: 1,
        bottom: 0,
        left: 0,
        right: 0,
      },
      "& .icon": {
        fontSize: 20,
      },
      "&:hover, &.focus-key-event": {
        backgroundColor: "#F2F9FF",
      },
    },
    "& .InfiniteScroll-ListItem": {
      "&>.InfiniteScroll-MenuItem": {
        borderRadius: 0,
        margin: 0,
        whiteSpace: "break-spaces",
        overflow: "hidden",
        textOverflow: "ellipsis",
        "&.focus-key-event": {
          backgroundColor: "#F2F9FF",
        },
        "&.MuiMenuItem-root": {
          borderBottom: "1px solid",
          borderBottomColor: colorInk.base30,
        },
      },
    },
  },
  input: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
}));

export default useStyles;
