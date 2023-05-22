import { Theme } from "@material-ui/core";
import MuiButton, { ButtonProps } from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import CircularProgress from "components/Loading/CircularProgress";
import React from "react";
import { colorGreenSuccessful, colorInk, colorRedWarning } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "3px",
    minHeight: "36px",
    padding: "0 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textTransform: "none",
    boxShadow: "none",
    "&:hover, &:active, &:focus-visible": {
      boxShadow: "none",
    },
  },
  sizeLarge: {
    minWidth: "128px",
    minHeight: "48px",
  },
  sizeSmall: {
    minWidth: "64px",
    minHeight: "36px",
  },
  containedPrimary: {
    "&:hover": {
      background: theme.palette.primary.light,
    },
    "&.notice": {
      backgroundColor: colorGreenSuccessful.primary.main,
      "&:hover": {
        backgroundColor: colorGreenSuccessful.primary.light,
      },
    },
    "&.destruction": {
      backgroundColor: colorRedWarning.primary.main,
      "&:hover": {
        backgroundColor: colorRedWarning.primary.light,
      },
    },
  },
  outlinedPrimary: {
    border: "1px solid",
    borderColor: theme.palette.primary.main,
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: theme.palette.primary.light,
      borderColor: theme.palette.primary.light,
    },
    "&.notice": {
      color: colorGreenSuccessful.primary.main,
      borderColor: colorGreenSuccessful.primary.main,
      "&:hover": {
        color: colorGreenSuccessful.primary.light,
        borderColor: colorGreenSuccessful.primary.light,
      },
    },
    "&.destruction": {
      color: colorRedWarning.primary.main,
      borderColor: colorRedWarning.primary.main,
      "&:hover": {
        color: colorRedWarning.primary.light,
        borderColor: colorRedWarning.primary.light,
      },
    },
  },
  disabled: {
    backgroundColor: colorInk.base30,
    "& .MuiButton-label": {
      color: "#747C87",
    },
  },
}));

const Button = React.forwardRef(
  (
    props: ButtonProps & {
      btnType?: "default" | "destruction" | "notice";
      isLoading?: boolean;
    },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const { btnType, isLoading, disabled, size, children, classes, className, ...remainProps } = props;
    const classesMakeStyle = useStyles();
    let sizeLoading = size && size === "small" ? 25 : 30;
    return (
      <MuiButton
        size={size}
        classes={{ ...props.classes, ...classesMakeStyle }}
        className={clsx(btnType, className)}
        disabled={disabled || isLoading}
        ref={ref}
        {...remainProps}
      >
        {isLoading ? <CircularProgress size={sizeLoading} /> : children}
      </MuiButton>
    );
  }
);

export default Button;
