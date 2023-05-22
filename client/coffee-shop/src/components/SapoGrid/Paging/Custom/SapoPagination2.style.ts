import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 28,
      marginTop: 12,
      marginBottom: 12,
      flex: "0 0 auto",
      padding: "0 16px",
      position: "sticky",
      left: 0,
    },
    paginate: {
      "& .paging-btn": {
        boxSizing: "border-box",
        padding: 0,
        border: "1px solid #0088FF",
        borderRadius: 1,
        color: theme.palette.primary.main,
        width: 20,
        height: 20,
        "&.Mui-disabled": {
          borderColor: colorInk.base30,
          color: colorInk.base30,
        },
        "& svg": {
          width: 13,
          height: 9,
        },
        "&:first-child": {
          marginRight: 12,
        },
      },
    },
  })
);

export default useStyles;
