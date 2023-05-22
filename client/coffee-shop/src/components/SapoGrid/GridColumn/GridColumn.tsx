import React from "react";
import GridColumnProps from "./GridColumn.type";

export const GridColumn: React.FunctionComponent<GridColumnProps> = function (_: any) {
  return null;
};

GridColumn.displayName = "SapoGridColumn";

GridColumn.defaultProps = {
  sortable: false,
};
