import React from "react";
import { SvgIcon, SvgIconProps } from "@material-ui/core";

function DotPrimaryIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 14 14">
      <circle cx="7" cy="7" r="7" fill="#E6F4FF" />
      <circle cx="7" cy="7" r="5" fill="#0088FF" />
    </SvgIcon>
  );
}

export default DotPrimaryIcon;
