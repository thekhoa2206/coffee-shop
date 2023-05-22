import { makeStyles, Theme } from "@material-ui/core";
import { colorInk } from "../../../theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& .iconCloseBtn": {
      top: 6,
    },
  },
  paper: {
    margin: 0,
    top: "50px",
    position: "absolute",
    maxWidth: 585,
    minWidth: 585,
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    minHeight: 52,
    marginTop: 6,
    boxSizing: "border-box",
    "&.dividerBottom": {
      borderBottom: "1px solid #D3D5D7",
    },
  },
  dialogContent: {
    // overflow: "hidden",
    fontSize: 14,
    padding: "0 24px",
    "&.MuiDialogContent-dividers.dividerTop": {
      borderBottom: 0,
    },
    "&::-webkit-scrollbar": {
      width: 13,
      backgroundColor: "#E8EAEB",
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: 4,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#cbccce",
      borderRadius: 4,
      "&:hover": {
        backgroundColor: "#A3A8AF",
      },
    },
  },
  dialogActions: {
    padding: 24,
  },
  rootIconBtnClose: {
    position: "absolute",
    top: 2,
    right: 5,
    color: colorInk.base40,
  },
  iconClose: {
    fontSize: 24,
  },
  rootIconBtnBack: {
    margin: "0 8px 0 -12px",
    height: 28,
    width: 28,
    color: colorInk.base40,
  },
  iconBack: {
    fontSize: 17,
    margin: "0 0 -1px 0",
  },
  title: {
    fontSize: "20px",
    fontWeight: 500,
    flexGrow: 1,
  },
  actionButton: {
    "&:not(:last-child)": {
      marginRight: 16,
    },
  },
}));

export default useStyles;
