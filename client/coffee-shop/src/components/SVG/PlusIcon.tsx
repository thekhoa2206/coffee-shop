import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function PlusIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.1909 0C4.58304 0 0.0317383 4.48 0.0317383 10C0.0317383 15.52 4.58304 20 10.1909 20C15.7987 20 20.35 15.52 20.35 10C20.35 4.48 15.7987 0 10.1909 0ZM9.17497 5V9H5.11131V11H9.17497V15H11.2068V11H15.2705V9H11.2068V5H9.17497ZM2.06357 10C2.06357 14.41 5.7107 18 10.1909 18C14.6711 18 18.3182 14.41 18.3182 10C18.3182 5.59 14.6711 2 10.1909 2C5.7107 2 2.06357 5.59 2.06357 10Z"
        fill="#0088FF"
      />
    </SvgIcon>
  );
}
export default PlusIcon;
