import { Box, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { Fragment } from "react";
import styles from "./Options.styles";
import { OptionsProp } from "./Options.tyles";

function Options(props: OptionsProp) {
  const { classes, svg, title } = props;
  return (
    <Fragment>
      <Box className={classes.svg}>{svg}</Box>
      <Typography className={classes.title}>{title}</Typography>
    </Fragment>
  );
}

export default withStyles(styles)(Options);
