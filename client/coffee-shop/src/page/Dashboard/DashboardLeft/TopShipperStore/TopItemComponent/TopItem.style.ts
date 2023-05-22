import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "inline-flex",
      width: "90%",
      padding: "10px 16px",
      alignItems: "center",
      "@media (min-width: 1920px)": {
        padding: "10px 24px",
      },
      "& .MuiAvatar-root": {
        width: 30,
        height: 30,
        marginRight: 12,
        fontSize: 16,
        "&.color-1": {
          background: "#33A0FF",
        },
        "&.color-2": {
          background: "#3FDA9E",
        },
        "&.color-3": {
          background: "#FFCE6A",
        },
        "&.color-4": {
          background: "#FF9494",
        },
        "&.color-5": {
          background: "#66B8FF",
        },
      },
      "&:hover": {
        backgroundColor: "#F2F9FF",
      },
    },
    textNoData: {
      background: "#E8EAEB",
      borderRadius: "3px",
    },
    boxVariantName: {
      marginRight: "auto",
      display: "inline-flex",
      justifyContent: "space-between",
      flexFlow: "column",
      height: "100%",
      maxWidth: "calc(100% - 140px)",
    },
    boxVariantAmount: {
      marginLeft: "auto",
      paddingLeft: 10,
      alignSelf: "flex-start",
    },
  });

export default styles;
