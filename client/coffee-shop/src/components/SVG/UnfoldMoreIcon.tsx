import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function UnfoldMoreIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 31">
      <path d="M17 14.5L12 9.5L7 14.5L17 14.5Z" fill="currentColor" />
      <path d="M7 16.5L12 21.5L17 16.5L7 16.5Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default UnfoldMoreIcon;
