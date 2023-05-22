import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { colorInk } from "../../../../theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  rootMenuItem: {
    height: 48,
    padding: 0,
    margin: 4,
    color: colorInk.base20,
    width: "auto",
    minWidth: 44,
    borderRadius: 3,
    "&.active": {
      background: theme.palette.primary.main,
      color: "#fff",
      fill: "#fff",
    },
    "& >.MuiListItemIcon-root": {
      color: colorInk.base40,
      width: 44,
      minWidth: "unset",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&>svg": {
        fontSize: 24,
        maxHeight: 30,
      },
    },
    "&.active >.MuiListItemIcon-root": {
      fill: "#fff",
      color: "#fff",
    },
    "&:not(.active)": {
      "&.MuiListItem-button:hover": {
        textDecoration: "none",
        fill: "#fff",
        color: "#fff",
        background: "#243041",
        "& >.MuiListItemIcon-root, .MuiListItemText-root": {
          color: colorInk.base20,
        },
      },
    },
    // "&.active.MuiListItem-button:hover": {
    //   background: "#243041",
    // },
    "& >.MuiListItemText-root": {
      marginTop: -2,
      fontWeight: 400,
      width: 155,
      marginBottom: "unset",
      flex: "unset",
      "& .MuiTypography-root": {
        whiteSpace: "nowrap",
        overflow: "hidden",
      },
    },
    "& >.icon-collapse": {
      fontSize: 24,
      marginRight: 4,
      transition: "transform .2s linear",
    },
    "&.open >.icon-collapse": {
      transform: "rotate(90deg)",
      color: "#fff",
    },
  },
  wrapperInnerMenuListSubItem: {
    "& .active": {
      background: "none",
      "&.MuiListItem-button:hover, & .MuiListItemText-root": {
        background: "none",
        color: `${theme.palette.primary.main} !important`,
      },
    },
    "&:not(.active)": {
      "& .MuiListItem-button:hover": {
        background: "#243041",
      },
    },
    "& .menuListSubMenuItemLevel-0": {
      margin: 0,
      padding: 0,
      "& > .rootMenuItem": {
        paddingLeft: 44,
        height: 40,
      },
      "& div.MuiButtonBase-root": {
        height: 40,
        "&.open:not(.active) > .menuItemTitle": {
          color: colorInk.base20,
        },
      },
      "& .MuiListItemText-root": {
        margin: 0,
        color: colorInk.base20,
      },
    },
    "& .menuListSubMenuItemLevel-1": {
      "& > .rootMenuItem": {
        paddingLeft: 44,
        height: 36,
      },
      "& .menuItemTitle ": {
        "& .MuiTypography-root": {
          display: "flex",
          alignItems: "center",
          "&::before": {
            content: "'\\2022'",
            fontSize: "20px",
            lineHeight: 0.2,
            marginRight: 12,
            marginTop: -2,
            marginLeft: -1,
          },
        },
      },
    },
  },
  wrapperMenuListSubItemOnCollapse: {
    minWidth: 196,
    minHeight: 48,
    background: "#182537",
    position: "fixed",
    marginLeft: 48,
    // marginTop: "-27px",
    "& .subMenusHoverHeader": {
      height: 48,
      background: "#243041",
      paddingLeft: 16,
      color: colorInk.base20,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      "& .MuiTypography-root": {
        lineHeight: "48px",
      },
      "& .MuiButtonBase-root": {
        color: colorInk.base40,
        padding: "12px 4px",
        "& svg": {
          fontSize: 24,
        },
      },
    },
    "& .subMenusHoverBody": {
      background: "#182537",
      padding: "12px 0",
      "& > .MuiListItem-root": {
        textDecoration: "none",
        padding: "0 16px",
        borderRadius: 3,
        height: 40,
        margin: "4px 8px",
        color: colorInk.base20,
        width: "auto",
        "&:hover:not(.active)": {
          background: "#243041",
        },
      },
      "& .active": {
        color: theme.palette.primary.main,
      },
    },
  },
}));
export default useStyles;
