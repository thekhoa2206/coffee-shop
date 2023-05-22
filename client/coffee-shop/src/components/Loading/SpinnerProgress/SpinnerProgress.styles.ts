import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      fontSize: 50,
      animation: "$spin 800ms linear infinite",
    },
    "@keyframes spin": {
      "100%": {
        transform: "rotate(360deg)",
      },
    },
  });

export default styles;
