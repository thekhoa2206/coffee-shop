import React from "react";
import { GridCellsProps } from "./GridCells.type";
import { TableCell, Typography } from "@material-ui/core";
import clsx from "clsx";
import useStyles from "../Cell/GridCells.style";

const GridCells = (props: GridCellsProps) => {
  const { headCells, row, onRowClick, onMouseRowEnter, onMouseRowLeave, hasDrillDown } = props;
  const classes = useStyles();
  return (
    <>
      {headCells.map((headCell, index) => {
        if (headCell.display) {
          if (headCell.template) {
            const CellTemplate = headCell.template;

            return (
              <TableCell
                onClick={(e: any) => onRowClick && onRowClick(e, row)}
                align={headCell.align || "left"}
                key={index}
                className={classes.cell}
                style={{
                  ...headCell.style,
                  borderBottom: `${hasDrillDown && row.tableDrillDown === true ? "none" : ""}`,
                }}
                onMouseEnter={(e: any) => onMouseRowEnter?.(e, row, headCell.property)}
                onMouseLeave={(e: any) => onMouseRowLeave?.(e, row, headCell.property)}
              >
                <CellTemplate dataItem={row} />
              </TableCell>
            );
          }

          return (
            <TableCell
              onClick={(e: any) => onRowClick && onRowClick(e, row)}
              onMouseEnter={(e: any) => onMouseRowEnter?.(e, row, headCell.property)}
              onMouseLeave={(e: any) => onMouseRowLeave?.(e, row, headCell.property)}
              className={clsx([classes.cell, headCell.classname, { cellClick: onRowClick }])}
              align={headCell.align || "left"}
              key={index}
              style={{
                ...headCell.style,
                borderBottom: `${hasDrillDown && row.tableDrillDown === true ? "none" : ""}`,
              }}
            >
              <Typography
                noWrap
                style={{ width: "fit-content", maxWidth: "100%", display: "inline-block", verticalAlign: "middle" }}
                data-tip={!headCell.disableTooltip && row[headCell.property] ? row[headCell.property].toString() : ""}
              >
                {row[headCell.property] ? row[headCell.property].toString() : ""}
              </Typography>
            </TableCell>
          );
        } else return null;
      })}
    </>
  );
};

export default React.memo(GridCells);
