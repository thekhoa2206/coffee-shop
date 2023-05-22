import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function LongArrowUpIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 10 20" fill="none">
      <path d="M6 20L6 3.83L8.59 6.41L10 5L5 0L0 5L1.41 6.41L4 3.83L4 20H6Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default LongArrowUpIcon;
