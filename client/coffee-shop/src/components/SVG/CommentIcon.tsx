import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function CommentIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 33 32">
      <path
        d="M25.7332 4H7.06657C5.5959 4 4.3999 5.196 4.3999 6.66667V28L10.7994 23.2C11.261 22.8538 11.8225 22.6667 12.3995 22.6667H25.7332C27.2039 22.6667 28.3999 21.4707 28.3999 20V6.66667C28.3999 5.196 27.2039 4 25.7332 4ZM25.7332 20H11.5114C10.9344 20 10.3731 20.1871 9.9115 20.5332L7.06657 22.6667V6.66667H25.7332V20Z"
        fill="currentColor"
      />
      <path d="M12.3999 12H20.3999V14.6667H12.3999V12Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default CommentIcon;
