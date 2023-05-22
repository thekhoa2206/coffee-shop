import { WithStyles } from "@material-ui/styles";
import { RefObject } from "react";
import styles from "./ImportExportButton.styles";

export interface ImportExportButtonProps extends WithStyles<typeof styles> {
  onClickExport?: Function;
  onClickImport?: Function;
  btnImportRef?: RefObject<any>;
}
