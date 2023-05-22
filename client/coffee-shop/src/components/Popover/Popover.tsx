import React, { memo } from "react";
import { Popover as MuiPopover, PopoverProps as MuiPopperProps } from "@material-ui/core";

interface PopoverProps extends MuiPopperProps {}

const Popover = (props: PopoverProps) => {
  const { PaperProps, ...remainProps } = props;
  return (
    <MuiPopover
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      disablePortal={true}
      PaperProps={{ style: { marginTop: "5px" }, ...PaperProps }}
      {...remainProps}
    />
  );
};
export default memo(Popover);
