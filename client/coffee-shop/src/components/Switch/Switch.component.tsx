import React from "react";
import { SwitchProps } from "@material-ui/core/Switch";
import { Switch as MuiSwitch } from "@material-ui/core";


const Switch = React.forwardRef((props: SwitchProps, ref: any) => {
  return <MuiSwitch ref={ref} color="primary" size="small" {...props} />;
});

export default Switch;
