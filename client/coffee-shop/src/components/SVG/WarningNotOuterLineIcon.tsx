import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function WarningNotOuterLineIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 22 20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.73444 19.0021C0.964105 19.0021 0.483045 18.1677 0.86901 17.501L10.1346 1.49689C10.5197 0.831605 11.4803 0.831602 11.8654 1.49689L21.131 17.501C21.5169 18.1677 21.0359 19.0021 20.2655 19.0021H1.73444ZM12 16H11.0647C11.0433 16.0014 11.0217 16.0021 11 16.0021C10.9782 16.0021 10.9566 16.0014 10.9352 16H9.99999V14H12V16ZM12 12.0021H9.99999V7.00206H12V12.0021Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default WarningNotOuterLineIcon;
