import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      backgroundColor: "#F4F6F8",
    },
    headerName: {
      display: "flex",
      alignItems: "center",
      height: "21px",
      "&.center": {
        justifyContent: "center",
      },
      "&.right": {
        justifyContent: "flex-end",
      },
      "& .UnfoldMoreIcon": {
        opacity: 1,
        color: theme.palette.text.primary,
      },
      "&:hover": {
        "& .UnfoldMoreIcon": {
          color: theme.palette.text.secondary,
        },
      },
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
    checkbox: {},
    cell: {
      fontSize: "inherit",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      borderTop: "1px solid #E8EAEB",
      lineHeight: 1.5715,
      color: "inherit",
      paddingTop: 0,
      paddingBottom: 0,
      height: "52px",
    },
    cellV2: {
      fontSize: "inherit",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      borderTop: "1px solid #E8EAEB",
      lineHeight: 1.5715,
      color: "inherit",
      paddingTop: 0,
      paddingBottom: 0,
      height: "44px",
      flexDirection: "unset",
    },
    ".MuiTableCell-head:nth-of-type(1)": {
      paddingLeft: "20px",
    },
    cellCheckbox: {
      borderTop: "1px solid rgba(224, 224, 224, 1)",
      padding: "0 0 0 16px",
    },
    bulkActions: {
      display: "flex",
      marginLeft: 16,
    },
    headerWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
  })
);

export default useStyles;
