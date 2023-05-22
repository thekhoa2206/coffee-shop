import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function UserIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 13 15">
      <path
        d="M6.78746 7.25949C8.79212 7.25949 10.4172 5.6344 10.4172 3.62975C10.4172 1.62509 8.79212 0 6.78746 0C4.78281 0 3.15771 1.62509 3.15771 3.62975C3.15771 5.6344 4.78281 7.25949 6.78746 7.25949Z"
        fill="currentColor"
      />
      <path
        d="M6.79769 8.02234C4.08318 8.02234 1.77428 9.74881 0.921449 12.1721C0.44303 13.5138 1.47267 14.9178 2.89753 14.9178H10.7082C12.1331 14.9178 13.1627 13.5138 12.6843 12.1721C11.8107 9.74881 9.5122 8.02234 6.79769 8.02234Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default UserIcon;
