import { Box, ClickAwayListener, Fade, Paper, Popper } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { Fragment } from "react";
import styles from "./Popover.styles";
import { UserOptionPopoverProp } from "./Popover.types";

function UserOptionsPopover(props: UserOptionPopoverProp) {
  const { open, classes, anchorEl, children, width, height, right, onClose } = props;
  
  return (
    <Fragment>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="top"
        transition
        className={`${classes.popper}`}
        modifiers={{
          preventOverflow: {
            enabled: true,
            boundariesElement: "window",
          },
        }}
        style={{
          zIndex: 100000,
          marginTop: 5,
          marginRight: right === 27 ? 30 : 0,
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              style={{
                width: width ? width : "auto",
                height: height ? height : "auto",
                boxShadow: "0px 10px 20px rgba(168, 168, 168, 0.5)",
              }}
            >
              <ClickAwayListener onClickAway={onClose}>
                <Paper className={classes.popoverRoot} style={{ boxShadow: "none" }}>
                  <Box className={classes.content}>{children}</Box>
                </Paper>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Fragment>
  );
}

export default withStyles(styles)(UserOptionsPopover);
