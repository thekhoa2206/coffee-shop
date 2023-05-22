import { Box, BoxProps, Paper as MuiPaper, PaperProps as MuiPaperProps } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import clsx from "clsx";
import React, { memo } from "react";
import styles from "./Paper.styles";

interface PaperProps extends MuiPaperProps {
  headerProps?: BoxProps;
  borderHeader?: boolean;
  boxShadow?: boolean;
  //@deprecated
  renderHeadLeft?: any;
  //@deprecated
  renderHeadRight?: any;
}

const Paper = memo((props: PaperProps & WithStyles<typeof styles>) => {
  const {
    renderHeadLeft: HeadLeftComponent,
    renderHeadRight: HeadRightComponent,
    children,
    headerProps,
    borderHeader,
    classes,
    boxShadow,
    ...remainProps
  } = props;

  return (
    <MuiPaper
      className={classes.root}
      {...remainProps}
      style={{
        boxShadow: boxShadow ? "0px 2px 4px rgba(168, 168, 168, 0.25)" : undefined,
        ...remainProps.style,
      }}
    >
      {(HeadLeftComponent || HeadRightComponent) && (
        <Box {...headerProps} className={clsx(classes.header, { borderBottom: borderHeader })}>
          {HeadLeftComponent && <HeadLeftComponent />}
          {HeadRightComponent && <HeadRightComponent />}
        </Box>
      )}
      {children}
    </MuiPaper>
  );
});

Paper.displayName = "Paper";
export default withStyles(styles)(Paper);
