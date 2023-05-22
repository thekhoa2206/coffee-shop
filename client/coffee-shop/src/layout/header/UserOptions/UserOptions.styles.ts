import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    option: {
      padding: "11px 17px",
      cursor: "pointer",
      color: theme.palette.text.primary,
      "&:hover": {
        background: "#F2F9FF",
        textDecoration: "none",
        "& svg": {
          color: theme.palette.primary.main,
        },
        "& div": {
          background: "#D9EDFF",
        },
      },
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
    },
  });

export default styles;
