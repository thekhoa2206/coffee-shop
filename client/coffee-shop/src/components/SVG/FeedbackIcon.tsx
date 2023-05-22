import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function FeedbackIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 14">
      <path
        d="M8 14C5.10929 11.4904 0 8.36868 0 4.19619C0 1.84632 1.936 0 4.4 0C5.792 0 7.128 0.578989 8 1.55556C8.872 0.578989 10.208 0 11.6 0C14.064 0 16 1.84632 16 4.19619C16 8.36185 10.8971 11.5039 8 14Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default FeedbackIcon;
