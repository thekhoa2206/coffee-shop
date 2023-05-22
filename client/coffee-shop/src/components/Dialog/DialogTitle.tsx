import React from "react";
import MiuDialogTitle, { DialogTitleProps } from "@material-ui/core/DialogTitle";
import { IconButton, Theme, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";
import { colorInk } from "theme/palette";
import { ArrowRightIcon } from "../SVG";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    minHeight: 52,
    boxSizing: "border-box",
    "&.dividerBottom": {
      borderBottom: "1px solid #D3D5D7",
    },
  },
  rootIconBtnClose: {
    position: "absolute",
    top: 2,
    right: 5,
    color: colorInk.base40,
  },
  iconClose: {
    fontSize: 24,
  },
  rootIconBtnBack: {
    margin: "0 8px 0 -12px",
    height: 28,
    width: 28,
    color: colorInk.base40,
  },
  iconBack: {
    fontSize: 17,
    margin: "0 0 -1px 0",
  },
  rootTitle: {
    fontSize: "20px",
    fontWeight: 500,
    flexGrow: 1,
  },
}));

export interface DialogTitlePropsCustom extends DialogTitleProps {
  onClose?: () => void;
  showBackButton?: boolean | null;
  dividerBottom?: boolean;
  onBack?: Function | null;
}

const DialogTitle = (props: DialogTitlePropsCustom) => {
  const { children, onClose, dividerBottom, showBackButton, onBack, ...remainProps } = props;
  const classes = useStyles();
  return (
    <MiuDialogTitle
      classes={{ root: classes.root }}
      disableTypography
      className={dividerBottom ? "dividerBottom" : ""}
      {...remainProps}
    >
      {showBackButton && (
        <IconButton aria-label="back" onClick={() => onBack?.()} classes={{ root: classes.rootIconBtnBack }}>
          <ArrowRightIcon className={classes.iconBack} />
        </IconButton>
      )}
      <Typography classes={{ root: classes.rootTitle }}>{children}</Typography>
      {onClose && (
        <IconButton
          aria-label="close"
          onClick={() => onClose()}
          classes={{ root: classes.rootIconBtnClose }}
          className="iconCloseBtn"
        >
          <CloseIcon className={classes.iconClose} />
        </IconButton>
      )}
    </MiuDialogTitle>
  );
};

export default DialogTitle;
