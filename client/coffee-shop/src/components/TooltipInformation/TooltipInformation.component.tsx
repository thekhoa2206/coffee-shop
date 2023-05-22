import { IconButton, TooltipProps } from "@material-ui/core";
import { InfoCircle } from "components/SVG";
import Tooltip from "components/Tooltip";
import React from "react";

type TooltipInformationProps = Omit<TooltipProps, "children"> & {
  style?: React.CSSProperties;
  maxWidth?: string;
};

function TooltipInformation(props: TooltipInformationProps) {
  const { classes, style } = props;

  return (
    <Tooltip classes={classes} {...props} arrow>
      <IconButton style={{ padding: 0, marginLeft: 6, ...style }}>
        <InfoCircle
          style={{
            width: 12,
            height: 12,
            cursor: "pointer",
          }}
          color="primary"
        />
      </IconButton>
    </Tooltip>
  );
}

export default TooltipInformation;
