import React from "react";
import { HeadCell } from "components/SapoGrid/SapoGrid.type";

interface ColGroupProps {
  columnWidths: number[];
  columnStyles?: HeadCell[];
  selectable?: boolean;
  selected?: any[];
  settingable?: boolean;
  drillDown?: boolean;
}

const ColGroup = (props: ColGroupProps) => {
  const { columnWidths, columnStyles, selectable = false, selected, settingable, drillDown } = props;
  return (
    <colgroup>
      {selectable ? (
        <col style={{ width: settingable ? 80 : 45 }} />
      ) : (
        (settingable || drillDown) && <col style={{ width: 45 }} />
      )}
      {selected && selected.length
        ? null
        : columnStyles
        ? columnStyles?.map((cell, index) => (
            <col key={index} style={{ ...cell.colStyle, width: cell.width === 0 ? "" : cell.width }} />
          ))
        : columnWidths.map((width, index) => <col key={index} style={{ width: width === 0 ? "" : width }} />)}
    </colgroup>
  );
};

export default ColGroup;
