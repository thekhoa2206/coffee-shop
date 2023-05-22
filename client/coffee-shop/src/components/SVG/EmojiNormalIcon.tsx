import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function EmojiNormalIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 50 50" fill="none">
      <path
        d="M50 25C50 38.8069 38.8069 50 25 50C11.1944 50 0 38.8069 0 25C0 11.1944 11.1944 0 25 0C38.8069 0 50 11.1944 50 25Z"
        fill="#FFCC4D"
      />
      <path
        d="M15.9722 27.7778C17.8899 27.7778 19.4444 25.6014 19.4444 22.9167C19.4444 20.2319 17.8899 18.0556 15.9722 18.0556C14.0546 18.0556 12.5 20.2319 12.5 22.9167C12.5 25.6014 14.0546 27.7778 15.9722 27.7778Z"
        fill="#664500"
      />
      <path
        d="M34.0278 27.7778C35.9454 27.7778 37.5 25.6014 37.5 22.9167C37.5 20.2319 35.9454 18.0556 34.0278 18.0556C32.1101 18.0556 30.5556 20.2319 30.5556 22.9167C30.5556 25.6014 32.1101 27.7778 34.0278 27.7778Z"
        fill="#664500"
      />
      <path
        d="M34.7222 36.1111H15.2778C14.5111 36.1111 13.8889 35.4903 13.8889 34.7222C13.8889 33.9542 14.5111 33.3333 15.2778 33.3333H34.7222C35.4903 33.3333 36.1111 33.9542 36.1111 34.7222C36.1111 35.4903 35.4903 36.1111 34.7222 36.1111Z"
        fill="#664500"
      />
    </SvgIcon>
  );
}

export default EmojiNormalIcon;
