import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: "52px",
      width: "100%",
      background: "#fff",
      display: "inline-flex",
      position: "sticky",
      top: "0",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1001,
      boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
    },
    shadowHeader: {
      boxShadow: "0px 4px 8px rgba(168, 168, 168, 0.25)",
    },
    link: {
      display: "inline-flex",
      alignItems: "center",
      cursor: "pointer",
    },
    contentHeader: {
      width: "100%",
      height: "100%",
      padding: "8px 32px",
      alignItems: "center",
      display: "inline-flex",
      justifyContent: "space-between",
    },
  });

export default styles;
