import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function CheckmarkCircleIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path fill="currentColor" d="M19 10c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
      <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2.293-10.707L9 10.586 7.707 9.293c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414l2 2c.195.195.45.293.707.293s.512-.098.707-.293l4-4c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0z" />
    </SvgIcon>
  );
}

export default CheckmarkCircleIcon;
