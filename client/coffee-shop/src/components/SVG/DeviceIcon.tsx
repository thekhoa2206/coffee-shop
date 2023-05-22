import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function DeviceIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.50016 15V15.8333H5.8335V17.5H14.1668V15.8333H12.5002V15H17.5002C18.4206 15 19.1668 14.2538 19.1668 13.3333V4.16667C19.1668 3.24619 18.4206 2.5 17.5002 2.5H2.50016C1.57969 2.5 0.833496 3.24619 0.833496 4.16667V13.3333C0.833496 14.2538 1.57969 15 2.50016 15H7.50016ZM17.5002 13.3333H2.50016V4.16667H17.5002V13.3333Z"
        fill="#0088FF"
      />
    </SvgIcon>
  );
}

export default DeviceIcon;
