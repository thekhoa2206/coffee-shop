import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function TrashIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 12 15">
      <path
        d="M8 0.667969H4C3.26467 0.667969 2.66667 1.26597 2.66667 2.0013V2.66797H0V4.0013H1.33333V12.668C1.33333 13.4033 1.93133 14.0013 2.66667 14.0013H9.33333C10.0687 14.0013 10.6667 13.4033 10.6667 12.668V4.0013H12V2.66797H9.33333V2.0013C9.33333 1.26597 8.73533 0.667969 8 0.667969ZM4 2.0013H8V2.66797H4V2.0013ZM9.33333 12.668H2.66667V4.0013H9.33333V12.668Z"
        fill="currentColor"
      />
      <path d="M4 5.33464H5.33333V11.3346H4V5.33464Z" fill="currentColor" />
      <path d="M6.66667 5.33464H8V11.3346H6.66667V5.33464Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default TrashIcon;
