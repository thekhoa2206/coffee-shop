import { createStyles, Theme } from "@material-ui/core";
import { BORDER } from "components/SapoGridSticky/SapoGridSticky.constants";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      top: 0,
      zIndex: 9,
      overflow: "hidden",
      "&>.row>.col": {
        borderTop: BORDER,
      },
      "& .row": {
        width: "fit-content",
        "& .col:last-child": {
          borderRight: BORDER,
        },
      },
    },
    sticky: {
      position: "sticky",
    },
    cell: {
      width: 92,
      padding: 6,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      backgroundColor: "#F4F6F8",
      borderLeft: BORDER,
      borderBottom: BORDER,
      "&>*": {
        width: "100%",
      },
    },
  });

export default styles;
