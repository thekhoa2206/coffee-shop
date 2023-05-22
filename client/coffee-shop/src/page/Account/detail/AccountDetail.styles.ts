import { createStyles, Theme } from "@material-ui/core";
import { colorBlue, colorBorder, colorInk } from "theme/palette";
const styles = (theme: Theme) =>
  createStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F4F4F4",
        padding: "24px 32px 40px",
        minWidth: "1080px",
        flex: "1 1 auto",
        "& .MuiChip-root": {
          padding: "4px 16px",
          fontSize: "12px",
          height: "24px",
        },
        "& .created-chip-button": {
          color: "#0DB473",
          backgroundColor: "#DBF8ED",
        },
        "& .updated-chip-button": {
          color: "#FFAE06",
          backgroundColor: "#FFF7E7",
        },
        "& .deleted-chip-button": {
          color: "#EE4747",
          backgroundColor: "#FFDBDB",
        },
        "& .MuiTableContainer-root.stickyHeader": {
          backgroundColor: "#F3F4F5",
          boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
        },
        "& .MuiTableHead-root": {
          backgroundColor: "#F3F4F5",
          "& .MuiTableCell-paddingNone": {
            padding: "0 16px",
          },
          "& .MuiTableCell-root": {
            paddingTop: "12px",
            paddingBottom: "12px",
          },
        },
      },
      accountNameLabel: {
        fontSize: "20px",
        lineHeight: "28px",
        fontWeight: 500,
        color: "#182537",
        paddingRight: "12px",
      },
      accountHeaderInfoBox: {
        display: "flex",
        justifyContent: "flex-start",
        paddingBottom: "20px",
        alignItems: "center",
      },
      accountInformationBox: {
        background: "#FFFFFF",
        boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
        borderRight: "3px",
      },
      roleInformationBox: {
        background: "#FFFFFF",
        boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
        borderRight: "3px",
        marginTop: "24px",
      },
      headerInformationBox: {
        borderBottom: "1px solid #E8EAEB",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
      linkUpdatePasswordLabel: {
        color: "#0088FF",
        cursor: "pointer",
      },
      detailInformationBox: {
        padding: "16px 24px",
      },
      inputLabelRoot: {
        display: "flex",
        alignItems: "center",
        color: colorInk.base80,
        "&.MuiInputLabel-shrink": {
          transform: "none",
          fontSize: 14,
          lineHeight: "17px",
        },
        "&.Mui-error": {
          color: colorInk.base80,
        },
        "& .MuiFormLabel-asterisk": {
          color: theme.palette.error.main,
        },
        marginBottom: 8,
      },
      closeTagIcon: {
        width: 8,
        height: 8,
        marginTop: -2,
        marginRight: 12,
        color: theme.palette.primary.main,
      },
      chipLocation: {
        height: 24,
        borderRadius: 20,
        background: "#D9EDFF",
        color: "#2B4263",
        fontSize: 14,
        cursor: "pointer",
        "& svg.MuiChip-deleteIcon": {
          color: "#0088FF",
          marginRight: 0,
        },
        "&:focus": {
          "& svg.MuiChip-deleteIcon": {
            color: theme.palette.primary.main,
          },
        },
        "&:hover": {
          borderColor: colorBorder.primary.dark,
        },
        "&.open": {
          "& svg.MuiChip-deleteIcon": {
            color: theme.palette.primary.main,
            transform: "unset",
          },
        },
        "& .label-select": {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
      },
      groupLocationSelected: {
        display: "flex",
        "& .MuiChip-root": {
          marginRight: "8px",
        },
      },
      updatePasswordBox: {
        background: "#FFFFFF",
        paddingTop: "16px",
      },
      noteUpdatePasswordBox: {
        background: "#F2F9FF",
        borderRight: "3px",
        marginTop: "24px",
        padding: "16px 24px",
      },
      locationRoleBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "& .icon_delete_button": {},
      },
      notePasswordTextRoot: {
        fontSize: "12px",
        paddingLeft: "12px",
        color: "#747C87",
        "&.Mui-error": {
          color: "#747C87",
        },
      },
      tenantRoleAction: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
        minWidth: "150px",
        paddingLeft: "24px",
      },
      textLink: {
        color: colorBlue.primary.main,
        cursor: "pointer",
        "&:hover": {
          textDecoration: "underline",
        },
      },
      root: {
        width: "100%",
        height: "fit-content",
        "& .box-title": {
          display: "flex",
          alignItems: "center",
          height: "64px",
          borderBottom: "1px solid #E8EAEB",
          padding: "0 16px",
          "@media (min-width: 1920px)": {
            padding: "0 24px",
          },
          "&>.MuiTypography-root": {
            textTransform: "uppercase",
          },
          "& .header-group-button": {
            display: "flex",
            marginLeft: "auto",
          },
        },
      },
  });

export default styles;
