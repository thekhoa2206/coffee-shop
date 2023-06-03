import React from "react";
import Route from "./shared/model/routing/route.model";
import MainLayoutComponent from "layout/main/MainLayout";
import { AccountRole } from "utilities/AccountRole";

const CustomerList = React.lazy(() => import("./page/Customer"));
const IngredientList = React.lazy(() => import("./page/Ingredients"));
const ItemList = React.lazy(() => import("./page/Items"));
const CreateItem = React.lazy(() => import("./page/Items/create"));
const DetailItem = React.lazy(() => import("./page/Items/detail"));
const EditItem = React.lazy(() => import("./page/Items/update"));

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
    path: "/customers",
    component: CustomerList,
    extract: true,
    header: {
      title: "Khách hàng",
      linkTo: "/admin/customers",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [AccountRole.ADMIN],
  },
  {
    path: "/ingredients",
    component: IngredientList,
    extract: true,
    header: {
      title: "Nguyên liệu",
      linkTo: "/admin/ingredients",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [AccountRole.ADMIN],
  },
  {
    path: "/items",
    component: ItemList,
    extract: true,
    header: {
      title: "Mặt hàng",
      linkTo: "/admin/items",
      showNoti: false,
      withSubtitle: false,
    },
    authorities: [AccountRole.ADMIN],
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
    authorities: [AccountRole.ADMIN],
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
    authorities: [AccountRole.ADMIN],
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
    authorities: [AccountRole.ADMIN],
  },
];
export default MAIN_ROUTES;
