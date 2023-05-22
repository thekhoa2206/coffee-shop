import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      height: 64,
      alignItems: "center",
      backgroundColor: "rgba(255, 234, 138, 0.2)",
      borderRadius: 3,
      borderTop: "4px solid #FFEA8A",
      boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    },
    label: {
      display: "flex",
      alignItems: "center",
      marginLeft: 16,
    },
    icon: {
      fill: "#FFEA8A",
      height: "32px",
      width: "32px",
      marginRight: "13px",
    },
  });

export default styles;
