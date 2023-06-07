import React, { useEffect } from "react";
import ReactTooltip, { TooltipProps } from "react-tooltip";
import { makeStyles } from "@material-ui/styles";

const useStyles = (style?: React.CSSProperties) =>
  makeStyles({
    tooltip: {
      boxShadow:
        "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
      opacity: "1 !important",
      maxWidth: 220,
      fontWeight: 400,
      fontSize: "12px !important",
      padding: "5px 8px !important",
      overflowWrap: "break-word",
      "z-index": "2000 !important",
      ...style,
    },
  });
const ReactTooltipCustom = (
  props: TooltipProps & { style?: React.CSSProperties }
) => {
  const { style, ...remainProps } = props;
  const classes = useStyles(props.style)();
  useEffect(() => {
    ReactTooltip.rebuild();
  });
  return (
    <ReactTooltip
      effect="solid"
      type="light"
      className={classes.tooltip}
      {...remainProps}
    />
  );
};

export default ReactTooltipCustom;
