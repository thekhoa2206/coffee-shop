import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      borderBottom: "1px solid #E8EAEB",
      "& .MuiTab-root": {
        textTransform: "unset",
        paddingLeft: 16,
        paddingRight: 16,
        "@media (min-width: 600px)": {
          minWidth: "unset",
        },
      },
    },
    flexContainer: {
      height: "100%",
    },
  });

export default styles;
