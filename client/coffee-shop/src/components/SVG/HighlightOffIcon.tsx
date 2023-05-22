import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function HighlightOffIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 17 16">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.839844 8C0.839844 3.576 4.41584 0 8.83984 0C13.2638 0 16.8398 3.576 16.8398 8C16.8398 12.424 13.2638 16 8.83984 16C4.41584 16 0.839844 12.424 0.839844 8ZM8.83984 6.872L10.9118 4.8L12.0398 5.928L9.96784 8L12.0398 10.072L10.9118 11.2L8.83984 9.128L6.76784 11.2L5.63984 10.072L7.71184 8L5.63984 5.928L6.76784 4.8L8.83984 6.872Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default HighlightOffIcon;
