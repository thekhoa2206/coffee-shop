import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textDecoration: "none",
      color: theme.palette.primary.main,
      "&:hover": {
        textDecoration: "underline",
      },
    },
  })
);

const Link = (props: LinkProps) => {
  const classes = useStyles();
  return <RouterLink className={clsx(classes.root, props.className)} {...props} />;
};

export default Link;
