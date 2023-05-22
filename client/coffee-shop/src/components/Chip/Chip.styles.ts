import { createStyles, Theme } from "@material-ui/core";
import { colorInk } from "theme/palette";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      "&.MuiChip-sizeSmall": {
        fontSize: 13,
        padding: "4px 8px",
      },
      "&.info": {
        color: "#5364FE",
        backgroundColor: "#F2F9FF",
        border: "1px solid #5364FE",
      },
      "&.success": {
        color: "#0DB473",
        backgroundColor: "#F3FCF9",
        border: "1px solid #9FEDCF",
      },
      "&.warning": {
        color: "#E49C06",
        backgroundColor: "#FFF7E7",
        border: "1px solid #E49C06",
      },
      "&.danger": {
        color: "#EE4747",
        backgroundColor: "#FDF3F5",
        border: "1px solid #EE4747",
      },
      "&.draft": {
        color: "#5364FE",
        backgroundColor: "#EEF2FD",
        border: "1px solid #5364FE",
      },
      "&.primary": {
        color: theme.palette.primary.main,
        backgroundColor: "#E6F4FF",
        border: "1px solid " + theme.palette.primary.main,
      },
      "&.none": {
        backgroundColor: colorInk.base20,
      },
      "&.default": {
        color: "#2B4263",
        backgroundColor: "#E6F4FF",
        border: "1px solid #2B4263",
      },
      "&.inactive": {
        color: "",
        backgroundColor: "#DDDFE1",
        border: "1px solid ",
      },
      "&.disable": {
        color: "",
        backgroundColor: "#F3F4F5",
        border: "1px solid ",
      },
      padding: "4px 16px",
    },
  });

export default styles;
