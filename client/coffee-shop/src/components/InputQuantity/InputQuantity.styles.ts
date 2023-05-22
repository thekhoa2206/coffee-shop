import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "flex-end",
    "&:hover": {
      "& .icon-btn": {
        display: "inline-block",
      },
    },
  },
  textField: {
    "& .MuiInputBase-root.MuiInput-root": {
      width: "56px",
      "& input": {
        // paddingBottom: 4,
      },
    },
  },
  iconButton: {
    padding: 0,
    // borderRadius: "50%",
    width: "24px",
    height: "24px",
    marginBottom: 2,
    cursor: "pointer",
    "&.auto-hidden": {
      display: "none",
    },
    // "&:hover": {
    //   backgroundColor: "#d3dff0b3",
    // },
    // backgroundColor: "#D3DFF0",
    "& svg": {
      // width: "17px",
      // height: "17px",
      color: "#A3A8AF",
    },
  },
}));

export default useStyles;
