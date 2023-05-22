import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function InfoCircle(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 12 12">
      <path d="M5.4 3V4.2H6.6V3H5.4Z" fill="currenColor" />
      <path d="M5.4 6.6V9H7.2V7.8H6.6V5.4H4.8V6.6H5.4Z" fill="currenColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 0C2.688 0 0 2.688 0 6C0 9.312 2.688 12 6 12C9.312 12 12 9.312 12 6C12 2.688 9.312 0 6 0ZM1.2 6C1.2 8.646 3.354 10.8 6 10.8C8.646 10.8 10.8 8.646 10.8 6C10.8 3.354 8.646 1.2 6 1.2C3.354 1.2 1.2 3.354 1.2 6Z"
        fill="currenColor"
      />
    </SvgIcon>
  );
}

export default InfoCircle;
