import { makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    backgroundColor: "blue",
    color: "blue",
  },
  dialog: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    margin: 0,
    maxHeight: "unset",
    width: "420px",
    borderRadius: 0,
    overflowY: "hidden",
    transition: "200ms",
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    minHeight: 52,
    boxSizing: "border-box",
    "& .title": {
      fontSize: "20px",
      fontWeight: 500,
    },
  },
  iconButtonClose: {
    position: "absolute",
    top: 5,
    right: 10,
    color: "#A3A8AF",
  },
  iconClose: {
    fontSize: 24,
  },
  dialogActions: {
    padding: "14px 24px",
  },
  iconSortFilter: {
    padding: "10px 8px",
    marginLeft: 5,
    "& svg": {
      marginLeft: 1,
      marginRight: 1,
      color: " #A3A8AF",
    },
    "&.sort-mode svg": {
      color: theme.palette.primary.main,
    },
  },
  labelAreaFilter: {
    padding: "8px 24px",
    fontSize: 16,
    fontWeight: 500,
    color: theme.palette.primary.main,
  },
  dialogContent: {
    padding: "3.75px 0",
    "&::-webkit-scrollbar": {
      width: 8,
      backgroundColor: "#E8EAEB",
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: 4,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#cbccce",
      borderRadius: 4,
    },
  },
}));

export default useStyles;
