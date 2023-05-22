import { Box } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import AlertIcon from "components/SVG/AlertIcon";
import React, { Fragment, memo } from "react";
import styles from "./NotiAlert.style";

interface NotiAlertProps {
  content?: any;
  style?: React.CSSProperties;
  ContentComponent?: any;
}

const NotiAlert = memo((props: NotiAlertProps & WithStyles<typeof styles>) => {
  const { classes, content, style, ContentComponent } = props;

  return (
    <Box className={classes.root} style={style}>
      {ContentComponent || (
        <Fragment>
          <Box className="left">
            <Box className={classes.label}>
              <AlertIcon className={classes.icon} />
              {content}
            </Box>
          </Box>
        </Fragment>
      )}
    </Box>
  );
});

export default withStyles(styles)(NotiAlert);
