import { Box, CircularProgress as MuiCircularProgress } from "@material-ui/core";
import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStylesFacebook = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      position: "relative",
      display: "flex",
    },
    bottom: {
      color: "#eeeeee",
      position: "absolute",
    },
    top: {
      color: "#1a90ff",
      animationDuration: "550ms",
    },
    circle: {
      strokeLinecap: "round",
    },
  })
);


const CircularProgress = React.forwardRef((props: { size?: number; thickness?: number; color?: string }) => {
  const classes = useStylesFacebook();
  const { size, thickness, color } = props;
  return (
    <Box className={classes.wrapper}>
      <MuiCircularProgress
        variant="determinate"
        className={classes.bottom}
        size={size || 60}
        thickness={thickness || 4}
        value={100}
      />
      <MuiCircularProgress
        color="primary"
        style={{ color: color ? color : "" }}
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={size || 60}
        thickness={thickness || 4}
      />
    </Box>
  );
});

export default CircularProgress;
