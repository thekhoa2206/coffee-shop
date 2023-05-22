import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function DoubleArrowRightIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 14 14">
      <path
        d="M13.4246 7L7.41421 13.0104L6 11.5962L10.5962 7L6 2.40381L7.41422 0.989594L13.4246 7Z"
        fill="currentColor"
      />
      <path
        d="M8 7L1.98959 13.0104L0.575378 11.5962L5.17157 7L0.57538 2.40381L1.98959 0.989594L8 7Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default DoubleArrowRightIcon;
