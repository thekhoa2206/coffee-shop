import React, { ReactNode } from "react";

export interface GridGroupProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  align?: "left" | "right" | "center";
  field?: string;
  title?: string;
  disablePadding?: boolean;
}

export const GridGroup: React.FunctionComponent<GridGroupProps> = function (_: any) {
  return null;
};

GridGroup.displayName = "SapoGridGroup";

GridGroup.defaultProps = {};
