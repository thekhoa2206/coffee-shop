import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.paper,
      position: "sticky",
      top: 0,
      height: 52,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      zIndex: 1001,
      "& .open": {
        "& svg": {
          fill: theme.palette.primary.main,
        },
      },
      boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
    },
    headerRight: {
      display: "flex",
      alignItems: "center",
      height: "inherit",
    },
    helper: {
      display: "flex",
      alignItems: "center",
      padding: "16px 13px",
      cursor: "pointer",
      height: "100%",
      "& svg": {
        color: "#A2A8AF",
      },
      "&:hover": {
        background: "#F2F9FF",
        "& svg": {
          color: theme.palette.primary.main,
        },
        "& p": {
          color: theme.palette.primary.main,
        },
      },
    },
    helperIcon: {
      color: theme.palette.secondary.main,
      marginRight: 9,
    },
    avatar: {
      width: 30,
      height: 30,
    },
    userName: {
      fontWeight: 500,
      margin: "0 10px",
    },
    info: {},
    noti: {
      position: "relative",
    },
    countNoti: {
      position: "absolute",
      width: 20,
      height: 16,
      background: "#E94765",
      borderRadius: 10,
      color: "#FFFFFF",
      fontSize: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      top: 9,
      left: 25,
    },
    shadowHeader: {
      boxShadow: "0px 4px 8px rgba(168, 168, 168, 0.25)",
    },
    link: {
      display: "inline-flex",
      alignItems: "center",
      cursor: "pointer",
    },
    popoverRoot: {
      backgroundColor: theme.palette.background.paper,
      maxWidth: 1000,
      minWidth: 230,
    },
  });

export default styles;
