import { createStyles, Theme } from "@material-ui/core";
import defaultPalette, { colorInk } from "theme/palette";
const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#F4F4F4",
      padding: "0 32px 40px",
      flex: "1 1 auto",
      "& .MuiChip-root": {
        padding: "4px 4px",
        fontSize: "14px",
        height: "24px",
      },
      "& .MuiTableContainer-root.stickyHeader": {
        backgroundColor: "#F3F4F5",
      },
      "& .MuiTableHead-root": {
        backgroundColor: "#F3F4F5",
        "& .MuiTableCell-paddingNone": {
          padding: "0 16px",
        },
        "& .MuiTableCell-root": {
          paddingTop: "6px",
          paddingBottom: "6px",
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
      minHeight: 86,
      backgroundColor: "white",
    },
    bulkActions: {
      backgroundColor: "white",
      height: 36,
      "& .MuiSelect-select:focus": {
        backgroundColor: "unset",
      },
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
    actorRole: {
      fontSize: "12px",
      lineHeight: "16px",
      color: colorInk.base60,
    },
    description: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    innerHTML: {
      "& a": {
        fontSize: "16px",
        lineHeight: "20px",
        color: defaultPalette.primary.main,
        textDecoration: "auto",
      },
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    accountRolesLabel: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "150px",
    },
    tenantRoleLabel: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: 500,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      "-webkit-line-clamp": 2,
      "-webkit-box-orient": "vertical",
    },
    dInline: {
      width: "fit-content",
      display: "inline-block",
      maxWidth: "100%",
    },
    headerTitleLabel: {
      fontSize: "20px",
      lineHeight: "28px",
      color: "#0F1824",
      fontWeight: 500,
    },
  });

export default styles;
