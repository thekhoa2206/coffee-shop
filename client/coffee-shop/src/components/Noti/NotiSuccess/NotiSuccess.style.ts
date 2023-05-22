import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      height: 64,
      alignItems: "center",
      backgroundColor: "#F3FCF9",
      borderRadius: 3,
      borderTop: "4px solid #0FD186",
      boxShadow: "0px 2px 4px rgb(168 168 168 / 25%)",
    },
    label: {
      display: "flex",
      alignItems: "center",
      marginLeft: 16,
    },
    noti: {
      color: "#0FD186",
      marginRight: 8,
      fontSize: "25px",
    },
  });

export default styles;
