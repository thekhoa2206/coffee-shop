import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  active: any;
  value: any;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, active } = props;

  return <React.Fragment>{value === active && <>{children}</>}</React.Fragment>;
};

export default TabPanel;
