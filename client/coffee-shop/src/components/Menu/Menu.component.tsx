import {
  AppBar,
  Box, Drawer,
  Hidden,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  Toolbar,
  Typography, useTheme
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Dialog from "components/Dialog/Dialog";
import Tooltip from "components/Tooltip";
import moment from "moment";
import React, { Children, forwardRef, Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import { AppState } from "store/store";
import { AccountRole } from "utilities/AccountRole";
import { Countries } from "utilities/Countries";
import MenuItem from "./components/MenuItem/MenuItem.component";
import useStyles from "./Menu.styles";
import { MenuItem as MenuItemType } from "./MenuData/MenuData.types";
import { updateCollapseMenuStatus } from "../../store/Menu/menuSlice";
import { cloneDeep } from "lodash";
import { colorBorder } from "../../theme/palette";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import clsx from 'clsx';
import Avatar from 'react-avatar';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import md5 from 'md5';

const Menu = (props: PropsFromRedux) => {
  const { menuState, authState, updateCollapseMenuStatus } = props;
  const classes = useStyles();
  const { menuItems, collapse } = menuState;
  const [openDialogNotConnectSe, setOpenDialogNotConnectSe] = useState(false);
  const { t } = useTranslation("menu");
  const [connectSE, setConnectSE] = useState(false);
  const [menuIdOpen, setMenuIdOpen] = useState("");
  const handleEventRouteMenuItem = useCallback(
    async (item: MenuItemType) => {
      if (item.title === "Sapo Express") {
        let accessKey = process.env.REACT_APP_API_KEY_SE;
          let seAdminUrl = `/admin/api/auth?api_key=${accessKey}`;
          try {
            if (connectSE) {
              window.location.href = seAdminUrl;
            } else {
              setOpenDialogNotConnectSe(true);
            }
          } catch (error) {
            let key = Object.keys(error as any);
            if ((error as any).request.status === 403) {
              window.location.href = "/admin/authorization/accessdenied";
            } else if (key[0] === "status") {
              window.location.href = seAdminUrl;
            } else {
              setOpenDialogNotConnectSe(true);
            }
          }
      }
    },
    [authState.user]
  );
  const renderMenuItem = (menuItem: MenuItemType, hasDividerTop?: boolean, hasDividerBottom?: boolean) => {
    return (
      <MenuItem
        level={0}
        menuItem={menuItem}
        menuIdOpen={menuIdOpen}
        setMenuIdOpen={setMenuIdOpen as any}
        hasDividerBottom={hasDividerBottom}
        hasDividerTop={hasDividerTop}
        handleEventRouteMenuItem={handleEventRouteMenuItem}
      />
    );
  };

  const renderMenuItems = (newStyleLine?: boolean) => {
    let menuItemPrimary = menuItems.filter(
      (item) =>
        item.id !== "pos" && item.id !== "setting" && item?.typeMenu !== "SalesChannels" && item.id !== "advance"
    );
    return (
      <Fragment>
                {menuItemPrimary &&
          menuItemPrimary.length > 0 &&
          Children.toArray(menuItemPrimary.map((menuItem) => renderMenuItem(menuItem)))}
      </Fragment>
    );
  };
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const theme = useTheme();

  const drawer  =  (
    <Fragment>
      <Box className={clsx("menuTopHeader", classes.drawerMenu)} >
        <Box className="menuTopLogo" style={{ padding: 12}}>
          <Link to={`/admin`}></Link>
        </Box>
      </Box>
      <hr className={classes.menuDivider} />
      <Box  className={clsx("menuInnerWrapper", classes.drawerMenu)}>
        <Box className="menuPrimaryInner" id="menuPrimaryInner">
          <List component="nav" className="menuList">
            {renderMenuItems(true)}
          </List>
        </Box>
      </Box>
    </Fragment>
  );
  const [openInfo, setOpenInfo] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const showUserOptions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenInfo(!openInfo);
    setAnchorEl(anchorEl !== null ? null : event.currentTarget);
  };
  let md5Email = md5(authState.user?.email || "");
  let open = Boolean(anchorEl);
  return (
    <Fragment>
      <Hidden smUp implementation="js">
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar className={classes.titleAccountDetail}>

            <Box
              className={`${anchorEl !== null ? "open" : ""} ${classes.helper} ${classes.info}`}
              onClick={showUserOptions}
            >
              <Avatar size="30" round="20px" name={authState.user?.fullName} md5Email={md5Email} maxInitials={1} />
              <Typography color="textPrimary" className={classes.userName}>
                {authState.user?.fullName}
              </Typography>
              <KeyboardArrowDownIcon className="arrow-avatar" />
            </Box>
          </Toolbar>

        </AppBar>
        <nav className={clsx(classes.drawer)} aria-label="mailbox folders">
          <Drawer
            // container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Hidden>
      <Hidden xsDown implementation="js">
        <Box
          id={"menuRoot"}
          style={{ display: menuState.isHidden ? "none" : "" }}
          className={`${classes.root} ${collapse ? "menuCollapse" : "menuExpand"}`}
        >
          <nav>
            <Box className="menuTopHeader">
              <Box className="menuTopLogo">
                <Link to={`/admin`}></Link>
                <IconButton
                  className="menuTopToogle"
                  id={"btnToggleMenu"}
                  onClick={() => updateCollapseMenuStatus(!collapse)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>
            <hr className="menuDivider" />
            <Box className="menuInnerWrapper">
              <Box className="menuPrimaryInner" id="menuPrimaryInner">
                <List component="nav" className="menuList">
                  {renderMenuItems()}
                </List>
              </Box>
            </Box>
          </nav>
        </Box>
      </Hidden>

    </Fragment>

  );
};

const mapStateToProps = (state: AppState) => ({
  authState: state.auth,
  menuState: state.menu,
});

const mapDispatchToProps = {updateCollapseMenuStatus};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Menu);
