import { Tabs as MuiTabs, withStyles } from "@material-ui/core";
import React from "react";
import styles from "./Tabs.styles";
import { TabsProps } from "./Tabs.types";


const Tabs = withStyles(styles)((props: TabsProps) => {
  return <MuiTabs indicatorColor="primary" textColor="primary" variant="scrollable" {...props} />;
});

export default Tabs;
