import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function PartialStatusIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM10 18C5.589 18 2 14.411 2 10C2 5.589 5.589 2 10 2V18Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}
export default PartialStatusIcon;
