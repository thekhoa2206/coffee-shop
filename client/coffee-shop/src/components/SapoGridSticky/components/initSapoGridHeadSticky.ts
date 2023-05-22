import { isArray } from "lodash";
import React from "react";
import { HeadCell, SettingColumns } from "../SapoGridSticky.types";

const initSapoGridHeadSticky = (childRoot: any, settingColumns?: SettingColumns): HeadCell[] => {
  const children = childRoot.props.children;
  const childrens = React.Children.toArray(children);
  const cellRoot: HeadCell[] = [];

  childrens.forEach((childRow: any) => {
    if (childRow?.type?.displayName === "SapoGridRow") {
      const children = childRow.props.children;
      const childrens = React.Children.toArray(children);
      const cellRow: HeadCell = {
        width: 0,
        rowSpan: 0,
        property: "",
      };
      const columns: HeadCell[] = [];
      childrens.forEach((childCol: any) => {
        if (childCol?.type?.displayName === "SapoGridColumn") {
          const cell: HeadCell = {
            property: childCol.props.field,
            label: childCol.props.title,
            width: childCol.props.width || 92,
            align: childCol.props.align,
            style: childCol.props.style,
            rowSpan: childCol.props.rowSpan || 1,
            classname: childCol.props.className,
            sticky: childCol.props.sticky,
          };
          if (settingColumns) {
            cell.display = settingColumns[cell.property];
          } else {
            cell.display = true;
          }
          if (isArray(childCol.props.children)) {
            cell.childrens = initSapoGridHeadSticky(childCol, settingColumns);
            cell.type = "rowSpan";
          } else {
            cell.template = childCol.props.children;
          }
          columns.push(cell);
        }
      });
      cellRow.childrens = columns;
      if (columns.length) {
        cellRow.type = "rowSpan";
      }
      cellRoot.push(cellRow);
    }
  });
  return cellRoot;
};

export default initSapoGridHeadSticky;
