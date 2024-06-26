import React from "react";
import Route from "./shared/model/routing/route.model";
import MainLayoutComponent from "layout/main/MainLayout";
import { AccountRole } from "utilities/AccountRole";
import UpdateReceipt from "page/Stocktaking/Receipt/Update/UpdateReceipt";
import Users from "page/Users/Users";
import { RolePermissionGroup } from "utilities/RoleGroup";

const CustomerList = React.lazy(() => import("./page/Customer"));
const IngredientList = React.lazy(() => import("./page/Ingredients"));

const ItemList = React.lazy(() => import("./page/Items"));
const CreateItem = React.lazy(() => import("./page/Items/create"));
const DetailItem = React.lazy(() => import("./page/Items/detail"));
const EditItem = React.lazy(() => import("./page/Items/update"));

const ComboList = React.lazy(() => import("./page/Combos"));
const CreateCombo = React.lazy(() => import("./page/Combos/create"));
const UpdateCombo = React.lazy(() => import("./page/Combos/update"));

const CreateOrder = React.lazy(() => import("./page/Orders/create"));
const Orders = React.lazy(() => import("./page/Orders/list"));

const OrderDetail = React.lazy(() => import("./page/Orders/detail"));
const OrderEdit = React.lazy(() => import("./page/Orders/edit"));

const receipt = React.lazy(() => import("./page/Stocktaking/Receipt/Receipt"));
const Createreceipt = React.lazy(
  () => import("./page/Stocktaking/Receipt/Create")
);
const editReceipt = React.lazy(
  () => import("./page/Stocktaking/Receipt/Update")
);
const Export = React.lazy(() => import("./page/Stocktaking/export/Export"));
const CreateExport = React.lazy(
  () => import("./page/Stocktaking/export/Create")
);
const User = React.lazy(() => import("./page/Users"));
const CreateUser = React.lazy(() => import("./page/Users/create"));
const EditUser = React.lazy(() => import("./page/Users/update"));

const ReportInventory = React.lazy(
  () => import("./page/Report/ReportInventory")
);
const ReportInventoryDetail = React.lazy(
  () => import("./page/Report/ReportInventory/detail")
);
const ReportOrder = React.lazy(() => import("./page/Report/ReportOrder"));
const ReportDashboard = React.lazy(() => import("./page/Report/ReportDashboard"));
// const Table = React.lazy(() => import("./page/Table"));
const Table = React.lazy(() => import("./page/Table/editTable"));
const Dashboard = React.lazy(() => import("./page/Dashboard"));

const ChannelPos = React.lazy(() => import("./page/ChannelPos/ChannelPos"))
export const LAYOUT_ROUTES: Route[] = [
  {
    path: "/",
    extract: true,
    redirect: "/admin",
  },
  {
    path: "/",
    extract: true,
    component: () => {
      window.location.href = `/login`;
      return null;
    },
  },
  {
    path: "/admin",
    component: MainLayoutComponent,
  },
];

