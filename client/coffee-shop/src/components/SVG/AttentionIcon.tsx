import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function AttentionIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} width="14px" height="14px" viewBox="0 0 16 16" fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0ZM7.2 12V10.4H8.8V12H7.2ZM7.2 4V8.8H8.8V4H7.2Z"
        fill="#FF4D4D"
      />
    </SvgIcon>
  );
}

export default AttentionIcon;
