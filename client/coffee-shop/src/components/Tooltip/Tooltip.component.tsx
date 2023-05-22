import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from "@material-ui/core";
import React from "react";
import useStyles from "./Tooltip.styles";

export interface TooltipProps extends MuiTooltipProps {
  maxWidth?: string;
}


function Tooltip(props: TooltipProps) {
  const { maxWidth, ...remainProps } = props;
  const classes = useStyles(props)();
  return <MuiTooltip {...remainProps} classes={classes} />;
}

export default React.memo(Tooltip);
