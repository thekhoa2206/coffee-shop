import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function CircleCheckOutlineIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 20 20" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM8 12.17L14.59 5.58002L16 7.00002L8 15L4 11L5.41 9.59002L8 12.17Z"
      />
    </SvgIcon>
  );
}

export default CircleCheckOutlineIcon;
