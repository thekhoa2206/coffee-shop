import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStylesFacebook = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flex: "1 1 auto",
    },
    wrapper: {
      position: "relative",
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

const LoadingAuth = () => {
  const classes = useStylesFacebook();
  return (
    <Box className={classes.root}>
      <Box className={classes.wrapper}>
        <CircularProgress variant="determinate" className={classes.bottom} size={60} thickness={4} value={100} />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          className={classes.top}
          classes={{
            circle: classes.circle,
          }}
          size={60}
          thickness={4}
        />
      </Box>
    </Box>
  );
};

export default LoadingAuth;
