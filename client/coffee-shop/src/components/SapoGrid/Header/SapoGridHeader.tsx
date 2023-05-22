import { Box, IconButton, TableCell, TableHead, TableRow, TableSortLabel, Typography } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import clsx from "clsx";
import Checkbox from "components/Checkbox";
import { SettingIcon, UnfoldMoreIcon } from "components/SVG";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { colorInk } from "theme/palette";
import useStyles from "./SapoGridHeader.style";
import { SapoGridHeaderProps } from "./SapoGridHeader.type";
import { HeadCell } from "components/SapoGrid/SapoGrid.type";

function SapoGridHeader(props: SapoGridHeaderProps) {
  const {
    sortable = false,
    selectable = false,
    onSelectAllClick,
    order,
    orderBy,
    nameObjectSelected,
    rowCount,
    onRequestSort,
    headCells,
    toolbar,
    settingable,
    toogleSettings,
    selectedItems = [],
    drillDown,
  } = props;

  const createSortHandler = (property: string) => (event: React.SyntheticEvent<HTMLElement>) => {
    onRequestSort(event, property);
  };
  const { t } = useTranslation(["component"]);
  const classes = useStyles();
  const Toolbar = toolbar?.props.children;
  const DrillDown = drillDown?.props.children;

  const splitRow = (cell: HeadCell, rowHeads: { [key: number]: HeadCell[] }, rowIndex: number) => {
    if (rowHeads[rowIndex]) rowHeads[rowIndex].push(cell);
    else rowHeads[rowIndex] = [cell];
    if (cell.variant === "group" && cell.subCells) {
      cell.subCells.forEach((subCell) => splitRow(subCell, rowHeads, rowIndex + 1));
    }
  };

  const splitHeader = useMemo(() => {
    let rowHeads: { [key: number]: HeadCell[] } = {};
    headCells.forEach((cell: HeadCell) => splitRow(cell, rowHeads, 1));
    return rowHeads;
  }, [headCells]);

  const totalRowSpan = Object.keys(splitHeader).length ?? 1;

  const calculatorColSpan = (cell: HeadCell): number => {
    if (cell.variant === "group" && cell.subCells) {
      return cell.subCells.reduce((totalCol, col) => totalCol + calculatorColSpan(col), 0);
    } else return 1;
  };

  const renderSubHeader = useMemo(() => {
    let rows: React.ReactNode[] = [];
    for (let i = 2; i < Object.keys(splitHeader).length + 1; i++) {
      let _headCells = splitHeader[i];
      rows.push(
        <TableRow>
          <React.Fragment>
            {_headCells.map((headCell) => {
              let colSpan = calculatorColSpan(headCell);
              return (
                <React.Fragment key={headCell.property}>
                  {headCell.display ? (
                    <TableCell
                      align={headCell.align || "left"}
                      padding={headCell.disablePadding ? "none" : "default"}
                      sortDirection={orderBy === headCell.property ? order : false}
                      colSpan={colSpan}
                      rowSpan={headCell.variant === "group" ? 1 : totalRowSpan - i + 1}
                      className={classes.cell}
                    >
                      {sortable && headCell.sortable === true ? (
                        <TableSortLabel
                          active={orderBy === headCell.property}
                          direction={orderBy === headCell.property ? order : undefined}
                          onClick={createSortHandler(headCell.property)}
                          className={clsx(classes.headerName, headCell.align)}
                          IconComponent={(props) =>
                            orderBy === headCell.property ? (
                              <ArrowDropDownIcon {...props} />
                            ) : (
                              <UnfoldMoreIcon className="UnfoldMoreIcon" />
                            )
                          }
                        >
                          {!!headCell.component ? headCell.component : headCell.label}
                          {orderBy === headCell.property ? (
                            <span className={classes.visuallyHidden}>
                              {order === "desc" ? "sorted descending" : "sorted ascending"}
                            </span>
                          ) : null}
                        </TableSortLabel>
                      ) : (
                        <React.Fragment>{!!headCell.component ? headCell.component : headCell.label}</React.Fragment>
                      )}
                    </TableCell>
                  ) : null}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        </TableRow>
      );
    }
    return rows;
  }, [splitHeader]);

  return (
    <TableHead className={classes.wrapper}>
      <TableRow>
        {selectable ? (
          <TableCell
            rowSpan={totalRowSpan}
            padding="checkbox"
            className={classes.cellCheckbox}
            style={{ paddingLeft: settingable ? "0" : "16px" }}
          >
            <Box display="flex" alignItems="center">
              {settingable && (
                <IconButton
                  component="span"
                  onClick={toogleSettings}
                  size="medium"
                  data-tip={t("Điều chỉnh cột hiển thị")}
                >
                  <SettingIcon style={{ color: colorInk.base40 }} />
                </IconButton>
              )}

              <Checkbox
                indeterminate={selectedItems.length > 0 && selectedItems.length < rowCount}
                checked={rowCount > 0 && selectedItems.length === rowCount}
                onChange={onSelectAllClick}
                style={{ margin: 0 }}
                data-tip={`Chọn tất cả ${nameObjectSelected}`}
              />
            </Box>
          </TableCell>
        ) : (
          (settingable || DrillDown) && (
            <TableCell
              rowSpan={totalRowSpan}
              padding="checkbox"
              className={classes.cellCheckbox}
              style={{ paddingLeft: 0 }}
            >
              <Box display="flex" alignItems="center">
                {settingable && (
                  <IconButton
                    component="span"
                    onClick={() => toogleSettings && toogleSettings()}
                    data-tip={t("Điều chỉnh cột hiển thị")}
                    style={{
                      width: "100%",
                    }}
                  >
                    <SettingIcon style={{ color: colorInk.base40 }} />
                  </IconButton>
                )}
              </Box>
            </TableCell>
          )
        )}
        {selectedItems.length > 0 ? (
          <React.Fragment>
            <TableCell
              rowSpan={totalRowSpan}
              colSpan={headCells.length}
              className={clsx(classes.cell)}
              style={{ padding: 0 }}
            >
              <Box className={classes.headerWrapper}>
                <Box>
                  <Typography color="secondary">
                    {"Đã chọn "} {selectedItems.length} {nameObjectSelected} {" trên trang này"}
                  </Typography>
                </Box>
                <Box className={classes.bulkActions}>{Toolbar ? <Toolbar selectedItems={selectedItems} /> : null}</Box>
              </Box>
            </TableCell>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {headCells.map((headCell) => {
              let colSpan = calculatorColSpan(headCell);
              return (
                <React.Fragment key={headCell.property}>
                  {headCell.display ? (
                    <TableCell
                      align={headCell.align || "left"}
                      padding={headCell.disablePadding ? "none" : "default"}
                      sortDirection={orderBy === headCell.property ? order : false}
                      colSpan={colSpan}
                      rowSpan={headCell.variant === "group" ? 1 : totalRowSpan}
                      className={classes.cell}
                    >
                      {sortable && headCell.sortable === true ? (
                        <TableSortLabel
                          active={orderBy === headCell.property}
                          direction={orderBy === headCell.property ? order : undefined}
                          onClick={createSortHandler(headCell.property)}
                          className={clsx(classes.headerName, headCell.align)}
                          IconComponent={(props) =>
                            orderBy === headCell.property ? (
                              <ArrowDropDownIcon {...props} />
                            ) : (
                              <UnfoldMoreIcon className="UnfoldMoreIcon" />
                            )
                          }
                        >
                          {!!headCell.component ? headCell.component : headCell.label}
                          {orderBy === headCell.property ? (
                            <span className={classes.visuallyHidden}>
                              {order === "desc" ? "sorted descending" : "sorted ascending"}
                            </span>
                          ) : null}
                        </TableSortLabel>
                      ) : (
                        <React.Fragment>{!!headCell.component ? headCell.component : headCell.label}</React.Fragment>
                      )}
                    </TableCell>
                  ) : null}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        )}
      </TableRow>
      {totalRowSpan > 1 ? renderSubHeader : null}
    </TableHead>
  );
}

export default React.memo(SapoGridHeader);
