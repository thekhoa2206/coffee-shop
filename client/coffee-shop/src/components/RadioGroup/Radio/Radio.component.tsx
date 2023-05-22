import React from "react";
import { Radio as MuiRadio, RadioProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: 24,
    height: 24,
    padding: 5,
    marginRight: 2,
    color: "rgba(0, 0, 0, 0.26)",
  },
});

const Radio = (props: RadioProps) => {
  const classes = useStyles();

  return <MuiRadio className={classes.root} color="primary" size="small" {...props} />;
};

export default Radio;
