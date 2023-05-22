import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function ButtonCloseIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 2 24 12">
      <path
        d="M19.67,16.27l-6-6l6-6c0.94-0.94,0.94-2.46,0-3.4s-2.46-0.94-3.4,0l-6,6l-6-6c-0.94-0.94-2.46-0.94-3.4,0
	s-0.94,2.46,0,3.4l6,6l-6,6c-0.94,0.94-0.94,2.46,0,3.4c0.94,0.94,2.46,0.94,3.4,0l6-6l6,6c0.94,0.94,2.46,0.94,3.4,0
	C20.61,18.73,20.61,17.21,19.67,16.27z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default ButtonCloseIcon;
