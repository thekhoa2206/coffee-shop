import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function SearchIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 17 17">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.891 9.47687C12.5609 7.13367 12.3448 3.85958 10.2426 1.75736C7.89942 -0.585787 4.10043 -0.585786 1.75728 1.75736C-0.585863 4.1005 -0.585863 7.89949 1.75728 10.2426C3.85951 12.3449 7.13359 12.561 9.4768 10.8911L15.1923 16.6066L16.6065 15.1924L10.891 9.47687ZM8.82835 3.17157C10.3904 4.73367 10.3904 7.26633 8.82835 8.82843C7.26625 10.3905 4.73359 10.3905 3.1715 8.82843C1.6094 7.26633 1.6094 4.73367 3.1715 3.17157C4.73359 1.60948 7.26625 1.60948 8.82835 3.17157Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default SearchIcon;
