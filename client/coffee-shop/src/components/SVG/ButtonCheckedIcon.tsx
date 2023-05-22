import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function ButtonCheckedIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M1 23.5911L21.9645 1V16.5322C21.9645 20.4307 19.0317 23.5911 15.4139 23.5911H1Z" fill="currentColor" />
      <path
        d="M13.1347 19.0351L11.2841 17.1669C11.0291 16.9094 10.6172 16.9094 10.3622 17.1669C10.1071 17.4244 10.1071 17.8403 10.3622 18.0976L12.9058 20.6658C13.0366 20.7978 13.2393 20.7978 13.3701 20.6658L19.1504 14.8299C19.4055 14.5724 19.4055 14.1565 19.1504 13.899C18.8955 13.6416 18.4835 13.6416 18.2285 13.899L13.1347 19.0351Z"
        fill="white"
      />
    </SvgIcon>
  );
}

export default ButtonCheckedIcon;
