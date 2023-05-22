import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    picker: {
      "& .MuiPickersToolbar-toolbarLandscape": {
        minWidth: 82,
        width: 82,
      },
      "& .MuiPickersTimePickerToolbar-hourMinuteLabel": {
        alignItems: "center",
        "& .MuiPickersTimePickerToolbar-separator": {
          margin: "0 3px 5px 3px",
        },
      },
    },
  });

export default styles;
