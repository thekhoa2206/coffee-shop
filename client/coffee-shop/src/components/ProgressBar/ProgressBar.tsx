import React, { useEffect, useState } from "react";
import { Box, LinearProgress, LinearProgressProps } from "@material-ui/core";
import { ApplicationState } from "store/App/types";
import { AppState } from "store/store";
import { connect } from "react-redux";

export interface ProgressBarProps extends LinearProgressProps {
  applicationState: ApplicationState;
}

const ProgressBar = (props: ProgressBarProps) => {
  const { applicationState, ...remainProps } = props;
  const [progressLoading, setProgessLoading] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [progress, setProgess] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (applicationState.loadingPage) {
      if (progress) clearInterval(progress);
      setShowProgress(false);
      let timer = showProgressLoading();
      setProgess(timer);
    } else {
      if (progress) {
        setProgessLoading(100);
        hiddenProgress(progress);
      }
    }
  }, [applicationState.loadingPage]);

  const hiddenProgress = (timer: NodeJS.Timeout) => {
    setTimeout(() => {
      setShowProgress(false);
      clearInterval(timer);
      setProgessLoading(0);
      setProgess(undefined);
    }, 1000);
  };

  const showProgressLoading = () => {
    setShowProgress(true);
    const timer = setInterval(() => {
      setProgessLoading((oldProgress) => {
        let diff = 15;
        if (oldProgress >= 100) {
          hiddenProgress(timer);
        }
        if (oldProgress > 30) diff = 10;
        if (oldProgress > 50) diff = 5;
        if (oldProgress > 70) diff = 3;
        if (oldProgress > 80) diff = 1;
        return Math.min(oldProgress + diff, 100);
      });
    }, 250);
    return timer;
  };
  return (
    <Box
      position={"sticky"}
      width={"100%"}
      display={showProgress ? "block" : "none"}
      height={"0px"}
      top={"0"}
      zIndex={"9999999"}
    >
      <LinearProgress
        variant={remainProps.variant ? remainProps.variant : "determinate"}
        value={progressLoading}
        {...remainProps}
      />
    </Box>
  );
};

const mapStateToProps = (appState: AppState) => ({
  applicationState: appState.application,
});

export default connect(mapStateToProps, {})(ProgressBar);
