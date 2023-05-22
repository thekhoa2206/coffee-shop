import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiDialog-paper": {
        width: 700,
        maxWidth: "unset",
        margin: 0,
        top: "50px",
        minHeight: 300,
        position: "absolute",
        maxHeight: "calc(100% - 100px)",
        overflow: "hidden",
      },
      "& .MuiDialogTitle-root": {
        borderBottom: "1px solid #D3D5D7",
      },
      "& .MuiFormGroup-root": {
        flexDirection: "row",
      },
    },
    container: {
      overflow: "hidden",
      display: "flex",
      justifyContent: "space-between",
      "&::-webkit-scrollbar": {
        width: 4,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#D3D5D7",
      },
    },
    contentItemBox: {
      border: "1px solid #D3D5D7",
      borderRadius: 3,
      width: "calc(50% - 12px)",
      height: "100%",
    },
    titleBoxItem: {
      padding: "16px",
      fontSize: "16px",
      lineHeight: "20px",
      fontWeight: 500,
      color: "#000000",
    },
    itemContentBox: {
      borderTop: "1px solid #F3F4F5",
      "&::-webkit-scrollbar": {
        width: 6,
        height: 6,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#bcbcbc",
        borderRadius: 6,
        "&:hover": {
          backgroundColor: "#A3A8AF",
        },
      },
      maxHeight: "calc(100vh - 360px)",
    },
    lineItems: {
      padding: "8px 28px",
      "&:not(:last-child)": {
        borderBottom: "1px solid #E8EAEB",
      },
    },
    lineTitle: {
      lineHeight: "16px",
    },
    tooltip: {
      height: 32,
      display: "flex",
      alignItems: "center",
    },
    dragableTooltip: {
      padding: "6px 8px",
    },
    rootIconButton: {
      position: "absolute",
      top: 5,
      right: 5,
      color: "#A3A8AF",
    },
    iconClose: {
      fontSize: 24,
    },
    columnGroupTitle: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: 500,
    },
    boxMenuList: {
      overflow: "auto",
      "&::-webkit-scrollbar": {
        width: 6,
        height: 6,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#bcbcbc",
        borderRadius: 6,
        "&:hover": {
          backgroundColor: "#A3A8AF",
        },
      },
      maxHeight: "calc(100vh - 412px)",
    },
    menuList: {
      minWidth: 220,
      "&:focus": {
        outline: "none",
      },
      padding: 0,
    },
    columnSelectedBox: {
      padding: "8px 16px",
      display: "flex",
      justifyContent: "space-between",
      "&:not(:last-child)": {
        borderBottom: "1px solid #F3F4F5",
      },
    },
    iconButton: {
      padding: 0,
      // borderRadius: "50%",
      width: "24px",
      height: "24px",
      marginBottom: 2,
      cursor: "pointer",
      "&.auto-hidden": {
        display: "none",
      },
      // "&:hover": {
      //   backgroundColor: "#d3dff0b3",
      // },
      // backgroundColor: "#D3DFF0",
      "& svg": {
        // width: "17px",
        // height: "17px",
        color: "#A3A8AF",
      },
    },
    disableMenuItem: {
      "&.MuiListItem-root.Mui-disabled": {
        opacity: 1,
      },
    },
    selectItem: {
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#bcbcbc",
        "&:hover": {
          backgroundColor: "#A3A8AF",
        },
      },
    },
    radioGroup: {
      flexDirection: "row",
      justifyContent: "flex-start",
      "& label.MuiFormControlLabel-root": {
        marginLeft: 10,
        marginRight: 10,
      },
    },
    toolTip: {
      maxWidth: "275px",
      padding: 12,
    },
    searchbox: {
      flex: 1,
      padding: "8px 16px",
    },
  })
);

export default useStyles;
