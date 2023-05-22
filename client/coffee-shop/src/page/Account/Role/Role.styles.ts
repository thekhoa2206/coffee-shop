import { createStyles, Theme } from "@material-ui/core";
import defaultPalette, { colorInk } from "theme/palette";

const styles = (theme: Theme) => {
  return createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      padding: "0 32px 40px",
      flex: "1 1 auto",
      "& .MuiTableContainer-root.stickyHeader": {
        backgroundColor: "#F3F4F5",
      },
      "& .MuiTableHead-root": {
        backgroundColor: "#F3F4F5",
        "& .MuiTableCell-paddingNone": {
          padding: "0 16px",
        },
        "& .MuiTableCell-root": {
          paddingTop: "12px",
          paddingBottom: "12px",
        },
      },
    },
    listBox: {
      backgroundColor: "white",
      boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "60px",
    },
    headerItem: {
      display: "flex",
      alignItems: "center",
    },
    utilities: {
      display: "flex",
      flexDirection: "column",
      minHeight: 116,
      backgroundColor: "white",
    },
    tabLabel: {
      position: "relative",
      display: "flex",
      "&.Mui-selected:hover .deleteTabIcon": {
        display: "block",
      },
      "& .MuiTab-wrapper": {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: 167,
        display: "block",
      },
    },
    filterAndSearchBox: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: "16px",
    },
    searchbox: {
      flex: 1,
    },
    saveSearchButton: {
      minHeight: 36,
      "&.Mui-disabled": {
        backgroundColor: colorInk.base30,
        color: colorInk.base60,
      },
    },
    dInline: {
      width: "fit-content",
      display: "inline-block",
      maxWidth: "100%",
    },
  });
};

export default styles;
