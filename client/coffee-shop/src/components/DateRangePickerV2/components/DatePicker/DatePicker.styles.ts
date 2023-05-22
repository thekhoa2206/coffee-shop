import { createStyles, Theme } from "@material-ui/core";

export const stylesPicker = {
  "& .MuiPickersBasePicker-pickerView": {
    minWidth: 308,
    minHeight: "unset",
  },
  "& .MuiPickersCalendarHeader-switchHeader": {
    margin: 0,
    height: 48,
    borderBottom: "1px solid #E8EAEB",
    "& .MuiTypography-root": {
      fontWeight: 500,
      fontSize: 16,
      textTransform: "capitalize",
    },
  },
  "& .MuiPickersCalendarHeader-daysHeader": {
    maxHeight: "unset",
  },
  "& .MuiPickersCalendar-transitionContainer": {
    marginTop: 0,
    marginBottom: 6,
  },
  "& .MuiIconButton-root.Mui-disabled": {
    opacity: 0,
    visibility: "hidden",
  },
  "& .MuiPickersCalendarHeader-dayLabel": {
    color: "#182537",
    width: 42,
    height: 36,
    margin: 0,
    fontSize: 15,
    fontWeight: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      "&.selectMonth": {
        "& .MuiPickersCalendarHeader-switchHeader": {
          display: "none",
        },
      },
      "&.selectTime": {
        "& .MuiPickersBasePicker-container": {
          display: "flex",
          flexDirection: "column-reverse",
        },
        ".MuiPickersBasePicker-containerLandscape": {
          flexDirection: "column-reverse",
        },
      },
    },
    icon: {
      color: theme.palette.primary.main,
      width: 24,
      height: 24,
      padding: 0,
      margin: "9px 14px",
      "&:hover, &:active, &:focus-visible": {
        backgroundColor: "#F2F9FF",
      },
    },
    hidden: {
      opacity: 0,
      visibility: "hidden",
    },
    paper: {
      ...stylesPicker,
    },
  });

export default styles;
