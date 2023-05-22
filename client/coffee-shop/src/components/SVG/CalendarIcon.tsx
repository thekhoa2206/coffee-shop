import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function CalendarIcon(props: SvgIconProps & {fillColor?: string }) {
  const {fillColor} = props;
  return (
    <SvgIcon {...props} viewBox="0 0 18 20">
      <path d="M4 10H6V12H4V10Z" fill={fillColor} />
      <path d="M4 14H6V16H4V14Z" fill={fillColor} />
      <path d="M10 10H8V12H10V10Z" fill={fillColor} />
      <path d="M8 14H10V16H8V14Z" fill={fillColor} />
      <path d="M14 10H12V12H14V10Z" fill={fillColor} />
      <path d="M12 14H14V16H12V14Z" fill={fillColor} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 20H2C0.897 20 0 19.103 0 18V4C0 2.897 0.897 2 2 2H4V0H6V2H12V0H14V2H16C17.103 2 18 2.897 18 4V18C18 19.103 17.103 20 16 20ZM16.0001 6L16 4H2V6H16.0001ZM16.0003 8L16.001 18H2V8H16.0003Z"
        fill={fillColor}
      />
    </SvgIcon>
  );
}
export default CalendarIcon;
