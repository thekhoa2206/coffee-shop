import { createStyles } from "@material-ui/core";

const styles = () =>
  createStyles({
    classRootModal: {
      "& .MuiDialog-paperWidthSm": {
        width: 328,
        height: 243,
        overflow: "unset",
        padding: 0,
        textAlign: "center",
        fontSize: 14,
        position: "absolute",
        top: 50,
      },
      "&:hover": {
        backgroundColor: "none",
      },
    },
    titleBox: {
      display: "flex",
      justifyContent: "flex-end",
      padding: 0,
    },
    closeBtn: {
      color: "#A3A8AF",
      marginRight: 5,
      marginTop: 3,
      position: "absolute",
      top: 3,
      right: 3,
    },
    contentContainer: {
      padding: "24px 24px 0 24px",
    },
    image: {
      width: 122,
      height: "auto",
      margin: "0 auto",
    },
    confirmBtn: {
      fontWeight: 400,
      margin: '0 auto',
      width: 94,
    },
  });
export default styles;
