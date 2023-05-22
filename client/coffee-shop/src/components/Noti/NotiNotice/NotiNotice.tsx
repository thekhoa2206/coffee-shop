import { Box } from "@material-ui/core";
import { WithStyles, withStyles } from "@material-ui/styles";
import NoticeIcon from "components/SVG/NoticeIcon";
import React, { Fragment, memo } from "react";
import styles from "./NotiNotice.style";

interface NotiNoticeProps {
  content?: any;
  style?: React.CSSProperties;
  ContentComponent?: any;
}

const NotiNotice = memo((props: NotiNoticeProps & WithStyles<typeof styles>) => {
  const { classes, content, style, ContentComponent } = props;

  return (
    <Box className={classes.root} style={style}>
      {ContentComponent || (
        <Fragment>
          <Box className="left">
            <Box className={classes.label}>
              <NoticeIcon className={classes.icon} />
              {content}
            </Box>
          </Box>
        </Fragment>
      )}
    </Box>
  );
});

export default withStyles(styles)(NotiNotice);
