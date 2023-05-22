import { Box, Link, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Dialog from "components/Dialog/Dialog";
import CloudDownloadIcon from "components/SVG/CloudDownloadIcon";
import SuccessIconOuterLine from "components/SVG/SuccessIconOuterLine";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { SnackbarErrorProp, toBase64 } from "utilities";
import styles from "./ImportFileModal.styles";
import { ImportFileModalProps } from "./ImportFileModal.type";
import { useTranslation } from "react-i18next";

const ImportFileModal = (props: ImportFileModalProps) => {
  const { classes, open, title, description, onClose, onOk, isComplete, isLoading, email } = props;
  const [fileImport, setFileImport] = React.useState<File | null>();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFileImport(acceptedFiles[0]);
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(["component"]);
  React.useEffect(() => {
    if (open) {
      setFileImport(null);
    }
  }, [open]);

  const hanldeImport = () => {
    if (fileImport) {
      toBase64(fileImport).then((data) => {
        onOk({
          name: fileImport.name,
          base64String: data.split(",")[1],
        });
      });
    } else {
      enqueueSnackbar(`${t("component:importFile.selectFile")}`, SnackbarErrorProp);
    }
  };
  const TITLE = `${t("component:button.import")} ${title}`;
  return (
    <React.Fragment>
      <Dialog
        showCloseBtnTitle={true}
        classRoot={classes.classRootModal}
        title={isComplete ? " " : TITLE}
        open={open}
        textClose={t("component:button.exit")}
        textOk={t("component:button.import")}
        onClose={() => onClose()}
        onOk={isComplete ? undefined : () => hanldeImport()}
        DialogContentProps={{
          dividers: isComplete ? false : true,
          style: {
            padding: 0,
          },
        }}
        DialogTitleProps={{
          style: {
            borderBottom: fileImport && !isComplete ? "4px #33A0FF solid" : "",
            width: fileImport && !isComplete ? "fit-content" : "",
          },
        }}
        DialogActionProps={{
          style: {
            padding: "0px 24px 24px 24px",
            display: isComplete ? "none" : "",
          },
        }}
        fullWidth={true}
        isLoading={isLoading}
      >
        {isComplete ? (
          <Box style={{ padding: false ? "0 120px 42px 120px" : "0 67px 42px 67px" }}>
            <Box className={classes.notiImportSuccess}>
              <SuccessIconOuterLine htmlColor="#0FD186" className={classes.succesIcon} />
              <Typography variant="h6" style={{ fontSize: 20 }}>
                {TITLE} {t("component:importFile.success")}
              </Typography>
            </Box>
            <Box className={classes.notiImportSuccess} style={{ marginTop: 13 }}>
              {email ? (
                <Typography color="secondary" style={{ fontSize: 13 }}>
                  {t("component:importFile.dataProccess")} <span style={{ fontWeight: 500 }}>{email}</span>
                </Typography>
              ) : (
                <Typography color="secondary" style={{ fontSize: 13 }}>
                  {t("component:exportFile.updateEmail")}{" "}
                  <Link href="https://profiles.sapo.vn/accounts" target="_blank">
                    {t("component:exportFile.here")}
                  </Link>{" "}
                  {t("component:importFile.sendEmailImportFile")}
                </Typography>
              )}
            </Box>
          </Box>
        ) : (
          <React.Fragment>
            <Box className={classes.description}>{description}</Box>
            <Box style={{ padding: "5px 24px 24px 24px" }}>
              <Box {...getRootProps({ className: classes.dragDropFile })}>
                <CloudDownloadIcon htmlColor="#747C87" style={{ marginRight: 10 }} />
                <Typography color="secondary">
                  {fileImport ? fileImport.name : `${t("component:importFile.fileImport")}`}
                </Typography>
              </Box>
              <input
                {...getInputProps()}
                multiple={false}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </Box>
          </React.Fragment>
        )}
      </Dialog>
    </React.Fragment>
  );
};
export default withStyles(styles)(ImportFileModal);
