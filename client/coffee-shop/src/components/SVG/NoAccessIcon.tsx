import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function NoAccessIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 36 36">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.46317 30.8038C3.33773 30.8038 2.63491 29.5848 3.19879 28.6108L16.7356 5.22898C17.2983 4.25701 18.7017 4.25701 19.2644 5.22898L32.8012 28.6108C33.3651 29.5848 32.6623 30.8038 31.5368 30.8038H4.46317ZM19.461 26.4178H18.0946C18.0633 26.4198 18.0318 26.4208 18 26.4208C17.9682 26.4208 17.9367 26.4198 17.9054 26.4178H16.539V23.4958H19.461V26.4178ZM19.461 20.5769H16.539V13.272H19.461V20.5769Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default NoAccessIcon;
