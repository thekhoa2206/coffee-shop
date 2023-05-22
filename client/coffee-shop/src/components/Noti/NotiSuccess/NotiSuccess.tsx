import { Box } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import { CheckCircleOutlineIcon } from "components/SVG";
import React, { Fragment, memo } from "react";
import styles from "./NotiSuccess.style";

interface NotiSuccessProps {
  content?: any;
  style?: React.CSSProperties;
  ContentComponent?: any;
}

const NotiSuccess = memo((props: NotiSuccessProps & WithStyles<typeof styles>) => {
  const { classes, content, style, ContentComponent } = props;

  return (
    <Box className={classes.root} style={style}>
      {ContentComponent || (
        <Fragment>
          <Box className="left">
            <Box className={classes.label}>
              <CheckCircleOutlineIcon className={classes.noti} />
              {content}
            </Box>
          </Box>
        </Fragment>
      )}
    </Box>
  );
});

export default withStyles(styles)(NotiSuccess);
