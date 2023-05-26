import React from "react";
import Route from "./shared/model/routing/route.model";
import MainLayoutComponent from "layout/main/MainLayout";
import { AccountRole } from "utilities/AccountRole";

const PartnersList = React.lazy(() => import("./page/Partner/customer"));

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
    path: "/customer",
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
  
];
export default MAIN_ROUTES;
