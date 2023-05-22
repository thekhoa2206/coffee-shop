import { IconButton, TableCell, TableRow, Typography } from "@material-ui/core";
import clsx from "clsx";
import Checkbox from "components/Checkbox";
import { ChevronDuoIcon } from "components/SVG";
import React, { Fragment } from "react";
import { SapoGridRowV2Props } from "./SapoGridRow.types";
import CircularProgress from "components/Loading/CircularProgress";
import useStyles from "./SapoGridRow.styles";

const SapoGridRowV2 = (props: SapoGridRowV2Props) => {
  const {
    selectable,
    row,
    isItemSelected,
    settingColumns,
    drillDown,
    headCells,
    handleSelectionClick,
    onRowClick,
    onMouseRowEnter,
    onMouseRowLeave,
    showSetting,
    heightRowReport,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const DrillDown = drillDown?.props.children;
  const [loadingDrillDown, setLoadingDrillDown] = React.useState(false);

  return (
    <Fragment>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
        className={classes.root}
        style={{ backgroundColor: `${open ? "#F2F9FF" : ""}` }}
      >
        {selectable ? (
          <TableCell
            padding="checkbox"
            className={classes.cellCheckbox}
            style={{
              paddingLeft: settingColumns || showSetting ? (DrillDown && row.tableDrillDown === true ? 4 : 44) : 16,
              borderBottom: `${DrillDown && row.tableDrillDown === true ? "none" : ""}`,
            }}
          >
            {DrillDown && row.tableDrillDown === true && (
              <IconButton
                aria-label="expand row"
                size="medium"
                onClick={() => {
                  if (!loadingDrillDown) {
                    setOpen(!open);
                  }
                }}
                className={!(loadingDrillDown && open) ? classes.btnDrillDown : classes.loadingDrillDown}
              >
                {open && !loadingDrillDown ? (
                  <ChevronDuoIcon color="primary" />
                ) : loadingDrillDown && open ? (
                  <CircularProgress size={18} />
                ) : (
                  <ChevronDuoIcon color="primary" style={{ transform: "rotate(270deg)" }} />
                )}
              </IconButton>
            )}
            <Checkbox
              checked={isItemSelected}
              onChange={(e, checked) => handleSelectionClick(e, row)}
              style={{ margin: 0 }}
            />
          </TableCell>
        ) : (
          (settingColumns || showSetting || (DrillDown && row.tableDrillDown === true)) && (
            <TableCell
              padding="checkbox"
              className={heightRowReport ? classes.cellReport : classes.cell}
              style={{
                paddingLeft: DrillDown && row.tableDrillDown === true ? 4 : 44,
                borderBottom: `${DrillDown && row.tableDrillDown === true ? "none" : ""}`,
              }}
            >
              {DrillDown && row.tableDrillDown === true && (
                <IconButton
                  aria-label="expand row"
                  size="medium"
                  onClick={() => {
                    if (!loadingDrillDown) {
                      setOpen(!open);
                    }
                  }}
                  className={!loadingDrillDown ? classes.btnDrillDown : classes.loadingDrillDown}
                >
                  {open && !loadingDrillDown ? (
                    <ChevronDuoIcon color="primary" />
                  ) : loadingDrillDown && open ? (
                    <CircularProgress size={18} />
                  ) : (
                    <ChevronDuoIcon color="primary" style={{ transform: "rotate(270deg)" }} />
                  )}
                </IconButton>
              )}
            </TableCell>
          )
        )}

        {headCells.map((headCell, index) => {
          if (headCell.display) {
            if (headCell.template) {
              const CellTemplate = headCell.template;

              return (
                <TableCell
                  onClick={(e: any) => onRowClick && onRowClick(e, row)}
                  align={headCell.align || "left"}
                  key={index}
                  className={heightRowReport ? classes.cellReport : classes.cell}
                  style={{
                    ...headCell.style,
                    borderBottom: `${DrillDown && row.tableDrillDown === true ? "none" : ""}`,
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
                className={clsx([
                  heightRowReport ? classes.cellReport : classes.cell,
                  headCell.classname,
                  { cellClick: onRowClick },
                ])}
                align={headCell.align || "left"}
                key={index}
                style={{ ...headCell.style, borderBottom: `${DrillDown && row.tableDrillDown === true ? "none" : ""}` }}
              >
                {/*<Tooltip arrow title={row[headCell.property] ? row[headCell.property].toString() : ""}>*/}
                <Typography
                  data-tip={row[headCell.property] ? row[headCell.property].toString() : ""}
                  noWrap
                  style={{ width: "fit-content", maxWidth: "100%", display: "inline-block" }}
                >
                  {row[headCell.property] ? row[headCell.property].toString() : ""}
                </Typography>
                {/*</Tooltip>*/}
              </TableCell>
            );
          } else return null;
        })}
      </TableRow>
      {DrillDown && row.tableDrillDown === true && (
        <TableRow style={{ backgroundColor: `#F2F9FF` }}>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={
              selectable || settingColumns || showSetting
                ? headCells.filter((cell) => cell.display).length + 1
                : headCells.filter((cell) => cell.display).length
            }
          >
            <DrillDown
              dataItem={row}
              setOpen={setOpen}
              open={open}
              setLoadingDrillDown={setLoadingDrillDown}
              loadingDrillDown={loadingDrillDown}
            />
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
};

export default React.memo(SapoGridRowV2);
