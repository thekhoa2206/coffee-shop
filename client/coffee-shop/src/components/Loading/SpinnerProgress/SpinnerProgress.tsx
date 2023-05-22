import { SvgIconProps } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import SpinnerIcon from "components/SVG/SpinnerIcon";
import React, { memo } from "react";
import styles from "./SpinnerProgress.styles";

interface SpinnerProgressProps extends SvgIconProps {
  children?: any;
}

const SpinnerProgress = memo((props: SpinnerProgressProps & WithStyles<typeof styles>) => {
  const { classes, children: Component, ...remainProps } = props;
  if (Component) {
    return <Component className={classes.root} {...remainProps} />;
  }
  return <SpinnerIcon className={classes.root} {...remainProps} />;
});

SpinnerProgress.displayName = "SpinnerProgress";
export default withStyles(styles)(SpinnerProgress);
