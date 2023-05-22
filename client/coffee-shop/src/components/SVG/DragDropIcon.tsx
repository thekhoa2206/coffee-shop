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

function DragDropIcon(props: SvgIconProps) {
  const { className, ...rest } = props;
  const classes = useStyles();
  return (
    <SvgIcon className={clsx(classes.root, props.className)} {...rest} viewBox="0 0 13 20">
      <path
        d="M0 17.5C0 18.875 1.125 20 2.5 20C3.875 20 5 18.875 5 17.5C5 16.125 3.875 15 2.5 15C1.125 15 0 16.125 0 17.5ZM0 2.5C0 3.875 1.125 5 2.5 5C3.875 5 5 3.875 5 2.5C5 1.125 3.875 0 2.5 0C1.125 0 0 1.125 0 2.5ZM0 10C0 11.375 1.125 12.5 2.5 12.5C3.875 12.5 5 11.375 5 10C5 8.625 3.875 7.5 2.5 7.5C1.125 7.5 0 8.625 0 10Z"
        fill="#A3A8AF"
      />
      <path
        d="M7.30078 17.5C7.30078 18.875 8.42578 20 9.80078 20C11.1758 20 12.3008 18.875 12.3008 17.5C12.3008 16.125 11.1758 15 9.80078 15C8.42578 15 7.30078 16.125 7.30078 17.5ZM7.30078 2.5C7.30078 3.875 8.42578 5 9.80078 5C11.1758 5 12.3008 3.875 12.3008 2.5C12.3008 1.125 11.1758 0 9.80078 0C8.42578 0 7.30078 1.125 7.30078 2.5ZM7.30078 10C7.30078 11.375 8.42578 12.5 9.80078 12.5C11.1758 12.5 12.3008 11.375 12.3008 10C12.3008 8.625 11.1758 7.5 9.80078 7.5C8.42578 7.5 7.30078 8.625 7.30078 10Z"
        fill="#A3A8AF"
      />
    </SvgIcon>
  );
}

export default DragDropIcon;
