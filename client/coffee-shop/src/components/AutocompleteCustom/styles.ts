import { makeStyles, Theme } from "@material-ui/core";
import { colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  wrapperParentElement: {
    width: "100%",
  },
  rootInputSearch: {
    height: 36,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #D3D5D7",
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    padding: "0 12px",

    "& .MuiInputBase-input": {
      color: colorInk.primary,
      "&::placeholder": {
        color: colorInk.base40,
        opacity: 1,
      },
    },

    "&.focused": {
      borderColor: theme.palette.primary.main,
    },
    "& .search-icon, .clear-icon": {
      color: "#A3A8AF",
    },
    "& .clear-icon": {
      cursor: "pointer",
    },
    "& .input-element": {
      width: "100%",
      height: "100%",
      padding: "0 4px",
    },
    "& .delete-chip-button": {
      height: 24,
      borderRadius: 20,
      background: "#D9EDFF",
      color: "#2B4263",
      fontSize: 14,
      cursor: "pointer",
      "& .MuiChip-deleteIcon": {
        width: 17.5,
        height: 17.5,
        color: theme.palette.primary.main,
      },
    },
    "&.root-input-tags": {
      flexWrap: "wrap",
      minHeight: 36,
      height: "unset",
      justifyContent: "flex-start",
      paddingTop: 3,
      paddingBottom: 3,
      boxSizing: "border-box",
      "& .input-tags": {
        width: "0",
        minWidth: 80,
        flexGrow: 1,
      },
      "& .chip-tag": {
        maxWidth: "100%",
        height: 24,
        margin: "4px 8px 4px 0",
        background: "#D9EDFF",
        fontSize: 14,
        color: "#2B4263",
        "& .MuiSvgIcon-root": {
          color: theme.palette.primary.main,
          width: 18,
          height: 18,
        },
      },
    },
  },
  wrapperDropdownSuggest: {
    "& .wrapper-list-option": {
      overflowY: "auto",
      "&::-webkit-scrollbar": {
        width: 6,
        height: 6,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#bcbcbc",
        borderRadius: 6,
        "&:hover": {
          backgroundColor: colorInk.base40,
        },
      },
    },
    "& .suggest-item, & .select-all-option": {
      minHeight: 36,
      width: "100%",
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
      padding: "0 11px",
      cursor: "pointer",
      "& .MuiTypography-root": {
        padding: "5px 0",
      },
      "& .check-box": {
        padding: 6,
        marginRight: 3,
      },
      "&:hover": {
        backgroundColor: "#F2F9FF",
        "& .MuiTypography-root": {
          color: theme.palette.primary.main,
        },
      },
      overflowX: "hidden",
    },
  },
  rootSuggestItem: {},
  noResultText: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    pointerEvents: "none",
  },
  loading: {
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    alignItem: "center",
  },
  paginate: {
    height: 36,
    padding: "0 12px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTop: "1px solid #E8EAEB",
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
      "& svg": {
        width: 13,
        height: 9,
      },
      "&:first-child": {
        marginRight: 12,
      },
    },
  },
}));

export default useStyles;
