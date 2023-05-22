import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function BatteryIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 25 12">
      <rect opacity="0.35" x="0.833496" y="0.833008" width="21" height="10.3333" rx="2.16667" stroke="currentColor" />
      <path
        opacity="0.4"
        d="M23.3335 4V8C24.1382 7.66122 24.6615 6.87313 24.6615 6C24.6615 5.12687 24.1382 4.33878 23.3335 4Z"
        fill="currentColor"
      />
      <rect x="2.3335" y="2.33301" width="18" height="7.33333" rx="1.33333" fill="currentColor" />
    </SvgIcon>
  );
}

export default BatteryIcon;
