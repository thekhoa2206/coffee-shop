import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function FilterIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24" fill="none">
      <path d="M21.6625 2H3V3.55518H21.6625V2Z" fill="currentColor" />
      <path
        d="M3.37329 4.48828L10.5584 11.7667C10.6517 11.8599 10.7761 11.9844 10.7761 12.1088V21.9999L13.8865 20.3203V12.1088C13.8865 11.9844 14.0109 11.8599 14.1042 11.7667L21.2893 4.48828H3.37329Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default FilterIcon;
