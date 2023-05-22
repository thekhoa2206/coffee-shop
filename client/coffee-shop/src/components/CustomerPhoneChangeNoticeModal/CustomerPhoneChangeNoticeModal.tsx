import { CustomerPhoneChangeNoticeModalProps } from "./CustomerPhoneChangeNoticeModal.type";
import styles from "./CustomerPhoneChangeNoticeModal.styles";
import { withStyles } from "@material-ui/styles";
import * as React from "react";
import { Box, Dialog, DialogActions, DialogTitle, IconButton, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import Button from "components/Button";

const CustomerPhoneChangeNoticeModal = (props: CustomerPhoneChangeNoticeModalProps) => {
  const { open, onConfirm, onCancel, classes } = props;

  const { t } = useTranslation(["component", "loyalty"]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={() => {
          if (onCancel) {
            onCancel();
          }
        }}
        className={classes.classRootModal}
      >
        <DialogTitle disableTypography className={classes.titleBox}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h4" className={classes.title}>
              {t("loyalty:note")}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            className={classes.closeBtn}
            onClick={() => {
              if (onCancel) {
                onCancel();
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <div className={classes.contentContainer}>
          <div dangerouslySetInnerHTML={{ __html: t("loyalty:phoneChangeWarning") }}></div>
          <DialogActions className={classes.actionsContainer}>
            <Button
              onClick={() => {
                if (onCancel) {
                  onCancel();
                }
              }}
              color="primary"
              variant="outlined"
              size="small"
              style={{ marginLeft: "16px" }}
            >
              {t("component:button.exit")}
            </Button>
            <Button
              onClick={() => {
                if (onConfirm) {
                  onConfirm();
                }
              }}
              color="primary"
              variant="contained"
              size="small"
              style={{ marginLeft: "16px" }}
            >
              {t("component:button.confirm")}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default withStyles(styles)(CustomerPhoneChangeNoticeModal);
