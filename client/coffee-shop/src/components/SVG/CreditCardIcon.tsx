import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function CreditCardIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 20 16">
      <path
        d="M18 0H2C0.897 0 0 0.897 0 2V14C0 15.103 0.897 16 2 16H18C19.103 16 20 15.103 20 14V2C20 0.897 19.103 0 18 0ZM2 2H18V4H2V2ZM2 14V8H18.001L18.002 14H2Z"
        fill="currentColor"
      />
      <path d="M4 10H11V12H4V10Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default CreditCardIcon;
