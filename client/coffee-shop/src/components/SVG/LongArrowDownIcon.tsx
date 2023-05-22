import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function LongArrowDownIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 10 20" fill="none">
      <path
        d="M4 8.74227e-08L4 16.17L1.41 13.59L0 15L5 20L10 15L8.59 13.59L6 16.17L6 0L4 8.74227e-08Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default LongArrowDownIcon;
