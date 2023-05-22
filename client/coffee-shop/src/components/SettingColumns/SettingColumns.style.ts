import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiDialog-paper": {
        width: 700,
        maxWidth: "unset",
        margin: 0,
        top: "50px",
        minHeight: 300,
        position: "absolute",
      },
    },
    container: {
      marginBottom: 12,
      display: "flex",
      flex: "1 1 auto",
      flexDirection: "column",
      padding: 0,
      "&::-webkit-scrollbar": {
        width: 4,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#D3D5D7",
      },
    },
    lineItems: {
      padding: "8px 28px",
      "&:not(:last-child)": {
        borderBottom: "1px solid #E8EAEB",
      },
    },
    lineTitle: {
      lineHeight: "16px",
    },
    tooltip: {
      height: 32,
      display: "flex",
      alignItems: "center",
    },
    dragableTooltip: {
      padding: "6px 8px",
    },
    rootIconButton: {
      position: "absolute",
      top: 5,
      right: 5,
      color: "#A3A8AF",
    },
    iconClose: {
      fontSize: 24,
    },
    searchbox: {
      flex: 1,
      paddingTop: 12,
    },
  })
);

export default useStyles;
