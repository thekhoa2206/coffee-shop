import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: 24,
      width: 42,
      margin: "6px 0",
      padding: "0 9px",
    },
    dayCurrent: {
      width: 24,
      padding: "0 9px",
    },
    dayFirst: {
      backgroundColor: "#F2F9FF",
      marginLeft: 9,
      paddingLeft: 0,
      width: 33,
      borderTopLeftRadius: "50%",
      borderBottomLeftRadius: "50%",
    },
    dayLast: {
      backgroundColor: "#F2F9FF",
      marginRight: 9,
      paddingRight: 0,
      width: 33,
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
    },
    dayBetween: {
      backgroundColor: "#F2F9FF",
    },
    btnDay: {
      width: "120%",
      height: "120%",
      fontSize: 15,
      fontWeight: 400,
      color: "#182537",
      padding: 0,
      "&:hover": {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.light,
      },
    },
    btnInActive: {
      color: theme.palette.text.disabled,
      textDecoration: "line-through",
      cursor: "not-allowed",
      pointerEvents: "none",
    },
    btnHighlight: {
      borderRadius: "50%",
      color: "#182537",
    },
    btnFirstHighlight: {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
    },
    btnEndHighlight: {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
    },
    btnNonCurrentMonthDay: {
      color: theme.palette.text.disabled,
    },
    btnHighlightNonCurrentMonthDay: {
      color: theme.palette.common.white,
    },
    btnBorder: {
      border: "1px solid #D3D5D7",
    },
    hidden: {
      visibility: "hidden",
    },
  });

export default styles;
