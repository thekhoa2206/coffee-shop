import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function AddLinkIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 20 10">
      <path
        d="M8 8V10H5C2.23858 10 0 7.76142 0 5C0 2.23858 2.23858 0 5 0H8V2H5C3.34315 2 2 3.34315 2 5C2 6.65685 3.34315 8 5 8H8Z"
        fill="currentColor"
      />
      <path
        d="M12 2V0H15C17.7614 0 20 2.23858 20 5C20 7.76142 17.7614 10 15 10H12V8H15C16.6569 8 18 6.65685 18 5C18 3.34315 16.6569 2 15 2H12Z"
        fill="currentColor"
      />
      <path d="M15 4H5V6H15V4Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default AddLinkIcon;
