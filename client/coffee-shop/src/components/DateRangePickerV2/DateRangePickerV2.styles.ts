import { createStyles, Theme } from "@material-ui/core";
import { stylesPicker } from "components/DatePicker/DatePicker.styles";

const stylePickerOrrveride = {
  "& .MuiPickersSlideTransition-transitionContainer": {
    "&>.MuiTypography-root, &>div": {
      transition: "unset",
    },
  },
  "& .MuiPickersCalendarHeader-switchHeader": {
    display: 'none'
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
