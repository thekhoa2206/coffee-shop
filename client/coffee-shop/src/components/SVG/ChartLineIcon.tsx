import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function ChartLineIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 18 18">
      <path d="M0 0V17C0 17.553 0.447 18 1 18H18V16H2V0H0Z" fill="currentColor" />
      <path
        d="M11.7702 11.0984C12.15 11.4702 12.7638 11.4702 13.1436 11.0984L18 6.34443L16.6266 5L12.4569 9.08177L10.2298 6.90159C9.85001 6.52983 9.23616 6.52983 8.85639 6.90159L4 11.6556L5.37339 13L9.54308 8.91823L11.7702 11.0984Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default ChartLineIcon;
