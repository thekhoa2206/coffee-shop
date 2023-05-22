import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import useModal from "../../Modal/useModal";
import Button from "../../Button";
import useStyles from "./ConfirmDialog.style";

export interface ConfirmDialogProps {
  title?: string;
  message?: ReactNode;
  isDelete?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  deleteButtonText?: string;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { title, message, isDelete, confirmButtonText, cancelButtonText, deleteButtonText } = props;
  const { t } = useTranslation(["component"]);
  const classes = useStyles();
  const { closeModal } = useModal();

  const handleCancel = (e: React.MouseEvent) => {
    closeModal(false);
  };

  const handleConfirm = () => {
    closeModal(true);
  };

  return (
    <Dialog
      open={true}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
      classes={{ paper: classes.paper, root: classes.root }}
    >
      <DialogTitle id="form-dialog-title" disableTypography className={classes.dialogTitle}>
        <Typography classes={{ root: classes.title }}>{title}</Typography>
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          classes={{ root: classes.rootIconBtnClose }}
          className="iconCloseBtn"
        >
          <CloseIcon className={classes.iconClose} />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {typeof message === "string" ? <Typography variant="body1">{message}</Typography> : message}
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Box display="flex" justifyContent="flex-end" className={classes.actionButton}>
          <Button
            className={classes.actionButton}
            variant="outlined"
            size="small"
            color="primary"
            btnType={isDelete ? "destruction" : "default"}
            onClick={handleCancel}
          >
            <Typography variant="body2" style={{ fontWeight: 500 }}>
              {cancelButtonText ? cancelButtonText : t("component:button.exit")}
            </Typography>
          </Button>

          {!isDelete && (
            <Button variant="contained" color="primary" size="small" onClick={handleConfirm}>
              {confirmButtonText ? confirmButtonText : t("button.save")}
            </Button>
          )}

          {isDelete && (
            <Button
              // style={{ width: 64 }}
              variant="contained"
              size="small"
              color="primary"
              btnType={"destruction"}
              onClick={handleConfirm}
            >
              <Typography variant="body2" style={{ fontWeight: 500 }}>
                {deleteButtonText ? deleteButtonText : t("component:button.delete")}
              </Typography>
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ConfirmDialog);
