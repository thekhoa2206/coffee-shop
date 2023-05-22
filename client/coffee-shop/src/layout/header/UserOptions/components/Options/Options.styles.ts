import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
    },
    svg: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "#F4F6F8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#A2A8AF",
    },
    title: {
      marginLeft: 8,
    },
  });

export default styles;
