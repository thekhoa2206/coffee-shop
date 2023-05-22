import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function MenuList(props: SvgIconProps) {
  return (
    <SvgIcon {...props} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M8 14H14V8H8V14Z" fill="currentColor" />
      <path d="M0 14H6V8H0V14Z" fill="currentColor" />
      <path d="M8 6H14V0H8V6Z" fill="currentColor" />
      <path d="M0 6H6V0H0V6Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default MenuList;
