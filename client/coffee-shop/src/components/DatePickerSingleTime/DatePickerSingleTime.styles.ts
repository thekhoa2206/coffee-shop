import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";
import { stylesPicker } from "components/DatePicker/DatePicker.styles";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  textField: {},
  wrapperDateTimePicker: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 335,
    ...stylesPicker,
  },
  wrapperSelectTimes: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectTimes: {
    display: "flex",
    flexDirection: "column",
    maxHeight: 222,
    padding: "0 10px",
    overflowY: "auto",
    // scrollBehavior: "smooth",
    "&::-webkit-scrollbar": {
      width: 6,
      height: 6,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#bcbcbc",
      borderRadius: 6,
      "&:hover": {
        backgroundColor: "#A3A8AF",
      },
    },
  },
  timeButtonItem: {
    margin: "2px 0",
    border: "1px solid #A3A8AF",
    "&:hover": {
      backgroundColor: "unset",
    },
  },
  buttonScrollTimes: {
    padding: 5,
    background: "#F2F9FF",
    borderRadius: "50%",
    width: 24,
    height: 24,
    "& svg": {
      color: theme.palette.primary.main,
    },
  },
  activeTime: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: "#ffffff",
    border: 0,
  },
}));

export default useStyles;
