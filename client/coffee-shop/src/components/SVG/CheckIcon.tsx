import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function CheckIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 11 8" fill="none">
      <path
        d="M3.94507 7.84588C3.84668 7.94476 3.71254 8 3.57321 8C3.43389 8 3.29975 7.94476 3.20136 7.84588L0.231178 4.87521C-0.0770594 4.56697 -0.0770594 4.06713 0.231178 3.75939L0.603036 3.38753C0.911274 3.07929 1.41062 3.07929 1.71886 3.38753L3.57321 5.24189L8.58393 0.231178C8.89216 -0.0770594 9.392 -0.0770594 9.69975 0.231178L10.0716 0.603036C10.3798 0.911274 10.3798 1.41111 10.0716 1.71886L3.94507 7.84588Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default CheckIcon;
