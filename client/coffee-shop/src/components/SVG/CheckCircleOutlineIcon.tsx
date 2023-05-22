import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function CheckCircleOutlineIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 25 22">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.381836 11C0.381836 16.983 5.71442 21.8333 12.2925 21.8333C18.8706 21.8333 24.2032 16.983 24.2032 11C24.2032 5.01687 18.8706 0.166626 12.2925 0.166626C5.71442 0.166626 0.381836 5.01687 0.381836 11ZM22.0376 11C22.0376 15.8952 17.6746 19.8636 12.2925 19.8636C6.91043 19.8636 2.54741 15.8952 2.54741 11C2.54741 6.10471 6.91043 2.13632 12.2925 2.13632C17.6746 2.13632 22.0376 6.10471 22.0376 11Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5059 12.3349L16.8101 6.60091L18.4945 8.13298L10.5059 15.399L6.09049 11.383L7.77491 9.85091L10.5059 12.3349Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default CheckCircleOutlineIcon;
