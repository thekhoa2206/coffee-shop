import { makeStyles, Theme } from "@material-ui/core";
import { colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  input: {
    display: "flex",
    alignItems: "center",
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
    backgroundColor: "#fff",
    "& .MuiInputBase-root": {
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
    },
  },
  helperText: {
    fontSize: "12px",
    paddingLeft: "12px",
    color: theme.palette.error.main,
  },
  wrapperSuggestResult: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  menuItems: {
    overflow: "auto",
    width: "100%",
    wordBreak: "break-word",
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
    "& .ps__rail-y, ps__rail-x": {
      opacity: 0.6,
    },
    "& .optionAll": {
      backgroundColor: "#fff",
      borderBottom: "1px solid #E8EAEB",
    },
    "& .menuItem:not(.custom-item)": {
      display: "flex",
      alignItems: "flex-start",
      cursor: "pointer",
      padding: "10px 16px",
      fontSize: 14,
      "& .checkBox": {
        margin: "-6px 3px -9px -6px",
      },
    },
    "& .menuItem": {
      "&:hover, &.focus-key-event, &.selected-item": {
        background: "#F2F9FF",
        color: theme.palette.primary.main,
      },
    },
  },
  loading: {
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    alignItem: "center",
  },
  noOptions: {
    display: "flex",
    alignItems: "center",
    minHeight: 40,
    justifyContent: "center",
    fontSize: 14,
  },
  paginate: {
    height: 40,
    padding: "0 18px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTop: "1px solid",
    borderTopColor: colorInk.base30,
    "& .paging-btn": {
      boxSizing: "border-box",
      padding: 0,
      border: "1px solid",
      borderColor: theme.palette.primary.main,
      borderRadius: 1,
      color: theme.palette.primary.main,
      width: 20,
      height: 20,
      "&.Mui-disabled": {
        borderColor: colorInk.base30,
        color: colorInk.base30,
      },
      "&:first-child": {
        marginRight: 12,
      },
    },
  },
  creatable: {
    height: 40,
    fontWeight: 500,
    color: theme.palette.primary.main,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid #E8EAEB",
    "&:hover, &.focus-key-event": {
      color: theme.palette.primary.main,
      backgroundColor: "#F2F9FF",
    },
    "& svg": {
      color: theme.palette.primary.main,
      marginRight: 6,
    },
  },
  label: {
    fontSize: 14,
    lineHeight: "17px",
    color: colorInk.base80,
    marginTop: 0,
    marginBottom: 7,
  },
  wrapperInput: {
    height: 36,
    position: "relative",
    "& .MuiInputBase-root": {
      width: "100%",
      height: "100%",
      "&.show-result": {
        "& input": {
          border: "1px solid #D3D5D7",
          height: "100%",
          paddingRight: 12,
          paddingLeft: 40,
          borderRadius: 3,
          boxSizing: "border-box",
          "&:focus": {
            borderColor: theme.palette.primary.main,
          },
        },
      },
      "& .search-icon": {
        position: "absolute",
        color: "#A3A8AF",
        top: "50%",
        left: 12,
        transform: "translateY(-50%)",
      },
      "& .delete-chip-button": {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: "translateY(-50%)",
        height: 24,
        borderRadius: 20,
        background: "#E6F4FF",
        color: theme.palette.primary.main,
        fontSize: 14,
        cursor: "pointer",
        "& .MuiChip-deleteIcon": {
          width: 17.5,
          height: 17.5,
          color: theme.palette.primary.main,
        },
      },
    },
    searchAssigneeNoOption: {
      minHeight: 40,
      padding: "10px 16px",
      boxSizing: "border-box",
      borderBottom: "1px solid #E8EAEB",
      "& .search-assignee-content": {
        width: "100%",
        display: "flex",
        flexDirection: "column",
      },
      "& .assignee-name-2": {
        fontWeight: 500,
        overflow: "hidden",
        textOverflow: "ellipsis",
        "& .circle-plus": {
          width: "20px",
          height: "20px",
          float: "left",
          marginTop: "14px",
        },
        "& .create-custom-search-wrap": {
          float: "left",
          width: "calc(100% - 30px)",
          "& p": {
            wordBreak: "break-all",
          },
        },
      },
    },
    searchAssigneeOption: {
      minHeight: 40,
      padding: "10px 16px",
      boxSizing: "border-box",
      borderBottom: "1px solid #E8EAEB",
      cursor: "pointer",
      "&:hover": {
        color: theme.palette.primary.main,
        backgroundColor: "#F2F9FF",
      },
      "& .search-assignee-content": {
        width: "100%",
        display: "flex",
        flexDirection: "column",
      },
      "& .assignee-name": {
        fontWeight: 500,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      "& .assignee-name-2": {
        fontWeight: 500,
        overflow: "hidden",
        textOverflow: "ellipsis",
        "& .circle-plus": {
          width: "20px",
          height: "20px",
          float: "left",
          marginTop: "14px",
        },
        "& .create-custom-search-wrap": {
          float: "left",
          width: "calc(100% - 30px)",
          "& p": {
            wordBreak: "break-all",
          },
        },
      },
      "&.active": {
        color: theme.palette.primary.main,
        backgroundColor: "#F2F9FF",
      },
    },
  },
  helperTextRoot: {
    fontSize: "12px",
    margin: "3px 0 0",
    paddingLeft: "12px",
    color: theme.palette.error.main,
  },
}));

export default useStyles;
