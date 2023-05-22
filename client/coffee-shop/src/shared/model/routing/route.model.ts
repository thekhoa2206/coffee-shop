import React from "react";

export interface Breadcrumb {
    title: string;
    routerLink?: string;
  }
  
  export interface HeaderLink {
    title: string;
    linkTo: string;
    externalLink?: boolean;
    showNoti?: boolean;
    withSubtitle?: boolean;
  }
  export default interface Route {
    path: string | string[];
    extract?: boolean;
    component?: React.ComponentType<any>;
    breadcrumb?: Breadcrumb[];
    redirect?: string;
    authorities?: string[];
    header?: string | HeaderLink | null;
    documentTitle?: string;
  }