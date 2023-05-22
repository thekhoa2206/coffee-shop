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

function ArrowBottomIcon(props: SvgIconProps) {
  const { className, ...rest } = props;
  const classes = useStyles();
  return (
    <SvgIcon
      className={clsx(classes.root, props.className)}
      {...rest}
      width="11"
      height="6"
      viewBox="0 0 11 6"
      fill="none"
    >
      <path d="M10.5645 5.5L5.53677 0.5L0.509083 5.5L10.5645 5.5Z" fill="currentColor" />
    </SvgIcon>
  );
}

export default ArrowBottomIcon;
