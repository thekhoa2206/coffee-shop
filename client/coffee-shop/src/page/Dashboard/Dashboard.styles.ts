import { createStyles, Theme } from "@material-ui/core";
const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      width: "100%",
      background: "#f0f1f1",
    },
    infoLeft: {
      width: "calc(100% - ((100vw - 1030px - 32px*2 - 24px*3)/4) - 24px)",
      "&.info-left-collapse": {
        width: "calc(100% - ((100vw - 52px - 32px*2 - 24px*3)/4) - 24px)",
      },
    },
  });

export default styles;
