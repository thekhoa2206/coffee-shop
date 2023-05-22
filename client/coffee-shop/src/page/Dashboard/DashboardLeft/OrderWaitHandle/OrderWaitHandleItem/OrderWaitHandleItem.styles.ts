import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      textAlign: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      "&:hover": {
        background: " #F2F9FF",
      },
      "&:last-child": {
        "& .link": {
          borderRight: "none",
        },
      },
      "& .link": {
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        margin: "15px 0px",
        borderRight: "1px dashed #E8EAEB",
        width: "100%",
        color: "unset",
        "&:hover": {
          textDecoration: "unset !important",
        },
      },
    },
    orderHandleIcon: {
      width: "44px",
      height: "44px",
      margin: "auto",
      marginBottom: "5px",
    },
    backgroundIconOrder: {
      background: "#F2F9FF",
    },
  });

export default styles;
