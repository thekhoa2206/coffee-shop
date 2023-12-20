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
  MenuReportIcon,
  MenuCustomerIcon,
} from "../../SVG";
import { MenuItem } from "./MenuData.types";
import { RolePermissionGroup } from "utilities/RoleGroup";

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
      path: "/admin/dashboard",
      checkIsExact: true,
      includePaths: ["", "/admin", "/admin/dashboard"],
    };
    return menu;
  };
  const genMenuUser= () => {
    let menu: MenuItem = {
      id: "user",
      icon: MenuCustomerIcon,
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
      path: "/admin/customers",
    };
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
  const genMenuReport = () => {
    let menu: MenuItem = {
      id: "report",
      icon: MenuReportIcon,
      title: "Báo cáo",
      subMenus: [],
      path: "/admin/report",
    };
    menu.subMenus = [
      {
        title: "Báo cáo kho",
        path: "/admin/report/inventory",
        typeRoute: "default",
      },
      {
        title: "Báo cáo đơn hàng",
        path: "/admin/report/order",
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
      path: "/admin/orders",
    };
    return menu;
  };
  const genTable = () => {
    let menu: MenuItem = {
      id: "table",
      icon: MenuOrderIcon,
      title: "Bàn",
      path: "/admin/table",
    };
    return menu;
  };

  const genPos = () => {
    let menu: MenuItem = {
      id: "channel-pos",
      icon: MenuOrderIcon,
      title: "Bán hàng",
      path: "/admin/pos",
    };
    return menu;
  };
  const genMenuData = () => {
    let listMenu: MenuItem[] = [];
    listMenu.push(genMenuDashboard());
    if(hasPermission([RolePermissionGroup.ORDER], auth.user))  listMenu.push(genMenuOrder());
    //if(hasPermission([RolePermissionGroup.CUSTOMER], auth.user))  listMenu.push(genMenuCustomer());
    if(hasPermission([RolePermissionGroup.PRODUCT], auth.user))  listMenu.push(genMenuProduct());
    if(hasPermission([RolePermissionGroup.INVENTORY, RolePermissionGroup.INGRADIENT], auth.user))  listMenu.push(genMenuInventory());
    if(hasPermission([RolePermissionGroup.USER], auth.user))  listMenu.push(genMenuUser());
    if(hasPermission([RolePermissionGroup.REPORT], auth.user)) listMenu.push(genMenuReport());
    if(hasPermission([RolePermissionGroup.REPORT], auth.user)) listMenu.push(genTable());
    if(hasPermission([RolePermissionGroup.POS], auth.user)) listMenu.push(genPos());
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
