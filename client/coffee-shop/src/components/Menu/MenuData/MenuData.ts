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

  const genMenuCustomer = () => {
    let menu: MenuItem = {
      id: "customer",
      icon: AccountSettingIcon,
      title: "Khách hàng",
      subMenus: [],
      path: "/admin/customers",
    };
    menu.subMenus = [
      {
        title: "Khách hàng",
        path: "/admin/customers",
        typeRoute: "default",
      },
    ];
    return menu;
  };

  const genMenuProduct = () => {
    let menu: MenuItem = {
      id: "product",
      icon: AccountSettingIcon,
      title: "Mặt hàng",
      subMenus: [],
      path: "/admin/items",
    };
    menu.subMenus = [
      {
        title: "Mặt hàng",
        path: "/admin/items",
        typeRoute: "default",
      },
      {
        title: "Nguyên liệu",
        path: "/admin/ingredients",
        typeRoute: "default",
      },
      {
        title: "Quản lý kho",
        path: "/admin/inventory",
        typeRoute: "default",
      },
    ];
    return menu;
  };

  const genMenuData = () => {
    let listMenu: MenuItem[] = [];
    listMenu.push(genMenuDashboard());
    listMenu.push(genMenuCustomer());
    listMenu.push(genMenuProduct())
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
