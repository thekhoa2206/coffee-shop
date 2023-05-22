import GridColumnProps from "./GridColumn.type";
import React from "react";

export const GridColumn: React.FunctionComponent<GridColumnProps> = function (_: any) {
  return null;
};

GridColumn.displayName = "SapoGridColumn";

GridColumn.defaultProps = {
  sortable: true,
};
