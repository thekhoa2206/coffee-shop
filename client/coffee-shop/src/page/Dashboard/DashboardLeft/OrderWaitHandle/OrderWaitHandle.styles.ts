import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background: "#fff",
      width: "100%",
      marginRight: "auto",
      marginBottom: "24px",
      boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
    },
    orderWaitHandleList: {
      display: "flex",
      padding: "0px",
    },
    boxLoading: {
      height: "116px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    iconLoading: {
      width: "38px",
      height: "38px",
    },
    selectDateRange: {
      "& .MuiInputBase-root": {
        height: 36,
      },
    },
  });

export default styles;
