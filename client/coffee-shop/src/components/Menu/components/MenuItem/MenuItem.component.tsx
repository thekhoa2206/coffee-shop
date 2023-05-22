import { Box, Collapse, IconButton, Link, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";
import { MenuItem as MenuItemType } from "components/Menu/MenuData/MenuData.types";
import Tooltip from "components/Tooltip/Tooltip.component";
import React, { forwardRef, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { matchPath, useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { updateCollapseMenuStatus } from "store/Menu/menuSlice";
import { AppState } from "store/store";
import { v4 as uuidv4 } from "uuid";
import useStyles from "./MenuItem.styles";
import { MenuItemProps } from "./MenuItem.types";

const MenuItem = (props: MenuItemProps) => {
  const {
    menuItem,
    level,
    menuIdOpen,
    setMenuIdOpen,
    menuState,
    hasDividerBottom,
    hasDividerTop,
    authState,
    handleEventRouteMenuItem,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [subMenuIdOpen, setSubMenuIdOpen] = useState<string>("");
  const [openMenuOnHover, setOpenMenuOnHover] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [offsetTop, setOffsetTop] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();
  const uniqueMenuId = useMemo(() => uuidv4(), []);

  useEffect(() => {
    let _isActive = _checkActiveMenuItems(menuItem);
    setIsActive(_isActive);
    if (_isActive) {
      setMenuIdOpen(uniqueMenuId);
    } else if (menuItem.subMenus && menuItem.subMenus.length > 0) {
      setSubMenuIdOpen("");
    }
    setOpenMenuOnHover(false);
  }, [location.pathname, menuItem]);

  useEffect(() => {
    if (menuState.collapse && isActive) {
      setMenuIdOpen(uniqueMenuId);
    }
  }, [menuState.collapse]);

  const checkActiveMenuItem = (menuItem: MenuItemType, pathName: string) => {
    if (pathName.startsWith("/admin/apps") && menuItem.isActive) {
      return true;
    }
    let matchWithCurrentPathName = !!matchPath(pathName, {
      path: menuItem.path,
      exact: menuItem.checkIsExact,
      strict: false,
    });
    if (matchWithCurrentPathName && menuItem.excludePaths) {
      matchWithCurrentPathName = !menuItem.excludePaths.some(
        (path: string) =>
          !!matchPath(pathName, {
            path: path,
            exact: menuItem.checkIsExact,
            strict: false,
          })
      );
    } else if (!matchWithCurrentPathName && menuItem.includePaths) {
      matchWithCurrentPathName = menuItem.includePaths.some(
        (path: string) =>
          !!matchPath(pathName, {
            path: path,
            exact: menuItem.checkIsExact,
            strict: false,
          })
      );
    }
    return matchWithCurrentPathName;
  };

  const _checkActiveMenuItems = (menuItems: MenuItemType): boolean => {
    let pathName = location.pathname;
    let isActive = checkActiveMenuItem(menuItems, pathName);
    // Nếu check ko match thì check xem menu con có match hay không nếu có => active
    if (menuItems.subMenus && menuItems.subMenus.length > 0 && !isActive) {
      for (let item of menuItems.subMenus) {
        let _isActive = _checkActiveMenuItems(item);
        if (_isActive) {
          isActive = _isActive;
          break;
        }
      }
    }
    return isActive;
  };

  const _checkingMenu = (menuItems: MenuItemType) => {
    let event_value = "";
    switch (menuItems.path) {
      case "/admin/shippings/dashboards":
        event_value = "dashboard";
        break;
      case "/admin/shipments":
        event_value = "shipment_list";
        break;
      case "/admin/delivery_collations":
        event_value = "cross_checking";
        break;
      case "/admin/shippers":
        event_value = "connect_shipping_provider";
        break;
      case "/admin/settings/shippings":
        event_value = "configure_shipping_value";
        break;
      case "/admin/apps/sapo-express/cross_checking":
      case "/admin/apps/sapo-express/delivery_customer_orders":
        event_value = "sapo_express";
        break;
      case "/admin/pos_v2":
        event_value = "pos";
        break;
      case "/admin/apps/socials-channel-staging":
        event_value = "social_channel";
        break;
      case "/admin/orders/create":
        event_value = "create_and_delivery_order";
        break;
      case "/admin/orders":
        event_value = "order_list";
        break;
      case "/admin/fulfillments":
        event_value = "fulfillment_list";
        break;
      case "/admin/order_returns":
        event_value = "return_list";
        break;
      default:
        break;
    }
    if (event_value === "" && menuItems.appAlias?.includes("socials-channel")) {
      event_value = "social_channel";
    } else if (event_value === "") return;
  };

  const renderLinkMenuItemComponent = (props: any, ref: any, item: MenuItemType, _isActive = isActive) => {
    switch (item.typeRoute) {
      case "reload":
        return (
          <Link
            {...props}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              item.onClick?.(e);
              _checkingMenu(item);
            }}
            innerRef={ref}
            href={item.path}
            target={item.linkTarget}
          />
        );
      case "event":
        return (
          <Typography
            {...props}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              handleEventRouteMenuItem(item);
              _checkingMenu(item);
              item.onClick?.(e);
            }}
            component="div"
          />
        );
      default:
        return (
          <NavLink
            {...props}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              item.onClick?.(e);
              _checkingMenu(item);
            }}
            innerRef={ref}
            isActive={() => _isActive}
          />
        );
    }
  };


  const findPositionSubMenuHover = () => {
    if (menuState.collapse) {
      let menuPrimaryInner = document.getElementById("menuPrimaryInner");
      let parentScrollY = menuPrimaryInner?.scrollTop || 0;
      setOpenMenuOnHover(true);
      if (ref !== null && ref.current !== null) {
        let heightSubMenu = menuItem.subMenus ? menuItem.subMenus.length * 42 + 47 : 0;
        let topOfSubMenu = ref.current.offsetTop - parentScrollY + 57;
        if (
          topOfSubMenu + heightSubMenu > window.innerHeight &&
          topOfSubMenu + ref.current.offsetHeight >= heightSubMenu
        ) {
          topOfSubMenu = topOfSubMenu + ref.current.offsetHeight - heightSubMenu;
        }
        setOffsetTop(topOfSubMenu);
      }
    }
  };

  return (
    <Fragment>
      {hasDividerTop && <hr className="menuDivider" />}
      {menuItem.subMenus && menuItem.subMenus.length > 0 ? (
        <Fragment>
          <ListItem
            ref={ref}
            onMouseEnter={(e) => findPositionSubMenuHover()}
            onMouseLeave={() => menuState.collapse && setOpenMenuOnHover(false)}
            disableRipple={true}
            button
            onClick={() => {
              if (!menuState.collapse) {
                if (menuIdOpen === uniqueMenuId) {
                  setMenuIdOpen("");
                } else {
                  setMenuIdOpen(uniqueMenuId);
                }
              }
            }}
            className={`rootMenuItem ${menuIdOpen === uniqueMenuId && !menuState.collapse ? "open" : ""} ${
              isActive ? "active" : ""
            }`}
            classes={{ root: classes.rootMenuItem }}
          >
            {menuItem.icon && (
              <ListItemIcon>
                <menuItem.icon />
              </ListItemIcon>
            )}

            <ListItemText primary={menuItem.title} className="menuItemTitle" />
            <ChevronRightIcon className="icon-collapse" />
            {menuState.collapse && level === 0 && (
              <Fade in={openMenuOnHover}>
                <Box className={classes.wrapperMenuListSubItemOnCollapse} top={`${offsetTop}px`}>
                  <Box className="subMenusHoverHeader">
                    <Typography>{menuItem.title}</Typography>
                    <IconButton
                      onClick={() => {
                        setOpenMenuOnHover(false);
                        dispatch(updateCollapseMenuStatus(false));
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Box className="subMenusHoverBody">
                    {React.Children.toArray(
                      menuItem.subMenus.map((item) => {
                        let _isActive = _checkActiveMenuItems(item);
                        return (
                          <ListItem
                            disableRipple
                            button
                            to={item.path ? item.path : ""}
                            className={`${_isActive ? "active" : ""}`}
                            component={forwardRef((props: any, ref: any) =>
                              renderLinkMenuItemComponent(props, ref, item, _isActive)
                            )}
                          >
                            {item.title}
                          </ListItem>
                        );
                      })
                    )}
                  </Box>
                </Box>
              </Fade>
            )}
          </ListItem>
          <Collapse
            in={menuIdOpen === uniqueMenuId && !menuState.collapse}
            timeout="auto"
            // unmountOnExit
            classes={{ wrapperInner: classes.wrapperInnerMenuListSubItem }}
          >
            <Box className={`menuListSubMenuItem menuListSubMenuItemLevel-${level}`}>
              {menuItem.subMenus &&
                React.Children.toArray(
                  menuItem.subMenus.map((subMenuItem) => (
                    <MenuItem
                      level={level + 1}
                      menuItem={subMenuItem}
                      menuIdOpen={subMenuIdOpen}
                      setMenuIdOpen={setSubMenuIdOpen as any}
                      menuState={menuState}
                      authState={authState}
                      handleEventRouteMenuItem={handleEventRouteMenuItem}
                    />
                  ))
                )}
            </Box>
          </Collapse>
        </Fragment>
      ) : (
        <Tooltip title={menuState.collapse && level === 0 ? menuItem.title : ""} placement="right" arrow={true}>
          <ListItem
            disableRipple={true}
            button
            to={menuItem.path ? menuItem.path : ""}
            classes={{ root: classes.rootMenuItem }}
            className={clsx("rootMenuItem", isActive ? "active" : "")}
            component={forwardRef((props: any, ref: any) => renderLinkMenuItemComponent(props, ref, menuItem))}
          >
            <Fragment>
              {menuItem.icon && (
                <ListItemIcon>
                  <menuItem.icon />
                </ListItemIcon>
              )}
              <ListItemText className="menuItemTitle">
                {menuItem.title}{" "}
              </ListItemText>
              {menuItem.hasSubMenu && <ChevronRightIcon className="icon-collapse" />}
            </Fragment>
          </ListItem>
        </Tooltip>
      )}
      {hasDividerBottom && <hr className="menuDivider" />}
    </Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});

export default connect(mapStateToProps)(MenuItem);
