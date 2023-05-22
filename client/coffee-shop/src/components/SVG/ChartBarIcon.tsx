import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function ChartBarIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 19 20">
      <path d="M0 0H2V20H0V0Z" fill="currentColor" />
      <path d="M19 9V6L3 6L3 9L19 9Z" fill="currentColor" />
      <path d="M11 4V1L3 0.999999L3 4L11 4Z" fill="currentColor" />
      <path d="M16 11V14L3 14L3 11L16 11Z" fill="currentColor" />
      <path d="M13 19L13 16L3 16V19H13Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default ChartBarIcon;
