import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function SubItemArrowIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 14" fill="none">
      <path d="M0 0H2V8H12.17L9.59 5.41L11 4L16 9L11 14L9.59 12.59L12.17 10H0V0Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default SubItemArrowIcon;
