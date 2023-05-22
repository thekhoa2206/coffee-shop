import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function ExportFileIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 14 20">
      <path
        d="M6 8.74228e-08L6 12.17L2.41 8.59L1 10L7 16L13 10L11.59 8.59L8 12.17L8 0L6 8.74228e-08Z"
        fill="currentColor"
      />
      <path d="M0 18H14V20H0V18Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default ExportFileIcon;
