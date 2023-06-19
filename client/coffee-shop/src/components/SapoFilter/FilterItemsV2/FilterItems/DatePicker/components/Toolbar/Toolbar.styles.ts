import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    box: {
      display: "flex",
      justifyContent: "space-between",
      minHeight: 48,
      alignItems: "center",
      borderTop: "1px solid #E8EAEB",
      borderBottom: "none",
      padding: "0 16px",
      "&.selectMonth": {
        borderTop: "none",
        borderBottom: "1px solid #E8EAEB",
      },
      "&.selectTime": {
        "&>*": {
          margin: "0",
        },
      },
    },
    boxCenter: {
      justifyContent: "center",
      "&>*": {
        margin: "0 8px",
      },
    },
    selectMonth: {
      "& .small > .MuiSelect-selectMenu": {
        fontSize: 16,
      },
      "& .MuiSelect-iconOutlined": {
        right: 13,
        top: "calc(50% - 11px)",
      },
    },
    textField: {
      height: 30,
      width: 120,
      "& .MuiInputBase-root": {
        height: "100%",
      },
    },
    periodPickerMonth: {
      position: "absolute",
      marginLeft: "55px",
      border: "none",
    },
    textBox: {
      "& .MuiFormControl-root": {
        padding: 0,
      },
    },
    lineBox: {
      display: "flex",
      alignItems: "center",
    },
    lineIcon: {
      fontSize: 12,
    },
    clockIcon: {
      fontSize: 19,
    },
    wrapperPopperContent: {
      padding: 20,
    },
    wrapperSelectTimes: {
      display: "flex",
      justifyContent: "space-between",
      width: "80%",
      alignItems: "center",
    },
    selectTime: {
      width: 80,
    },
    periodPicker: {
      position: "absolute",
      marginLeft: "30px",
      border: "none",
    },
    selectPeriod: {
      width: 80,
      "& .MuiMenu-paper": {
        marginLeft: "35px",
      },
    },
  });

export default styles;
