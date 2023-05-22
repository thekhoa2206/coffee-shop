import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function LineIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 12 2" {...props}>
      <line y1="0.506042" x2="12" y2="0.506042" stroke="#D3D5D7" />
    </SvgIcon>
  );
}
export default LineIcon;
