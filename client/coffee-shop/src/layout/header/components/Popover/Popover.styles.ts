import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    popper: {
      zIndex: 100000,
      '&[x-placement*="bottom"] $arrow': {
        top: 0,
        left: 0,
        marginTop: "-0.71em",
        marginLeft: 4,
        marginRight: 4,

        "&::before": {
          transformOrigin: "0 100%",
        },
      },
      '&[x-placement*="top"] $arrow': {
        bottom: 0,
        left: 0,
        marginBottom: "-0.71em",
        marginLeft: 4,
        marginRight: 4,
        "&::before": {
          transformOrigin: "100% 0",
        },
      },
      '&[x-placement*="right"] $arrow': {
        left: 0,
        marginLeft: "-0.71em",
        height: "1em",
        width: "0.71em",
        marginTop: 4,
        marginBottom: 4,
        "&::before": {
          transformOrigin: "100% 100%",
        },
      },
      '&[x-placement*="left"] $arrow': {
        right: 0,
        marginRight: "-0.71em",
        height: "1em",
        width: "0.71em",
        marginTop: 4,
        marginBottom: 4,
        "&::before": {
          transformOrigin: "0 0",
        },
      },
    },
    arrow: {
      overflow: "hidden",
      position: "absolute",
      width: "1em",
      height: "0.71em",
      boxSizing: "border-box",
      "&::before": {
        content: '""',
        margin: "auto",
        display: "block",
        width: "100%",
        height: "100%",
        border: "1px solid #D3D5D7",
        backgroundColor: theme.palette.background.paper,
        transform: "rotate(45deg)",
      },
    },
    popoverRoot: {
      backgroundColor: theme.palette.background.paper,
      maxWidth: 1000,
      minWidth: 230,
    },
    content: {},
    impLeft: {
      left: "auto !important",
    },
    mgLeft: {
      marginLeft: -30,
    },
  });

export default styles;
