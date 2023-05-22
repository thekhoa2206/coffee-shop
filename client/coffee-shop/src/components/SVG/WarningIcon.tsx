import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function WarningIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 14 13">
      <path d="M6.33331 4.66707H7.66665V8.00041H6.33331V4.66707Z" fill="#FFCE6A" />
      <path
        d="M6.99998 8.66707C6.63179 8.66707 6.33331 8.96555 6.33331 9.33374C6.33331 9.70193 6.63179 10.0004 6.99998 10.0004C7.36817 10.0004 7.66665 9.70193 7.66665 9.33374C7.66665 8.96555 7.36817 8.66707 6.99998 8.66707Z"
        fill="#FFCE6A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.822938 12.0018C0.309383 12.0018 -0.0113234 11.4455 0.245986 11.0011L6.42302 0.331667C6.6798 -0.111856 7.32015 -0.111858 7.57692 0.331665L13.754 11.0011C14.0113 11.4455 13.6906 12.0018 13.177 12.0018H0.822938ZM12.0207 10.6684L6.99997 1.99627L1.97924 10.6684H12.0207Z"
        fill="#FFCE6A"
      />
      <path d="M6.33331 8.66707H7.66665V10.0004H6.33331V8.66707Z" fill="#FFCE6A" />
    </SvgIcon>
  );
}

export default WarningIcon;
