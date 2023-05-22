import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function CloseIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 20 20">
      <path
        d="M13.2223 2.03117L11.9689 0.777832L7.00005 5.74672L2.03117 0.777832L0.777832 2.03117L5.74672 7.00005L0.777832 11.9689L2.03117 13.2223L7.00005 8.25339L11.9689 13.2223L13.2223 11.9689L8.25339 7.00005L13.2223 2.03117Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}
export default CloseIcon;
