import { createStyles, makeStyles, SvgIcon, SvgIconProps, Theme } from "@material-ui/core";
import React from "react";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: "#A3A8AF",
      width: 13,
      height: 20,
      cursor: "pointer",
    },
  })
);

function DoubleArrowBottomIcon(props: SvgIconProps) {
  const { className, ...rest } = props;
  const classes = useStyles();
  return (
    <SvgIcon className={clsx(classes.root, props.className)} {...rest} viewBox="0 0 14 14">
      <path
        d="M7.00131 13.4244L0.990904 7.41403L2.40512 5.99982L7.00131 10.596L11.5975 5.99982L13.0117 7.41403L7.00131 13.4244Z"
        fill="currentColor"
      />
      <path
        d="M7.00131 7.99982L0.990904 1.98941L2.40512 0.575195L7.00131 5.17139L11.5975 0.575197L13.0117 1.98941L7.00131 7.99982Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default DoubleArrowBottomIcon;
