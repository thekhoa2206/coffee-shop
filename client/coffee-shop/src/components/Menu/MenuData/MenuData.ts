import UserIcon from "components/SVG/UserIcon";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMenuItems, updateStatusLoadingMenu } from "store/Menu/menuSlice";
import { AppState } from "store/store";
import { hasPermission } from "utilities";
import { AccountRole } from "utilities/AccountRole";
import {
  MenuDashboardIcon, MenuOrderIcon, AccountSettingIcon
} from "../../SVG";
import { MenuItem } from "./MenuData.types";
const useGenMenuData = () => {
  const state = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const {
    menu: { menuItems },
    auth,
  } = state;
  const genMenuDashboard = () => {
    let menu: MenuItem = {
      id: "dashboard",
      icon: MenuDashboardIcon,
      title: "Tổng quan",
      path: "/admin",
      checkIsExact: true,
      includePaths: ["", "/admin", "/admin/dashboard"],
    };
    return menu;
  };
  const genMenuOrder = () => {
    let menu: MenuItem = {
      id: "order",
      icon: MenuOrderIcon,
      title: "Đơn hàng",
      subMenus: [],
      path: "/admin/orders",
    };
    menu.subMenus = [
      {
        title: "Tạo đơn hàng",
        path: "/admin/orders/create",
        typeRoute: "default",
      },
      {
        title: "Danh sách đơn hàng",
        path: "/admin/orders",
        includePaths: ["/admin/orders/:id"],
        excludePaths: ["/admin/orders/create"],
        typeRoute: "default",
      },
    ];

    return menu;
  };
  const genMenuAccount = () => {
    let menu: MenuItem = {
      id: "account",
      icon: AccountSettingIcon,
      title: "Nhân viên",
      subMenus: [],
      path: "/admin/accounts",
    };
    menu.subMenus = [
      {
        title: "Tạo nhân viên",
        path: "/admin/accounts/create",
        typeRoute: "default",
      },
      {
        title: "Nhân viên",
        path: "/admin/accounts",
        includePaths: ["/admin/accounts/:id"],
        excludePaths: ["/admin/accounts/create"],
        typeRoute: "default",
      },
    ];

    return menu;
  };

  const genMenuPartner = () => {
    let menu: MenuItem = {
      id: "partner",
      icon: AccountSettingIcon,
      title: "Đối tác",
      subMenus: [],
      path: "/admin/partners",
    };
    menu.subMenus = [
      {
        title: "Cửa hàng",
        path: "/admin/stores",
        typeRoute: "default",
      },
      {
        title: "Khách hàng",
        path: "/admin/partners",
        typeRoute: "default",
      },
    ];
    if(!hasPermission([AccountRole.ADMIN, AccountRole.STAFF], auth.user)){
      menu.subMenus = menu.subMenus.filter((item) => item.path !== "/admin/stores");
    }
    return menu;
  };

  const genMenuInfoUser = () => {
    let menu: MenuItem = {
      id: "userInfo",
      icon: UserIcon,
      title: "Thông tin cá nhân",
      subMenus: [],
      path: "/admin/information",
    };
    return menu;
  };


  const genMenuData = () => {
    let listMenu: MenuItem[] = [];
    listMenu.push(genMenuDashboard());
    listMenu.push(genMenuOrder());
    if(hasPermission([AccountRole.ADMIN, AccountRole.STAFF], auth.user)){
      listMenu.push(genMenuAccount());
    }
    listMenu.push(genMenuPartner());
    listMenu.push(genMenuInfoUser());
    return listMenu;
  };
  const genSapoMenu = async () => {
    let menuItems: MenuItem[] = [];
    let menuItemsPrimary = genMenuData();
    menuItems.push(...menuItemsPrimary);
    dispatch(updateMenuItems(menuItems));
  };
  useEffect(() => {
    if (menuItems.length > 0) {
      dispatch(updateStatusLoadingMenu(false));
    }
  }, [menuItems]);
  useEffect(() => {
    genSapoMenu();
  },[]);
};

export default useGenMenuData;
