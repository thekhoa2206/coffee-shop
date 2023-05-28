import { createStyles, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { colorInk } from "../../theme/palette";
const drawerWidth = 230;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuDivider: {
      margin: 0,
      border: 0,
      borderBottom: "1px solid #46515F",
      borderTop: "1px solid #46515F",
    },
    drawerMenu: {
      "& .menuDivider": {
        margin: 0,
        border: 0,
        borderBottom: "1px solid #46515F",
        borderTop: "1px solid #46515F",
      },
    },
    root: {
      width: "230px",
      display: "block",
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      background: "#ffffff",
      transition: "width 200ms",
      zIndex: 1002,

      "&>nav": {
        position: "absolute",
        width: "100%",
        top: 0,
        bottom: 0,
        left: 0,
        //Màu nên của menu
        backgroundColor: "#182537",
        "& .menuTopHeader": {
          height: 55,
          // borderBottom: "1px solid #15202c",
        },
        "& .menuTopLogo": {
          height: 55,
          "& img.logo--full": {
            padding: "12px 12px 0",
          },
        },
        "& .menuTopToogle": {
          display: "block",
          position: "absolute",
          top: 8,
          padding: 8,
          right: 4,
          "& svg": {
            fontSize: 24,
            color: "#fff",
          },
        },
        "& .menuDivider": {
          margin: 0,
          border: 0,
          borderBottom: "1px solid #263d53",
          borderTop: "1px solid #15202c",
        },
        "& .menuInnerWrapper": {
          height: "calc(100% - 60px)",
          position: "relative",
        },
        "& .menuPrimaryInner": {
          // height: "calc(100% - 44px)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehavior: "contain",
          "&::-webkit-scrollbar": {
            width: "5px",
            background: "#202d3f",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "6px",
            backgroundColor: "#2B4263",
          },
        },
        "& .menuList": {
          color: colorInk.base20,
          fill: colorInk.base20,
          padding: 0,
        },
      },
      "&.menuCollapse": {
        width: 52,
        "&>nav": {
          "& .menuTopLogo": {
            "& img.logo--full": {
              display: "none",
            },
          },
          "& .menuTopToogle": {
            right: 8,
          },
          "& .menuList": {
            "& >.MuiListItem-root": {
              "& >.MuiListItemText-root": {
                display: "none",
              },
              "& >.icon-collapse": {
                display: "none",
              },
            },
          },
        },
      },
    },
    btnAddChannel: {
      padding: "0 10px",
      width: "auto",
      margin: 4,
      cursor: "pointer",
      textTransform: "uppercase",
      minHeight: 48,
      "& svg": {
        color: colorInk.base40,
        fontSize: 24,
      },
      "& .title": {
        whiteSpace: "nowrap",
        overflow: "hidden",
      },
      "& .hidden": {
        display: "none",
      },
    },
    drawer: {
      display: 'flex',
      flexDirection: 'column',
      width: 0,
      backgroundColor: '#243954',
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      backgroundColor: "white",
      height: 52,
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#243954',
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    notSelectedButton: {
      '& p': {
        color: '#FFFFFF'
      },
      '& svg': {
        fill: '#FFFFFF'
      }
    },
    titleAccountDetail: {
      display: "flex",
      height: '100%',
      justifyContent: 'space-between',
    },
    titleLabel: {
      color: '#182537',
      fontWeight: 600,
      fontSize: 16,
      display: 'none',
      lineHeight: '20px',
      [theme.breakpoints.up('sm')]: {
        display: "block",
      },
    },
    userNameLabel: {
      display: 'none',
      alignItems: 'center',
      [theme.breakpoints.up('sm')]: {
        display: "flex",
      },
    },
    nameLabel: {
      fontSize: 14,
      lineHeight: '24px',
      fontWeight: 500,
      color: '#182537',
      paddingLeft: '5px'
    },
    helper: {
      display: "flex",
      alignItems: "center",
      padding: "16px 13px",
      cursor: "pointer",
      height: "100%",
      "& svg": {
        color: "#A2A8AF",
      },
      "&:hover": {
        "& svg": {
          color: theme.palette.primary.main,
        },
        "& p": {
          color: theme.palette.primary.main,
        },
      },
    },
    helperIcon: {
      color: theme.palette.secondary.main,
      marginRight: 9,
    },
    avatar: {
      width: 30,
      height: 30,
    },
    userName: {
      fontWeight: 500,
      margin: "0 10px",
    },
    info: {},
  })
);

export default useStyles;
