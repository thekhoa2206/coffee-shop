import { ActivateLoyaltyPromptModalProps } from "./ActivateLoyaltyPromptModal.type";
import styles from "./ActivateLoyaltyPromptModal.styles";
import { withStyles } from "@material-ui/styles";
import * as React from "react";
import {  Dialog, DialogTitle, IconButton } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import Button from "components/Button";

const ActivateLoyaltyPromptModal = (props: ActivateLoyaltyPromptModalProps) => {
  const { open, onConfirm, onClose, classes } = props;

  const { t } = useTranslation(["component", "loyalty"]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={() => {
          if (onClose) {
            onClose();
          }
        }}
        className={classes.classRootModal}
      >
        <IconButton
          aria-label="close"
          className={classes.closeBtn}
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        <div className={classes.contentContainer}>
          <p>{t("loyalty:registration.promptMessage")}</p>
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={classes.confirmBtn}
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              }
            }}
          >
            {t("component:button.confirm")}
          </Button>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default withStyles(styles)(ActivateLoyaltyPromptModal);
