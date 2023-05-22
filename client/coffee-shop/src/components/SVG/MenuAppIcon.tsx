import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function MenuAppIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M13 6H15V9H18V11H15V14H13V11H10V9H13V6Z" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2H20C21.103 2 22 2.897 22 4V16C22 17.103 21.103 18 20 18H8C6.897 18 6 17.103 6 16V4C6 2.897 6.897 2 8 2ZM8 4V16H20.002L20 4H8Z"
        fill="currentColor"
      />
      <path d="M2 8H4V20H16V22H4C2.897 22 2 21.103 2 20V8Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default MenuAppIcon;
