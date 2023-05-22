import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    classRootModal: {
      "& .MuiDialog-paperWidthSm": {
        maxWidth: 700,
      },
    },
    description: {
      padding: "17px 24px",
    },
    dragDropFile: {
      border: "1px dashed #D3D5D7",
      height: 60,
      borderRadius: 3,
      display: "flex",
      alignItems: "center",
      fontSize: 14,
      justifyContent: "center",
      cursor: "pointer",
    },
    hide: {
      display: "none !important",
    },
    notiImportSuccess: {
      display: "flex",
      justifyContent: "center",
    },
    succesIcon: {
      marginRight: 6,
    },
  });
export default styles;
