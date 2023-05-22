import { createStyles, Theme } from "@material-ui/core";
import { colorInk } from "theme/palette";

const styles = (theme: Theme) =>
  createStyles({
    importExportFile: {
      display: "flex",
      cursor: "pointer",
    },
    iconImportExport: {
      color: colorInk.base40,
    },
    button: {
      "&:hover": {
        background: "none",
        color: theme.palette.primary.main,
      },
    },
  });
export default styles;
