import { Tab as MuiTab, TabProps, withStyles } from "@material-ui/core";
import React from "react";
import styles from "./Tab.styles";


const Tab = withStyles(styles)((props: TabProps) => {
  return <MuiTab {...props} />;
});

export default Tab;
