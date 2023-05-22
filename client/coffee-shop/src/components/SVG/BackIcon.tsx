import { createStyles, makeStyles, SvgIcon, SvgIconProps, Theme } from "@material-ui/core";
import React from "react";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: "#A3A8AF",
      width: 8,
      height: 13,
      marginRight: 13,
      cursor: "pointer",
    },
  })
);

function BackIcon(props: SvgIconProps) {
  const { className, ...rest } = props;
  const classes = useStyles();
  return (
    <SvgIcon className={clsx(classes.root, props.className)} {...rest} viewBox="0 0 8 13">
      <path
        d="M6.01041 0L0 6.01041L6.01041 12.0208L7.42462 10.6066L2.82843 6.01041L7.42462 1.41421L6.01041 0Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default BackIcon;
