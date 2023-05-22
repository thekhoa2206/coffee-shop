import { IconButton, TableCell, TableRow, Typography } from "@material-ui/core";
import Checkbox from "components/Checkbox";
import { ChevronDuoIcon } from "components/SVG";
import React, { Fragment, useEffect } from "react";
import { SapoGridRowProps } from "./SapoGridRow.types";
import CircularProgress from "components/Loading/CircularProgress";
import useStyles from "./SapoGridRow.styles";
import GridCells from "../Cell/GridCells";

const SapoGridRow = (props: SapoGridRowProps) => {
  const {
    selectable,
    row,
    isItemSelected,
    isSettingColumns,
    drillDown,
    headCells,
    handleSelectionClick,
    onRowClick,
    onMouseRowEnter,
    onMouseRowLeave,
    withRowCountInSettingColumn,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const DrillDown = drillDown?.props.children;
  const [loadingDrillDown, setLoadingDrillDown] = React.useState(false);

  useEffect(() => {
    // TODO remove open state
    if (open) setOpen(false);
  }, [row]);

  const handleDrillDownClick = (e: React.SyntheticEvent<HTMLElement>) => {
    if (!loadingDrillDown) {
      setOpen(!open);
    }
  };

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
              paddingLeft: isSettingColumns ? (DrillDown && row.tableDrillDown === true ? 4 : 44) : 16,
              borderBottom: `${DrillDown && row.tableDrillDown === true ? "none" : ""}`,
            }}
          >
            {DrillDown && row.tableDrillDown === true && (
              <IconButton
                aria-label="expand row"
                size="medium"
                onClick={handleDrillDownClick}
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
          (isSettingColumns || (DrillDown && row.tableDrillDown === true)) && (
            <TableCell
              padding="checkbox"
              className={classes.cell}
              style={{
                paddingLeft: withRowCountInSettingColumn ? 4 : DrillDown && row.tableDrillDown === true ? 4 : 44,
                borderBottom: `${DrillDown && row.tableDrillDown === true ? "none" : ""}`,
              }}
            >
              {DrillDown && row.tableDrillDown === true && (
                <IconButton
                  aria-label="expand row"
                  size="medium"
                  onClick={handleDrillDownClick}
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
              {!DrillDown && !row.tableDrillDown && withRowCountInSettingColumn ? withRowCountInSettingColumn(row) : ""}
            </TableCell>
          )
        )}
        {headCells && headCells.length ? (
          <GridCells
            row={row}
            headCells={headCells}
            hasDrillDown={DrillDown}
            onMouseRowEnter={onMouseRowEnter}
            onMouseRowLeave={onMouseRowLeave}
            onRowClick={onRowClick}
          ></GridCells>
        ) : null}
      </TableRow>
      {DrillDown && row.tableDrillDown === true && (
        <TableRow style={{ backgroundColor: `#F2F9FF` }}>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={headCells.filter((cell) => cell.display).length + 1}
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

export default React.memo(SapoGridRow);
