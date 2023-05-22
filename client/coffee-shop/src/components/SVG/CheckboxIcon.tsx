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

interface CheckboxProps extends SvgIconProps {
  state: number;
}

function CheckboxIcon(props: CheckboxProps) {
  const { state, className, ...rest } = props;
  const classes = useStyles();
  return (
    <SvgIcon className={clsx(classes.root, props.className)} {...rest} viewBox="0 0 15 14">
      <path
        d="M2.03842 0C0.92931 0 0.0273438 0.897 0.0273438 2V12C0.0273438 13.103 0.92931 14 2.03842 14H12.0938C13.2029 14 14.1049 13.103 14.1049 12V2C14.1049 0.897 13.2029 0 12.0938 0H2.03842ZM2.03842 12V2H12.0938L12.0958 12H2.03842Z"
        fill="currentColor"
      />
      {state === 2 ? (
        <path
          d="M5.996 7.556L4.7 6.285L3.3 7.715L6.004 10.362L10.703 5.711L9.297 4.289L5.996 7.556Z"
          fill="currentColor"
        />
      ) : state === 1 ? (
        <rect x="4.0498" y="6" width="6.03322" height="2" fill="currentColor" />
      ) : null}
    </SvgIcon>
  );
}

export default CheckboxIcon;
