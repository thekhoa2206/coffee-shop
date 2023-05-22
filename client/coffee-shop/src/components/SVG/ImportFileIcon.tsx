import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function ImportFileIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 14 20">
      <path
        d="M8.00003 16L8.00003 3.83001L11.59 7.41001L13 6.00001L7.00003 1.29539e-06L1.00002 6.00001L2.41002 7.41001L6.00002 3.83001L6.00002 9.91501L6.00002 16L8.00003 16Z"
        fill="currentColor"
      />
      <path d="M14 20L1.90735e-06 20L2.08219e-06 18L14 18L14 20Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default ImportFileIcon;
