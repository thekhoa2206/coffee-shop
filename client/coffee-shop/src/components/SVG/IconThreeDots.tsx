import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function IconThreeDots(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 4">
      <path d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0Z" fill="currentColor" />
      <path
        d="M14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0Z"
        fill="currentColor"
      />
      <path d="M6 2C6 0.9 6.9 0 8 0C9.1 0 10 0.9 10 2C10 3.1 9.1 4 8 4C6.9 4 6 3.1 6 2Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default IconThreeDots;
