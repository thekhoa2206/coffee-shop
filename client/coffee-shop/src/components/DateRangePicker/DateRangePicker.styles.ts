import { createStyles, Theme } from "@material-ui/core";
import { stylesPicker } from "./../DatePicker/DatePicker.styles";

const stylePickerOrrveride = {
  "& .MuiPickersSlideTransition-transitionContainer": {
    "&>.MuiTypography-root, &>div": {
      transition: "unset",
    },
  },
  "& .MuiPickersCalendarHeader-switchHeader": {
    margin: 0,
    height: 48,
    borderBottom: "none",
    "& .MuiTypography-root": {
      fontWeight: 500,
      fontSize: 16,
      textTransform: "capitalize",
    },
  },
};

const styles = (theme: Theme) =>
  createStyles({
    popoverPaper: {
      marginTop: 5,
    },
    box: {
      display: "flex",
    },
    menuList: {
      minWidth: 240,
      "&:focus": {
        outline: "none",
      },
    },
    dateWrapper: {
      display: "flex",
      borderLeft: "1px solid #E8EAEB",
    },
    hidden: {
      display: "none",
    },
    dateLeft: {
      ...stylesPicker,
      ...stylePickerOrrveride,
    },
    dateRight: {
      ...stylesPicker,
      ...stylePickerOrrveride,
    },
  });

export default styles;
