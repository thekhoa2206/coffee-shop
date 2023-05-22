import { createStyles } from "@material-ui/core";

const styles = () =>
  createStyles({
    classRootModal: {
      "& .MuiDialog-paperWidthSm": {
        width: 560,
        overflow: "unset",
        padding: 0,
        fontSize: 14,
        position: "absolute",
        top: 50,
      },
      "&:hover": {
        backgroundColor: "none",
      },
    },
    titleBox: {
      display: "block",
      position: "relative",
      textAlign: "left",
    },
    closeBtn: {
      color: "#A3A8AF",
      position: "absolute",
      top: 5,
      right: 5,
    },
    title: {
      marginTop: 5,
      marginBottom: 4,
    },
    contentContainer: {
      padding: "0 20px",
      textAlign: "left",
      paddingRight: 0,
    },
    actionsContainer: {
      padding: 24,
    },
  });
export default styles;
