import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background: "#FFFFFF",
      width: "calc(100% - 12px)",
      marginRight: "auto",
      boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
    },
    headerGroupButton: {
      display: "flex",
      marginLeft: "auto",
    },
    topSaleList: {
      padding: 0,
    },
    selectCriteria: {
      marginLeft: 16,
      "& .MuiSelect-selectMenu": {
        padding: "6px 10px",
        height: "auto",
      },
      "& .MuiInputBase-root": {
        height: 36,
        "& .MuiSelect-root": {
          color: "#A3A8AF",
        },
      },
    },
    selectDateRange: {
      "& .MuiInputBase-root": {
        height: 36,
      },
    },
    boxNoDataProduct: {
      height: "280px",
      textAlign: "center",
      justifyContent: "center",
      display: "flex",
      flexFlow: "column",
      alignItems: " center",
      "& img": {
        width: "220px",
        height: "auto",
        maxWidth: "100%",
      },
    },
    "& .box-title": {
      paddingRight: "16px",
      "& .tab": {
        paddingLeft: "16px",
        display: "flex",
        height: "100%",
        alignItems: "center",
        paddingRight: "15px",
        cursor: "pointer",
        "&>.MuiTypography-root": {
          textTransform: "uppercase",
        },
      },
      "& .tab-active": {
        borderBottom: "2px solid #0088FF",
      },
    },
  });

export default styles;
