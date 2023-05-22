import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function ArrowRightIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 13 9">
      <path
        d="M12.5977 5.25L3.47016 5.25L6.15516 7.9425L5.09766 9L0.597656 4.5L5.09765 0L6.15515 1.0575L3.47016 3.75L12.5977 3.75L12.5977 5.25Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default ArrowRightIcon;
