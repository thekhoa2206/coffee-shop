import { Box, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import md5 from "md5";
import React, { Fragment } from "react";
import Avatar from "react-avatar";
import { connect } from "react-redux";
import { AppState } from "store/store";
import styles from "./User.styles";
import { UserInfoProp } from "./User.types";

function OptionUser(props: UserInfoProp) {
  const { classes, authState } = props;

  let md5Email = md5(authState.user?.email || "");
  return (
    <Fragment>
      <Avatar size="37" round="20px" name={authState.user?.name} md5Email={md5Email} maxInitials={1} />
      <Box className={classes.infoText}>
        <Typography variant="subtitle1" color="textPrimary">
          {authState.user?.name}
        </Typography>
        <Typography variant="caption" color="secondary">
          Xem trang cá nhân
        </Typography>
      </Box>
    </Fragment>
  );
}
const mapStateToProps = (state: AppState) => ({
  authState: state.auth,
});
export default connect(mapStateToProps, {})(withStyles(styles)(OptionUser));
