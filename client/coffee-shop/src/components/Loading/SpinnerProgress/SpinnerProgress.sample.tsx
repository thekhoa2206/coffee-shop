import React from "react";
import SpinnerProgress from "./SpinnerProgress";

const SpinnerProgressSample = () => {
  // Custom
  return (
    <SpinnerProgress>
      {(props: any) => (
        <img class="image" src="https://i.stack.imgur.com/pC1Tv.jpg" {...props} alt="" width="50" height="50" />
      )}
    </SpinnerProgress>
  );
};

export default SpinnerProgressSample;
