import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import ExportFileIcon from "components/SVG/ExportFileIcon";
import ImportFileIcon from "components/SVG/ImportFileIcon";
import { useTranslation } from "react-i18next";
import React, { Fragment } from "react";
import styles from "./ImportExportButton.styles";
import { ImportExportButtonProps } from "./ImportExportButton.types";
function ImportExportButton(props: ImportExportButtonProps) {
  const { classes, onClickExport, onClickImport, btnImportRef } = props;
  const { t } = useTranslation(["component"]);
  return (
    <Fragment>
      {onClickExport && (
        <Button
          size="small"
          onClick={() => onClickExport()}
          startIcon={<ExportFileIcon className={classes.iconImportExport} />}
          className={classes.button}
        >
          {t("component:button.export")}
        </Button>
      )}
      {onClickImport && (
        <Button
          ref={btnImportRef}
          size="small"
          onClick={() => onClickImport()}
          startIcon={<ImportFileIcon className={classes.iconImportExport} />}
          className={classes.button}
        >
          {t("component:button.import")}
        </Button>
      )}
    </Fragment>
  );
}

export default withStyles(styles)(ImportExportButton);
