import { Box, Hidden, Link, Typography } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import { withStyles } from "@material-ui/styles";
import { BackIcon } from "components/SVG";
import FeedbackIcon from "components/SVG/FeedbackIcon";
import HelperIcon from "components/SVG/HelperIcon";
import NotiIcon from "components/SVG/NotiIcon";
import md5 from "md5";
import React, { Fragment, useEffect, useState } from "react";
import Avatar from "react-avatar";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { Link as RouteLink } from "react-router-dom";
import { ApplicationState } from "store/App/types";
import { AppState } from "store/store";
import useModal from "../../components/Modal/useModal";
import styles from "./Header.styles";
import { HeaderProps } from "./Header.types";
import UserOptionsPopoverComponent from "./components/Popover";
import UserOptions from "./UserOptions";

function Header(props: HeaderProps) {
  const { classes, authState, application } = props;
  const history = useHistory();
  const [atTop, setAtTop] = useState(true);
  const { t } = useTranslation("dashboard");
  const { openModal } = useModal();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openInfo, setOpenInfo] = useState(false);

  let open = Boolean(anchorEl);
  const handleBack = (e: React.MouseEvent, app: ApplicationState) => {
    if (app.header) {
      const linkTo = typeof app.header === "string" ? "" : app.header.linkTo;
      if ((app.header as any).externalLink) {
        window.location.href = linkTo;
      } else {
        history.push(linkTo);
      }
    }
  };

  let md5Email = md5(authState.user?.email || "");
  const showUserOptions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenInfo(!openInfo);
    setAnchorEl(anchorEl !== null ? null : event.currentTarget);
  };
  return (
    <Fragment>
      {application && application.header && (
        <Box id="header" className={`${classes.root} ${atTop ? "" : classes.shadowHeader}`}>
          {typeof application.header === "string" ? (
            <Typography variant="h3">{application.header}</Typography>
          ) : application.header?.linkTo && application.header?.linkTo !== "" ? (
            <Link
              component={RouteLink}
              onClick={(e: any) => handleBack(e, application)}
              to={application.header?.linkTo}
              underline="none"
              color={application.header?.withSubtitle ? "secondary" : "textPrimary"}
              className={classes.link}
            >
              <BackIcon />
              <Typography
                variant={application.header?.withSubtitle ? "subtitle1" : "h6"}
                color={application.header?.withSubtitle ? "secondary" : undefined}
                style={{ color: application.header?.withSubtitle ? "" : "#182537" }}
              >
                {application.header?.title}
              </Typography>
            </Link>
          ) : (
            <Typography
              variant={application.header?.withSubtitle ? "subtitle1" : "h3"}
              color={application.header?.withSubtitle ? "secondary" : undefined}
            >
              {application.header?.title}
            </Typography>
          )}
          <Box className={classes.headerRight}>
            <Box
              className={`${anchorEl !== null ? "open" : ""} ${classes.helper} ${classes.info}`}
              onClick={showUserOptions}
            >
              <Avatar size="30" round="20px" name={authState.user?.name} md5Email={md5Email} maxInitials={1} />
              <Typography color="textPrimary" className={classes.userName}>
                {authState.user?.name}
              </Typography>
              <KeyboardArrowDownIcon className="arrow-avatar" />
              <UserOptionsPopoverComponent
                open={open}
                anchorEl={anchorEl}
                children={<UserOptions />}
                onClose={() => {}}
              />
            </Box>
          </Box>

        </Box>
      )}
    </Fragment>
  );
}

const mapStateToProps = (state: AppState) => ({
  authState: state.auth,
  application: state.application,
});
export default connect(mapStateToProps, {})(withStyles(styles)(Header));
