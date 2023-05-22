import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: "35px 0 25px",
      textAlign: "center",
      height: "calc(100% - 64px)",
      display: "flex",
      alignItems: "center",
      "& .content": {
        margin: "auto",
      },
      "& img": {
        width: "40%",
        height: "auto",
        minWidth: "200px",
        maxWidth: "100%",
      },
    },
  });
export default styles;
