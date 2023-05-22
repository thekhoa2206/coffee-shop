import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "fit-content",
      "& .box-title": {
        display: "flex",
        alignItems: "center",
        height: "64px",
        borderBottom: "1px solid #E8EAEB",
        padding: "0 16px",
        "@media (min-width: 1920px)": {
          padding: "0 24px",
        },
        "&>.MuiTypography-root": {
          textTransform: "uppercase",
        },
        "& .header-group-button": {
          display: "flex",
          marginLeft: "auto",
        },
      },
    },
  });

export default styles;
