import UserIcon from "components/SVG/UserIcon";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMenuItems, updateStatusLoadingMenu } from "store/Menu/menuSlice";
import { AppState } from "store/store";
import { hasPermission } from "utilities";
import { AccountRole } from "utilities/AccountRole";
import {
  MenuDashboardIcon,
  MenuOrderIcon,
  AccountSettingIcon,
  MenuProductIcon,
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
  const genMenuUser= () => {
    let menu: MenuItem = {
      id: "user",
      icon: MenuProductIcon,
      title: "Nhân viên",
      path: "/admin/users",
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
      icon: MenuProductIcon,
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
        title: "Combo",
        path: "/admin/combos",
        typeRoute: "default",
      },
    ];
    return menu;
  };
  const genMenuInventory = () => {
    let menu: MenuItem = {
      id: "inventory",
      icon: MenuProductIcon,
      title: "Kho hàng",
      subMenus: [],
      path: "/admin/ingredients",
    };
    menu.subMenus = [
      {
        title: "Nguyên liệu",
        path: "/admin/ingredients",
        typeRoute: "default",
      },
      {
        title: "Nhập kho",
        path: "/admin/receipts",
        typeRoute: "default",
      },
      {
        title: "Xuất kho",
        path: "/admin/exports",
        typeRoute: "default",
      },
    ];
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
        title: "Đơn hàng",
        path: "/admin/orders",
        typeRoute: "default",
      },
    ];
    return menu;
  };

  const genMenuData = () => {
    let listMenu: MenuItem[] = [];
    listMenu.push(genMenuDashboard());
    listMenu.push(genMenuOrder());
    listMenu.push(genMenuCustomer());
    listMenu.push(genMenuProduct());
    listMenu.push(genMenuInventory());
    listMenu.push(genMenuUser());
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
  }, []);
};

export default useGenMenuData;
