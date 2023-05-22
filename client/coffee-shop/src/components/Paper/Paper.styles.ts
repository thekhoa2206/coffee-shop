import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "&.borderBottom": {
        borderBottom: "1px solid #E8EAEB",
      },
    },
  });

export default styles;
