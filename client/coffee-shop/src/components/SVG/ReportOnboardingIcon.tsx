import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function ReportOnboardingIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7 28C5.34315 28 4 26.6569 4 25V7C4 5.34315 5.34315 4 7 4H25C26.6569 4 28 5.34315 28 7V25C28 26.6569 26.6569 28 25 28H7ZM12.0003 13.1429H8.57169V23.4286H12.0003V13.1429ZM14.2856 8.57135H17.7142V23.4285H14.2856V8.57135ZM23.4288 12.0001H20.0002V23.4287H23.4288V12.0001Z"
        fill="#F3F4F5"
      />
    </SvgIcon>
  );
}

export default ReportOnboardingIcon;
