import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    popoverPaper: {
      marginTop: 4,
      width: 350,
      padding: "12px 8px 16px",
      "&::-webkit-scrollbar": {
        display: "none",
      }
    },
    dateWrapper: {
      marginTop: 16,
      border: "1px solid #E8EAEB",
    },
    hidden: {
      display: "none",
    },
    groupPredefined: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    toggleButton: {
      height: 40,
      width: "calc(50% - 4px)",
      borderRadius: "3px !important",
      border: "1px solid #D3D5D7 !important",
      margin: "4px 0",
      marginLeft: "0 !important",
      textTransform: "unset",
      backgroundColor: "#fff",
      transition: "200ms",
      "&:hover": {
        backgroundColor: "#E6F4FF",
        "& .MuiTypography-root": {
          color: theme.palette.primary.main,
        },
      },
      "&.Mui-selected": {
        backgroundColor: "#E6F4FF !important",
        "& .MuiTypography-root": {
          color: theme.palette.primary.main,
        },
      },
    },
    buttonOpenDatepicker: {
      textTransform: "unset",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "3px !important",
      border: "1px solid #D3D5D7 !important",
      height: 40,
      marginTop: 4,
      marginLeft: "0px !important",
      padding: "0 15px 0 12px",
      "& svg": {
        width: 18,
        height: 20,
      },
      "&:hover, &.active": {
        backgroundColor: "#E6F4FF",
        "& .MuiTypography-root": {
          color: theme.palette.primary.main,
        },
      },
      "&.Mui-selected": {
        backgroundColor: "#E6F4FF !important",
        "& .MuiTypography-root": {
          color: theme.palette.primary.main,
        },
      },
    },
  });

export default styles;
