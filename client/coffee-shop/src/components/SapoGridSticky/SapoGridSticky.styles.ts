import { makeStyles, Theme } from "@material-ui/core";
import { BORDER } from "./SapoGridSticky.constants";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "inline-grid",
    "& .sticky": {
      position: "sticky",
    },
    "& .row": {
      display: "flex",
      "&:hover": {
        "& .body-cell": {
          backgroundColor: "#F2F9FF",
        },
      },
    },
    maxWidth: "100%",
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
    "& .hidden": {
      display: "none",
    },
  },
  body: {},
  cell: {
    padding: "9px 6px",
    alignItems: "center",
    overflow: "hidden",
    borderLeft: BORDER,
    borderBottom: BORDER,
    backgroundColor: "#fff",
    "&:last-child": {
      borderRight: BORDER,
    },
  },
  tooltip: {
    boxShadow: "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
    opacity: "1 !important",
    maxWidth: 220,
    fontWeight: 400,
    fontSize: "12px !important",
    padding: "5px 8px !important",
    overflowWrap: "break-word",
    "z-index": "2000 !important",
  },
}));

export default useStyles;
