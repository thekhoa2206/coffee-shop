import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function ArrowLeftIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 13 9">
      <path
        d="M0.597656 5.25L9.72516 5.25L7.04016 7.9425L8.09766 9L12.5977 4.5L8.09766 0L7.04016 1.0575L9.72516 3.75L0.597656 3.75L0.597656 5.25Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default ArrowLeftIcon;
