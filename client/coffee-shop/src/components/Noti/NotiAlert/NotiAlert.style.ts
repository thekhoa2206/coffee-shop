import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      height: 64,
      alignItems: "center",
      backgroundColor: "#F5E0E0",
      borderRadius: 3,
      borderTop: "4px solid #FF0000",
      boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    },
    label: {
      display: "flex",
      alignItems: "center",
      marginLeft: 16,
    },
    icon: {
      fill: "#FF0000",
      height: "24px",
      width: "24px",
      marginRight: "13px",
    },
  });

export default styles;
