import { makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  groupPredefined: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  toggleButton: {
    height: 40,
    width: "calc(50% - 2px)",
    borderRadius: "3px !important",
    border: "1px solid #D3D5D7 !important",
    margin: "2px 0",
    marginLeft: "0 !important",
    textTransform: "unset",
    backgroundColor: "#fff",
    transition: "200ms",
    "&:hover": {
      backgroundColor: "#E6F4FF",
      "& .MuiTypography-root": {
        color: theme.palette.primary.main,
      },
    },
    "&.Mui-selected": {
      backgroundColor: "#E6F4FF !important",
      "& .MuiTypography-root": {
        color: theme.palette.primary.main,
      },
    },
  },
  wrapperDatePicker: {
    "& .wrapper-input-datepicker": {
      display: "flex",
      height: 47,
      padding: "0 16px",
      justifyContent: "center",
      alignItems: "center",
      borderBottom: "1px solid #E8EAEB",
      "& .line-space": {
        height: 1,
        backgroundColor: "#D3D5D7",
        width: 12,
        margin: 10,
      },
      "& input": {
        textAlign: "center",
      },
    },
  },
  buttonOpenDatepicker: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 3,
    border: "1px solid #D3D5D7",
    height: 40,
    marginTop: 2,
    padding: "0 15px 0 12px",
    "& svg": {
      width: 18,
      height: 20,
    },
    "&:hover, &.active": {
      backgroundColor: "#E6F4FF",
      "& .MuiTypography-root": {
        color: theme.palette.primary.main,
      },
    },
  },
  wrapperDatePickerInline: {
    "& .MuiPickersBasePicker-pickerView": {
      margin: "auto",
    },
  },
}));

export default useStyles;
