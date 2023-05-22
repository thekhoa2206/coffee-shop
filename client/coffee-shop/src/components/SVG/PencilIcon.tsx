import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function PencilIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 13 14">
      <path
        d="M7.90015 3.09985L0.176821 10.8232L0.00963146 12.6623C-0.0289654 13.0868 0.326719 13.4425 0.751285 13.4039L2.59037 13.2367L10.3137 5.51339L7.90015 3.09985Z"
        fill="currentColor"
      />
      <path
        d="M10.7964 5.03068L12.2445 3.58255C12.5111 3.31595 12.5111 2.88372 12.2445 2.61713L10.7964 1.169C10.5298 0.902408 10.0976 0.902408 9.831 1.169L8.38286 2.61714L10.7964 5.03068Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default PencilIcon;
