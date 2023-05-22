import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function MenuList(props: SvgIconProps) {
  return (
    <SvgIcon {...props} width="18" height="12" viewBox="0 0 18 12" fill="none">
      <path d="M0 2V0H18V2H0Z" fill="currentColor" />
      <path d="M0 7H18V5H0V7Z" fill="currentColor" />
      <path d="M0 12H18V10H0V12Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default MenuList;
