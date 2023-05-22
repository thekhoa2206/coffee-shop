import { Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import React from "react";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

export const SnackbarSuccessProp: OptionsObject = {
  variant: "success",
  anchorOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  content: (key: SnackbarKey, message: SnackbarMessage): React.ReactNode => {
    return (
      <Alert
        variant="filled"
        severity={"success"}
        style={{ width: 600, justifyContent: "center" }}
        iconMapping={{ success: <CheckCircleOutlineIcon fontSize="inherit" /> }}
      >
        <Typography>{message}</Typography>
      </Alert>
    );
  },
  autoHideDuration: 3000,
};
export const SnackbarErrorProp: OptionsObject = {
  variant: "error",
  anchorOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  content: (key: SnackbarKey, message: SnackbarMessage): React.ReactNode => {
    return (
      <Alert variant="filled" severity={"error"} style={{ width: 600, justifyContent: "center" }}>
        <Typography>{message}</Typography>
      </Alert>
    );
  },
  autoHideDuration: 3500,
};
