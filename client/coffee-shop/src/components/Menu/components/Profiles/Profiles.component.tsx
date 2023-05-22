import { Box, ClickAwayListener, ListItem, ListItemText, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PhoneIcon from "@material-ui/icons/Phone";
import { withStyles } from "@material-ui/styles";
import { MenuHelpIcon, MenuImportFileIcon, MenuSignOutIcon, MenuUserIcon } from "components/SVG";
import md5 from "md5";
import React, { Fragment, useState } from "react";
import Avatar from "react-avatar";
import { connect } from "react-redux";
import { AppState } from "store/store";
import styles from "./Profiles.styles";
import { ProfilesProps } from "./Profiles.types";

const Profiles = (props: ProfilesProps) => {
  const { authState, classes } = props;
  const [open, setOpen] = useState(false);
  let md5Email = md5(authState.user?.email || "");

  const listMenu = React.useMemo(
    () => [
      {
        title: "Hotline 1900 6750",
        icon: <PhoneIcon />,
      },
      {
        title: "Trợ giúp",
        icon: <MenuHelpIcon />,
      },
      {
        title: "Trang cá nhân",
        icon: <MenuUserIcon />,
      },
      {
        title: "Xuất nhập file",
        icon: <MenuImportFileIcon />,
      },
      {
        title: "Thoát",
        icon: <MenuSignOutIcon />,
      },
    ],
    []
  );

  return (
    <Fragment>
      <hr className="menuDivider" />
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box className={classes.root}>
          <ListItem
            classes={{ root: classes.profileParent }}
            button
            onClick={() => setOpen((prev) => !prev)}
            id="menu-user-profiles"
          >
            <Avatar size="32" round="20px" name={authState.user?.name} color="green" md5Email={md5Email} />
            <ListItemText primary={authState.user?.name} classes={{ root: classes.profileName }} />
            <ExpandMoreIcon className="icon-collapse" />
          </ListItem>
          {open && (
            <Box className={classes.profilesListMenuItem}>
              {React.Children.toArray(
                listMenu.map((item) => (
                  <ListItem button classes={{ root: classes.profilesMenuItem }}>
                    {item.icon}
                    <Typography>{item.title}</Typography>
                  </ListItem>
                ))
              )}
            </Box>
          )}
        </Box>
      </ClickAwayListener>
    </Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  authState: state.auth,
  menuState: state.menu,
});

export default connect(mapStateToProps)(withStyles(styles)(Profiles));
