import { createStyles, Theme } from "@material-ui/core";

export const stylesPicker = {
  "& .MuiPickersBasePicker-pickerView": {
    minWidth: 308,
    minHeight: "unset",
    margin: "auto",
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
    // marginTop: 5,
  },
  "& .MuiPickersCalendar-transitionContainer": {
    marginTop: 0,
    marginBottom: 1,
    minHeight: 242,
    "& .MuiPickersCalendar-week": {
      height: 40,
    },
  },
  "& .MuiIconButton-root.Mui-disabled": {
    opacity: 0,
    visibility: "hidden",
  },
  "& .MuiPickersCalendarHeader-dayLabel": {
    color: "#182537",
    width: 42,
    height: 40,
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
      zIndex: 999,
      "&.selectMonth": {
        "& .MuiPickersCalendarHeader-switchHeader": {
          display: "none",
        },
      },
      "& .MuiPickersBasePicker-containerLandscape": {
        flexDirection: "column",
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
    popper: {
      zIndex: 999,
      "&.selectMonth": {
        "& .MuiPickersCalendarHeader-switchHeader": {
          display: "none",
        },
      },
      "& .MuiPickersBasePicker-containerLandscape": {
        flexDirection: "column",
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
      "&.periodPicker": {
        "& .MuiPickersCalendarHeader-switchHeader": {
          "& .MuiPickersCalendarHeader-transitionContainer": {
            display: "none",
          },
        },
      },
      ...stylesPicker,
    },
    paper: {
      ...stylesPicker,
    },
  });

export default styles;
