import { makeStyles, Theme } from "@material-ui/core";
import { colorInk, colorRedWarning } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    "& .SearchBox": {
      flex: "1 1",
      "&.error": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: colorRedWarning.primary.main,
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
      minHeight: 50,
      justifyContent: "flex-start",
      padding: "0 28px",
      position: "relative",
      "&:after": {
        content: "''",
        position: "absolute",
        backgroundColor: colorInk.base30,
        height: 1,
        bottom: 0,
        left: 24,
        right: 24,
      },
      "& .icon": {
        fontSize: 24,
        marginRight: 4,
      },
      "&:hover, &.focus-key-event": {
        backgroundColor: "#F2F9FF",
      },
    },
    "& .InfiniteScroll-ListItem": {
      "&>.InfiniteScroll-MenuItem": {
        borderRadius: 0,
        "&:hover": {
          backgroundColor: "#F2F9FF",
        },
        "&.MuiMenuItem-root": {
          borderBottom: "1px solid",
          borderBottomColor: colorInk.base30,
        },
      },
    },
  },
}));

export default useStyles;
