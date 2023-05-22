import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      background: "#fff",
      marginBottom: "24px",
      boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
    },
    resultList: {
      padding: "0",
    },
    resultItem: {
      display: "flex",
      padding: "0 0 0 36px",
      height: "92px",
      alignItems: "center",
      "&:hover": {
        background: " #F2F9FF",
      },
      "& >a": {
        width: "100%",
        display: "flex",
        height: "70px",
        borderRight: "1px dashed #E8EAEB",
        alignItems: "center",
        "& .content": {
          display: "flex",
          flexWrap: "wrap",
          flexFlow: "column",
          justifyContent: "center",
          marginLeft: "8px",
          "& .MuiTypography-root": {
            lineHeight: "100%",
            "&:first-child": {
              marginBottom: 4,
            },
          },
        },
      },
      "&:last-child": {
        "& >a": {
          borderRight: "none",
        },
      },
    },
    resultItemIcon: {
      display: "flex",
      alignItems: "center",
      borderRadius: "50%",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      color: "#fff",
    },
    colorAmount: {
      color: theme.palette.primary.main,
    },
    colorOrder: {
      color: "#0FD186",
    },
    colorOrderReturn: {
      color: "#FFAE06",
    },
    colorOrderCancel: {
      color: "#FF4D4D",
    },
    backgroundColorAmount: {
      background: "linear-gradient(65.71deg, #0088FF 28.29%, #33A0FF 97.55%)",
    },
    backgroundColorOrder: {
      background: "linear-gradient(62.06deg, #0FD186 25.88%, #3FDA9E 100%)",
    },
    backgroundColorOrderReturn: {
      background: "linear-gradient(66.01deg, #FFAE06 37.34%, #FFBE38 101.09%)",
    },
    backgroundColorOrderCancel: {
      background: "linear-gradient(64.1deg, #FF4D4D 22.64%, #FF5F7C 102.8%)",
    },
  });

export default styles;
