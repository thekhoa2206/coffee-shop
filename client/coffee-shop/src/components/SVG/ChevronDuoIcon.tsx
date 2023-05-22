import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function ChevronDuoIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 13 14">
      <path
        d="M6.42459 13.4342L0.414183 7.4238L1.8284 6.00958L6.42459 10.6058L11.0208 6.00958L12.435 7.4238L6.42459 13.4342Z"
        fill="#currentColor"
      />
      <path
        d="M6.42459 8.00958L0.414183 1.99917L1.8284 0.584961L6.42459 5.18116L11.0208 0.584963L12.435 1.99918L6.42459 8.00958Z"
        fill="#currentColor"
      />
    </SvgIcon>
  );
}

export default ChevronDuoIcon;
