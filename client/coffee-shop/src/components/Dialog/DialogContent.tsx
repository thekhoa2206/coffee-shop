import React from "react";
import MuiDialogContent, { DialogContentProps } from "@material-ui/core/DialogContent";
import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // overflow: "hidden",
    padding: "0 24px",
    "&.MuiDialogContent-dividers.dividerTop": {
      borderBottom: 0,
    },
    "&::-webkit-scrollbar": {
      width: 13,
      backgroundColor: "#E8EAEB",
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: 4,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#cbccce",
      borderRadius: 4,
      "&:hover": {
        backgroundColor: "#A3A8AF",
      },
    },
  },
}));

export interface DialogContentPropsCustom extends DialogContentProps {
  dividerBottom?: boolean;
}

const DialogContent = (props: DialogContentPropsCustom) => {
  const { children, dividerBottom, ...remainProps } = props;
  const classes = useStyles();
  return (
    <MuiDialogContent classes={{ root: classes.root }} className={!dividerBottom ? "dividerTop" : ""} {...remainProps}>
      {children}
    </MuiDialogContent>
  );
};

export default DialogContent;
