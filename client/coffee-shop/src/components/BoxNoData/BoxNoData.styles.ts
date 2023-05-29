import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: "auto",
      textAlign: "center",
      height: "100%",
      display: "flex",
      alignItems: "center",
      "& .content": {
        margin: "auto",
      },
    },
  });
export default styles;
