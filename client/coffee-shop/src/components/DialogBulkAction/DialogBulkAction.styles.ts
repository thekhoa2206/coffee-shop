import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    boxDetail: {
      marginTop: "12px",
      marginBottom: "3px",
      maxHeight: 200,
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
    },
    boxDetailItem: {
      padding: "10px 16px",
      "&:hover": {
        background: "#F2F9FF",
      },
    },
    btnShowDetai: {
      color: theme.palette.primary.main,
      padding: 0,
      height: "20px",
      marginTop: "-4px",
      marginLeft: "8px",
      "& .MuiButton-endIcon": {
        marginLeft: "4px",
      },
    },
    link: {
      textDecoration: "none",
      color: theme.palette.primary.main,
      paddingLeft: 0,
      "&:hover": {
        textDecoration: "underline",
      },
    },
  })
);

export default useStyles;
