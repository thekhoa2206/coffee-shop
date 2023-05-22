import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    menuCreateOrder: {
      marginTop: "4px",
    },
    container: {
      margin: "0 auto",
      // width: "1366px",
      // "@media (max-width: 1366px)": {
      maxWidth: "1366px",
      width: "100%",
      // },
    },
    formOrder: {
      padding: "24px 32px",
      width: "100%",
    },
    dialogSettingsBoxAdditional: {
      "& .MuiDialogTitle-root": {
        "& .searchbox": {
          display: "none",
        },
      },
    },
    rootPaper: {
      padding: "16px 24px 0",
      boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
      height: "100%",
      minHeight: 120,
      paddingBottom: 30,
    },
    content: {
      display: "flex",
      flexDirection: "column",
    },
    boxNoResult: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 110,
      flexFlow: "column",
    },
    lineItem: {
      display: "flex",
      margin: 0,
      padding: "10px 24px 10px",
      position: "relative",
      borderRadius: 0,
      "&:after": {
        content: "''",
        position: "absolute",
        backgroundColor: colorInk.base30,
        height: 1,
        bottom: 0,
        left: 24,
        right: 24,
      },
      "&>.icon": {
        fontSize: 32,
        marginRight: 10,
        color: "#4BA7F3",
      },
    },
    closeIcon: {
      marginLeft: 8,
      height: 20,
    },
    searchSuggest: {
      "&.disabled": {
        backgroundColor: colorInk.base5,
        "& >.label-select": {
          color: colorInk.base60,
        },
      },
      "& .label-select": {
        color: colorInk.base40,
      },
    },
    customOptionShipper: {
      display: "flex",
      margin: 0,
      padding: "10px 24px 10px",
      position: "relative",
      borderRadius: 0,
      "&:after": {
        content: "''",
        position: "absolute",
        backgroundColor: colorInk.base30,
        height: 1,
        bottom: 0,
        left: 24,
        right: 24,
      },
      "&>.icon": {
        fontSize: 32,
        marginRight: 10,
        color: "#4BA7F3",
      },
    },
    createShipperButton: {
      width: "100%",
      display: "flex",
      fontSize: "1rem",
      fontWeight: 500,
      padding: "0 32px",
      position: "relative",
      minHeight: "50px",
      justifyContent: "flex-start",
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
    searchBox: {
      "& .label-select": {
        color: "#A3A8AF",
      },
    },
  })
);
export default useStyles;
