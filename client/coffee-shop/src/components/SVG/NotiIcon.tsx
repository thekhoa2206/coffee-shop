import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function NotiIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 21 26">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.2 11.05C18.2 7.059 16.718 3.718 13 2.834V0H7.8V2.834C4.069 3.718 2.6 7.046 2.6 11.05L2.6 18.2L0 19.5V22.1H20.8V19.5L18.2 18.2L18.2 11.05ZM10.92 25.948C10.751 25.987 10.582 26 10.4 26C8.95701 26 7.80001 24.83 7.78701 23.4H12.987C12.987 23.764 12.922 24.102 12.792 24.414C12.454 25.194 11.765 25.766 10.92 25.948Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default NotiIcon;
