import React from "react";
import {
  Box,
  ClickAwayListener,
  Grow,
  Paper,
  Popper as MuiPopper,
  PopperProps as MuiPopperProps,
  Theme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => {
  return {
    popper: {
      '&[x-placement*="bottom"] $arrow': {
        top: 0,
        left: 0,
        marginTop: "-0.71em",
        marginLeft: 4,
        marginRight: 4,
        "&::before": {
          transformOrigin: "0 100%",
        },
      },
      '&[x-placement*="top"] $arrow': {
        bottom: 0,
        left: 0,
        marginBottom: "-0.71em",
        marginLeft: 4,
        marginRight: 4,
        "&::before": {
          transformOrigin: "100% 0",
        },
      },
      '&[x-placement*="right"] $arrow': {
        left: 0,
        marginLeft: "-0.71em",
        height: "1em",
        width: "0.71em",
        marginTop: 4,
        marginBottom: 4,
        "&::before": {
          transformOrigin: "100% 100%",
        },
      },
      '&[x-placement*="left"] $arrow': {
        right: 0,
        marginRight: "-0.71em",
        height: "1em",
        width: "0.71em",
        marginTop: 4,
        marginBottom: 4,
        "&::before": {
          transformOrigin: "0 0",
        },
      },
    },
    arrow: {
      overflow: "hidden",
      position: "absolute",
      width: "1em",
      height: "0.71em",
      boxSizing: "border-box",
      color: "#fff",
      "&::before": {
        content: '""',
        margin: "auto",
        display: "block",
        width: "100%",
        height: "100%",
        boxShadow: theme.shadows[2],
        backgroundColor: "currentColor",
        transform: "rotate(45deg)",
      },
    },
  };
});

interface PopperProps extends MuiPopperProps {
  onClose: (event: React.MouseEvent<Document, MouseEvent>) => void;
  arrow?: boolean;
  timeout?: number;
}

const Popper = (props: PopperProps) => {
  const { onClose, children, arrow, timeout, ...remainProps } = props;
  const classes = useStyles();
  const [arrowRef, setArrowRef] = React.useState<HTMLElement | null>(null);
  return (
    <MuiPopper
      disablePortal={true}
      placement="bottom"
      className={classes.popper}
      transition
      modifiers={{
        flip: {
          enabled: true,
        },
        preventOverflow: {
          enabled: true,
          boundariesElement: "scrollParent",
          padding: 20,
        },
        offset: {
          offset: "0, 5",
        },
        arrow: {
          enabled: true,
          element: arrowRef,
        },
      }}
      {...remainProps}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          timeout={timeout}
          style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}
        >
          <Paper elevation={3} style={{ borderRadius: 3, overflow: "hidden" }}>
            {arrow ? <span className={classes.arrow} ref={setArrowRef} /> : null}
            <ClickAwayListener onClickAway={onClose}>
              <Box width="100%" height="100%">
                {children}
              </Box>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </MuiPopper>
  );
};

export default Popper;
