import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function SubItemArrowIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16" fill="none">
      <path
        d="M14.6666 3.99967H3.88659L5.60659 2.27301L4.66659 1.33301L1.33325 4.66634L4.66659 7.99967L5.60659 7.05967L3.88659 5.33301H14.6666V3.99967Z"
        fill="#A3A8AF"
      />
      <path
        d="M1.33341 12.0003H12.1134L10.3934 13.727L11.3334 14.667L14.6667 11.3337L11.3334 8.00033L10.3934 8.94033L12.1134 10.667H1.33341V12.0003Z"
        fill="#A3A8AF"
      />
    </SvgIcon>
  );
}

export default SubItemArrowIcon;
