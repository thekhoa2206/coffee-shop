import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    headerWrapper: {
      overflow: "hidden",
      flex: "0 0 auto",
      zIndex: 2,
      "&.stickyHeader": {
        position: "sticky",
        top: 0,
        zIndex: 9,
      },
    },
    headerTable: {
      tableLayout: "fixed",
    },
    bodyWrapper: {
      flex: "1 1 auto",
      "&::-webkit-scrollbar": {
        width: 6,
        height: 8,
        backgroundColor: "#E8EAEB",
      },

      "&::-webkit-scrollbar-track": {
        background: "#E8EAEB",
      },

      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#A3A8AF",
        borderRadius: 6,
      },

      "&::-webkit-scrollbar-thumb:hover": {
        background: "#8d939c",
      },

      "&.menuCollapse": {
        "& .ps__rail-x": {
          left: "88px !important",
        },
      },

      "& .ps__rail-x": {
        position: "fixed",
        height: 13,
        bottom: 2,
        left: "262px !important",
        "& .ps__thumb-x": {
          height: "100%",
        },
      },
    },
    bodyTable: {
      tableLayout: "fixed",
    },
    tooltip: {
      boxShadow:
        "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
      opacity: "1 !important",
      maxWidth: 220,
      fontWeight: 400,
      fontSize: "12px !important",
      padding: "5px 8px !important",
      overflowWrap: "break-word",
      "z-index": "2000 !important",
    },
    trackHorizontal: {
      height: "13px !important",
      right: 47,
      bottom: 2,
      borderRadius: 6,
    },
    thumbHorizontal: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      borderRadius: "inherit",
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
    summaryTable: {
      lineHeight: 16,
      color: "#182537",
      fontSize: 16,
    },
    cellV2: {
      fontSize: "inherit",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      borderTop: "1px solid #E8EAEB",
      lineHeight: 1.5715,
      color: "inherit",
      paddingTop: 0,
      paddingBottom: 0,
      height: "44px",
      flexDirection: "unset",
    },
    cellBorder: {
      "& .MuiTableCell-root": {
        border: "1px solid #E8EAEB",
      },
    },
  })
);

export default useStyles;
