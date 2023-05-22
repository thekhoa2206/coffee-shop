import { Box, BoxProps, Typography } from "@material-ui/core";
import clsx from "clsx";
import useStyles from "components/SapoGridSticky/SapoGridSticky.styles";
import { BodyCell, CellTemplateProps } from "components/SapoGridSticky/SapoGridSticky.types";
import { isEqual, isNil } from "lodash";
import React, { memo, useMemo } from "react";

interface RowComponentProsp {
  bodyCells: BodyCell[];
  data: any;
  index: number;
}

const RowComponent = memo((props: RowComponentProsp) => {
  const { index, data, bodyCells } = props;
  const classes = useStyles();
  let widthFormLeft = 0;
  let countCellInRow = 0;
  const totalCellInRowsVisible = useMemo(() => bodyCells.filter((cell: BodyCell) => cell.display).length, [bodyCells]);

  return (
    <Box className={clsx("row", { nth: index % 2 === 0 })} style={{ width: "fit-content" }}>
      {bodyCells.map((col: BodyCell, cellIdx: number) => {
        if (!col.display) {
          return null;
        }
        countCellInRow++;
        const left: string = col.sticky ? `${widthFormLeft}px` : "none";
        let width = col.width || 92;
        widthFormLeft += width;
        if (totalCellInRowsVisible === countCellInRow) {
          width++;
        }
        const boxProps: BoxProps = {
          className: clsx(classes.cell, "body-cell", { sticky: col.sticky }, `col__${col.property}`),
          style: {
            ...col.style,
            left: left,
            textAlign: col.align,
            minHeight: 36,
            width: width,
            minWidth: width,
            boxShadow: col.sticky && "1px 0px #e8eaeb",
          },
        };
        const value: string = isNil(data?.[col.property]) ? "" : data[col.property].toString();
        return (
          <CellComponent
            key={`${index}-${col.property}`}
            className={boxProps.className}
            style={boxProps.style}
            value={value}
            dataItem={data}
            template={col.template}
            hidden={!col.display}
          />
        );
      })}
    </Box>
  );
});

interface CellComponentProps {
  value: string;
  hidden: boolean;
  className?: string;
  style?: React.CSSProperties;
  template?: React.ComponentType<CellTemplateProps>;
  dataItem: any;
}
const CellComponent = memo(
  (props: CellComponentProps) => {
    const { hidden, value, dataItem, className, style } = props;
    const Template = props.template;
    return (
      <div className={className} style={style} hidden={hidden}>
        {Template ? (
          <Template dataItem={dataItem} />
        ) : (
          <Typography
            noWrap
            style={{
              width: "fit-content",
              maxWidth: "100%",
              display: "inline-block",
            }}
            data-tip={isNil(value) ? "" : value}
          >
            {value}
          </Typography>
        )}
      </div>
    );
  },
  (prev, next) => {
    let _prev = { ...prev };
    _prev.template = undefined;
    let _next = { ...next };
    _next.template = undefined;
    return isEqual(_prev, _next);
  }
);
CellComponent.displayName = "CellComponent";

RowComponent.displayName = "RowComponent";
export default RowComponent;
