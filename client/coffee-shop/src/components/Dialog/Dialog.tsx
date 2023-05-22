import { Box, Theme, Typography } from "@material-ui/core";
import MuiDialog, { DialogProps } from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/styles";
import Link from "components/Link";
import { BackIcon } from "components/SVG";
import React from "react";
import DialogAction, { DialogActionsPropsCustom } from "./DialogAction";
import DialogContent, { DialogContentPropsCustom } from "./DialogContent";
import DialogTitle, { DialogTitlePropsCustom } from "./DialogTitle";

const useStyles = (props: DialogPropsCustom) =>
  makeStyles((theme: Theme) => ({
    paper: {
      margin: 0,
      top: "50px",
      position: "absolute",
      maxWidth: props.maxWidthPaper,
      minWidth: props.minWidthPaper,
    },
  }));

export interface DialogPropsCustom extends DialogProps {
  title?: string;
  showCloseBtnTitle?: boolean;
  onOk?: () => void;
  textOk?: string;
  onCancel?: () => void;
  isCancel?: boolean;
  textCancel?: string;
  textClose?: string;
  isLoading?: boolean;
  classRoot?: string;
  DialogTitleProps?: DialogTitlePropsCustom;
  DialogContentProps?: DialogContentPropsCustom;
  DialogActionProps?: DialogActionsPropsCustom;
  maxWidthPaper?: string | number;
  minWidthPaper?: string | number;
  isNotShowCloseButton?: boolean | null;
  isNotShowActionButton?: boolean | null;
  isNotShowFooter?: boolean | null;
  disabledOk?: boolean;
  value?: number;
  autoFocus?: boolean;
  onClose?: (e: any, reason?: "backdropClick" | "escapeKeyDown" | "nthButton") => void;
  onDelete?: () => void;
  textDelete?: string;
  textApplyProduce?: string;
  showProductSelected?: () => void;
  openDialogProductSelected?: boolean;
  isShowBackIcon?: boolean;
  setBackPopupSuggest?: (backPopupSuggest: boolean) => void;
}

const Dialog = React.memo((props: DialogPropsCustom) => {
  const classes = useStyles(props)();
  const {
    children,
    onClose,
    onOk,
    onCancel,
    isCancel,
    textCancel,
    textOk,
    textClose,
    title,
    isLoading,
    showCloseBtnTitle = true,
    DialogTitleProps,
    DialogContentProps,
    DialogActionProps,
    maxWidthPaper,
    minWidthPaper,
    classRoot,
    isNotShowCloseButton,
    isNotShowActionButton,
    isNotShowFooter,
    disabledOk,
    autoFocus,
    onDelete,
    textDelete,
    textApplyProduce,
    showProductSelected,
    openDialogProductSelected,
    isShowBackIcon,
    setBackPopupSuggest,
    ...remainProps
  } = props;

  return (
    <MuiDialog
      {...remainProps}
      onClose={onClose}
      disableBackdropClick
      disableRestoreFocus
      disableEnforceFocus
      className={`${classRoot}`}
      classes={{ paper: classes.paper }}
    >
      {title && (
        <DialogTitle {...DialogTitleProps} onClose={showCloseBtnTitle ? (onClose as any) : undefined}>
          {isShowBackIcon ? (
            <Box style={{ display: "flex" }}>
              <Link
                to={"#"}
                onClick={() => {
                  if (setBackPopupSuggest) setBackPopupSuggest(true);
                }}
                style={{ color: "#A3A8AF" }}
              >
                <BackIcon />
              </Link>
              <Typography style={{ marginLeft: 10, fontSize: 20, fontWeight: 500 }}> {title}</Typography>
            </Box>
          ) : (
            <span>{title}</span>
          )}
        </DialogTitle>
      )}
      <DialogContent {...DialogContentProps}>{children}</DialogContent>

      {!isNotShowFooter && (
        <DialogAction
          {...DialogActionProps}
          onClose={onClose}
          onOk={onOk}
          onCancel={onCancel}
          textCancel={textCancel}
          textOk={textOk}
          isCancel={isCancel}
          textClose={textClose}
          isLoading={isLoading}
          disabledOk={disabledOk}
          isNotShowCloseButton={isNotShowCloseButton}
          isNotShowActionButton={isNotShowActionButton}
          autoFocus={autoFocus}
          onDelete={onDelete}
          textDelete={textDelete}
        />
      )}
    </MuiDialog>
  );
});

export default Dialog;
