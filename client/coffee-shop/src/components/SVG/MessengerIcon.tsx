import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function MessengerIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M8.91 0C3.99 0 0 3.729 0 8.332C0 10.948 1.291 13.284 3.311 14.811V18L6.352 16.313C7.163 16.541 8.02 16.663 8.911 16.663C13.831 16.663 17.821 12.933 17.821 8.332C17.82 3.729 13.83 0 8.91 0ZM9.848 11.172L7.543 8.778L3.105 11.232L7.97 6.069L10.275 8.464L14.714 6.009L9.848 11.172Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default MessengerIcon;
