import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      minHeight: 28,
      marginTop: 12,
      marginBottom: 12,
      flex: "0 0 auto",
      paddingRight: 12,
      position: "sticky",
      left: 0,
    },
    select: {
      margin: "0 12px",
      height: "24px",
      minWidth: "50px",
      width: "auto",
      "& .MuiSelect-root": {
        padding: "0 25px 0 8px",
        height: "23px",
      },
      "& .MuiSelect-icon": {
        right: "2px",
      },
    },
    labelDisplayedRows: {
      margin: "0 64px",
    },
    pageSizeOption: {
      fontSize: 13,
    },
    pagingContainer: {
      "& li:not(:first-child):not(:last-child) .MuiPaginationItem-sizeSmall": {
        height: 20,
        minWidth: 20,
        borderRadius: 10,
        margin: "0px 4px",
        fontSize: "14px",
      },
      "& li:first-child .MuiPaginationItem-sizeSmall, & li:last-child .MuiPaginationItem-sizeSmall": {
        height: 20,
        minWidth: 20,
        "& .MuiPaginationItem-icon": {
          fontSize: "24px",
          color: "#7A8086",
        },
      },
    },
  })
);

export default useStyles;