let MAIN_ROUTES = (): Route[] => [
  {
    path: "/dashboard",
    extract: true,
    component: Dashboard,
    redirect: "",
    header: {
      title: `Tổng quan`,
      linkTo: "",
      showNoti: true,
    },
  },
  // {
  //   path: "/dashboard",
  //   extract: true,
  //   component: DashboardModule,
  //   header: {
  //     title: "Trang tổng quan",
  //     linkTo: "",
  //     showNoti: true,
  //   },
  // },
  {
    path: "/customers",
    component: CustomerList,
    extract: true,
    header: {
      title: "Khách hàng",
      linkTo: "",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.CUSTOMER],
  },
  {
    path: "/ingredients",
    component: IngredientList,
    extract: true,
    header: {
      title: "Nguyên liệu",
      linkTo: "",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.INGRADIENT],
  },
  {
    path: "/receipts",
    component: receipt,
    extract: true,
    header: {
      title: "Danh sách phiếu nhập kho ",
      linkTo: "",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.INVENTORY],
  },
  {
    path: "/receipts/create",
    component: Createreceipt,
    extract: true,
    header: {
      title: " Tạo phiếu Nhập kho ",
      linkTo: "/admin/receipts",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.INVENTORY],
  },
  {
    path: "/items/create",
    component: CreateItem,
    extract: true,
    header: {
      title: "Tạo mặt hàng",
      linkTo: "/admin/items",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.PRODUCT],
  },
  {
    path: "/receipts/:id/edit",
    component: UpdateReceipt,
    extract: true,
    header: {
      title: " Cập nhật phiếu nhập kho ",
      linkTo: "/admin/receipts",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.INVENTORY],
  },
  {
    path: "/exports/:id/edit",
    component: UpdateReceipt,
    extract: true,
    header: {
      title: " Cập nhật phiếu xuất kho  ",
      linkTo: "/admin/exports",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.INVENTORY],
  },
  {
    path: "/exports",
    component: Export,
    extract: true,
    header: {
      title: "Danh sách phiếu xuất kho ",
      linkTo: "",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.INVENTORY],
  },
  {
    path: "/exports/create",
    component: CreateExport,
    extract: true,
    header: {
      title: " Tạo phiếu Xuất kho ",
      linkTo: "/admin/exports",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.INVENTORY],
  },
  {
    path: "/items",
    component: ItemList,
    extract: true,
    header: {
      title: "Mặt hàng",
      linkTo: "",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.PRODUCT],
  },
  {
    path: "/items/:id",
    component: DetailItem,
    extract: true,
    header: {
      title: "Chi tiết mặt hàng",
      linkTo: "/admin/items",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.PRODUCT],
  },
  {
    path: "/items/:id/edit",
    component: EditItem,
    extract: true,
    header: {
      title: "Sửa mặt hàng",
      linkTo: "/admin/items",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.PRODUCT],
  },
  {
    path: "/combos",
    component: ComboList,
    extract: true,
    header: {
      title: "Combo",
      linkTo: "/admin/combos",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.PRODUCT],
  },
  {
    path: "/combos/create",
    component: CreateCombo,
    extract: true,
    header: {
      title: "Tạo combo",
      linkTo: "/admin/combos",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.PRODUCT],
  },
  {
    path: "/combos/:id",
    component: UpdateCombo,
    extract: true,
    header: {
      title: "edit combo",
      linkTo: "/admin/combos",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.PRODUCT],
  },

  {
    path: "/orders",
    component: Orders,
    extract: true,
    header: {
      title: "Đơn hàng",
      linkTo: "",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.ORDER],
  },
  {
    path: "/orders/create",
    component: CreateOrder,
    extract: true,
    header: {
      title: "Tạo đơn hàng",
      linkTo: "/admin/orders",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.ORDER],
  },
  {
    path: "/orders/:id",
    component: OrderDetail,
    extract: true,
    header: {
      title: "Chi tiết đơn hàng",
      linkTo: "/admin/orders",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.ORDER],
  },
  {
    path: "/orders/:id/edit",
    component: OrderEdit,
    extract: true,
    header: {
      title: "Sửa đơn hàng",
      linkTo: "/admin/orders",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.ORDER],
  },
  {
    path: "/users",
    component: Users,
    extract: true,
    header: {
      title: "Nhân viên",
      linkTo: "",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.USER],
  },
  {
    path: "/users/create",
    component: CreateUser,
    extract: true,
    header: {
      title: " Thêm mới nhân viên",
      linkTo: "/admin/users",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.USER],
  },
  {
    path: "/users/:id/edit",
    component: EditUser,
    extract: true,
    header: {
      title: " Cập nhập thông tin nhân viên",
      linkTo: "/admin/users",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.USER],
  },

  {
    path: "/report/inventory",
    component: ReportInventory,
    extract: true,
    header: {
      title: "Báo cáo kho",
      linkTo: "",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.REPORT],
  },
  {
    path: "/report/inventory/:id",
    component: ReportInventoryDetail,
    extract: true,
    header: {
      title: "Báo cáo chi tiết kho",
      linkTo: "/admin/report/inventory",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.REPORT],
  },
  {
    path: "/report/order",
    component: ReportOrder,
    extract: true,
    header: {
      title: "Báo cáo đơn hàng",
      linkTo: "",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.REPORT],
  },
  {
    path: "/table",
    component: Table,
    extract: true,
    header: {
      title: "Danh sách bàn",
      linkTo: "",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.REPORT],
  },
  // {
  //   path: "/table/edit",
  //   component: EditTable,
  //   extract: true,
  //   header: {
  //     title: "Danh sách bàn",
  //     linkTo: "/admin/table",
  //     showNoti: false,
  //     withSubtitle: false,
  //   },
  //   authorities: [RolePermissionGroup.REPORT],
  // },
  {
    path: "/pos",
    component: ChannelPos,
    extract: true,
    header: {
      title: "Bán hàng",
      linkTo: "/admin/pos",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.POS],
  },
  {
    path: "/report/dashboard",
    component: ReportDashboard,
    extract: true,
    header: {
      title: "Tổng quan báo cáo",
      linkTo: "/admin/report/dashboard",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [RolePermissionGroup.REPORT],
  }
];
export default MAIN_ROUTES;
