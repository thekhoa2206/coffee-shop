import { Box, makeStyles, Theme } from "@material-ui/core";
import MuiDialogActions, { DialogActionsProps } from "@material-ui/core/DialogActions";
import { isNil } from "lodash";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button/index";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: "24px",
  },
}));

export interface DialogActionsPropsCustom extends DialogActionsProps {
  onOk?: () => void;
  onClose?: (e: any, reason?: "backdropClick" | "escapeKeyDown" | "nthButton") => void;
  onCancel?: () => void;
  textOk?: string;
  textCancel?: string;
  textClose?: string;
  onDelete?: () => void;
  textDelete?: string;
  renderActions?: any;
  isLoading?: boolean;
  isNotShowCloseButton?: boolean | null;
  isNotShowActionButton?: boolean | null;
  disabledOk?: boolean;
  autoFocus?: boolean;
  isCancel?: boolean;
}

const DialogAction = (props: DialogActionsPropsCustom) => {
  const {
    children,
    textOk,
    textClose,
    textCancel,
    onClose,
    onOk,
    onCancel,
    isCancel,
    isLoading,
    isNotShowCloseButton,
    isNotShowActionButton,
    disabledOk,
    renderActions: Component,
    autoFocus,
    onDelete,
    textDelete,
    ...remainProps
  } = props;
  const classes = useStyles();
  const { t } = useTranslation(["component"]);

  if (!onOk && !onClose && !Component) {
    return <> </>;
  }

  return (
    <MuiDialogActions {...remainProps} classes={{ root: classes.root }}>
      {Component ? (
        <Component />
      ) : (
        <Fragment>
          <Box display="flex">
            {onDelete && textDelete !== "" && !isNotShowActionButton ? (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                btnType="destruction"
                style={{ marginRight: "16px" }}
                onClick={() => onDelete()}
                isLoading={isLoading}
                disabled={disabledOk}
                autoFocus={autoFocus}
              >
                {textDelete ? textDelete : t("button.delete")}
              </Button>
            ) : null}
            {onClose && !isNotShowCloseButton ? (
              <Button variant="outlined" color="primary" size="small" onClick={(e) => onClose(e, "nthButton")}>
                {textClose ? textClose : "Thoát"}
              </Button>
            ) : null}
          {onCancel && isCancel && !isNotShowActionButton ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              btnType="destruction"
              style={{ marginLeft: "16px" }}
              onClick={() => onCancel()}
            >
              {textCancel ? textCancel : "Hủy"}
            </Button>
          ) : null}
          {onOk && textOk !== "" && !isNotShowActionButton ? (
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginLeft: "16px" }}
                onClick={() => onOk()}
                isLoading={isLoading}
                disabled={disabledOk}
                autoFocus={autoFocus}
              >
                {textOk ? textOk : "Lưu"}
              </Button>
            ) : null}
          </Box>
        </Fragment>
      )}
    </MuiDialogActions>
  );
};

export default DialogAction;
