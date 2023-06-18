import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: "3.75px 4px",
    margin: "0px 0",
  },
  header: {
    height: 32,
    padding: "0 15px 0 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 3,
    cursor: "pointer",
    transition: "200ms",
    "& .bullet": {
      marginRight: 10,
      fontSize: 16,
    },
    "& .arrow-icon": {
      color: "#A3A8AF",
    },
    "&:hover, &.open, &.active": {
      background: " #E6F4FF",
    },
    "&.open": {
      "& .arrow-icon": {
        // color: "#0088FF",
        transform: "rotate(180deg)",
      },
    },
  },
  content: {
    padding: "8px 0",
  },
  dragableTooltip: {
    padding: "6px 8px",
  },
}));

export default useStyles;
