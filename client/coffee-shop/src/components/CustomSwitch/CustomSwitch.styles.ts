import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "fit-content",
    },
    packageBtn: {
      width: "144px",
      border: "1px solid #DDEDFB",
      borderRadius: "7px",
      fontWeight: 700,
    },
    active: {
      background: "linear-gradient(65.71deg, #0088FF 28.29%, #33A0FF 97.55%)",
      zIndex: 2,
      color: "#FFFFFF",
    },
    inActive: {
      background: "#FFFFFF",
      zIndex: 1,
      color: "#182537",
    },
  });

export default styles;
