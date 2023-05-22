import React from "react";
import Route from "./shared/model/routing/route.model";
import MainLayoutComponent from "layout/main/MainLayout";
import { AccountRole } from "utilities/AccountRole";

const DashboardModule = React.lazy(() => import("./page/Dashboard"));
const AccountModule = React.lazy(() => import("./page/Account"));
const AccountDetailModule = React.lazy(() => import("./page/Account/detail"));
const CreateAccountModule = React.lazy(() => import("./page/Account/create"));
const RoleModule = React.lazy(() => import("./page/Account/Role"));
const CreateOrderModule = React.lazy(() => import("./page/Order/create"));
const OrderModule = React.lazy(() => import("./page/Order/list"));
const OrderDetailModule = React.lazy(() => import("./page/Order/detail"));
const OrderEditModule = React.lazy(() => import("./page/Order/edit"));
const PartnersList = React.lazy(() => import("./page/Partner/customer"));
const StoreList = React.lazy(() => import("./page/Partner/listStore"));
const DetailStoreModule = React.lazy(() => import("./page/Partner/detailStore"));
const CreateStoreModule = React.lazy(() => import("./page/Partner/createStore"));
const InfomationModule = React.lazy(() => import("./page/Information"));

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
  }
];

let MAIN_ROUTES = (): Route[] => [
  {
    path: "/",
    extract: true,
    redirect: "/admin/dashboard",
    header: {
      title: `Tổng quan`,
      linkTo: "",
      showNoti: true,
    },
  },
  {
    path: "/dashboard",
    extract: true,
    component: DashboardModule,
    header: {
      title: "Trang tổng quan",
      linkTo: "",
      showNoti: true,
    },
  },
  {
    path: "/accounts",
    component: AccountModule,
    extract: true,
    header: {
      title: "Nhân viên",
      linkTo: "/admin/accounts",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [AccountRole.ADMIN, AccountRole.STAFF],
  },
  {
    path: "/accounts/create",
    component: CreateAccountModule,
    extract: true,
    authorities: [AccountRole.ADMIN],
  },
  {
    path: "/accounts/:id",
    component: AccountDetailModule,
    extract: true,
    authorities: [AccountRole.ADMIN],
  },
  {
    path: "/orders",
    component: OrderModule,
    extract: true,
    header: {
      title: "Đơn hàng",
      linkTo: "/admin/orders",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [AccountRole.ADMIN, AccountRole.CUSTOMER, AccountRole.STAFF,  AccountRole.SHIPPER],
  },
  {
    path: "/orders/create",
    component: CreateOrderModule,
    extract: true,
    authorities: [AccountRole.ADMIN, AccountRole.CUSTOMER],
  },
  {
    path: "/orders/:id",
    component: OrderDetailModule,
    extract: true,
    authorities: [AccountRole.ADMIN, AccountRole.CUSTOMER, AccountRole.STAFF,  AccountRole.SHIPPER],
  },
  {
    path: "/orders/:id/edit",
    component: OrderEditModule,
    extract: true,
    authorities: [AccountRole.ADMIN, AccountRole.CUSTOMER, AccountRole.STAFF],
  },
  {
    path: "/partners",
    component: PartnersList,
    extract: true,
    header: {
      title: "Khách hàng",
      linkTo: "/admin/partners",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [AccountRole.ADMIN, AccountRole.STAFF],
  },
  {
    path: "/stores",
    component: StoreList,
    extract: true,
    header: {
      title: "Cửa hàng",
      linkTo: "/admin/stores",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [AccountRole.ADMIN, AccountRole.STAFF],
  },
  {
    path: "/stores/create",
    component: CreateStoreModule,
    extract: true,
    authorities: [AccountRole.ADMIN],
  },
  {
    path: "/stores/:id",
    component: DetailStoreModule,
    extract: true,
    authorities: [AccountRole.ADMIN,  AccountRole.STAFF],
  },
  {
    path: "/information",
    component: InfomationModule,
    extract: true,
    authorities: [AccountRole.ADMIN, AccountRole.STAFF,  AccountRole.CUSTOMER,  AccountRole.SHIPPER],
  },
];
export default MAIN_ROUTES;
