import { Box, IconButton, TableCell, TableHead, TableRow, TableSortLabel, Typography } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import clsx from "clsx";
import Checkbox from "components/Checkbox";
import { SettingIcon, UnfoldMoreIcon } from "components/SVG";
import Tooltip from "components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";
import { colorInk } from "theme/palette";
import useStyles from "./SapoGridHeader.style";
import { SapoGridHeaderProps } from "./SapoGridHeader.type";

function SapoGridHeaderV2(props: SapoGridHeaderProps) {
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
  return (
    <TableHead className={classes.wrapper}>
      <TableRow>
        {selectable ? (
          <TableCell
            padding="checkbox"
            className={classes.cellCheckbox}
            style={{ paddingLeft: settingable ? "0" : "16px" }}
          >
            <Box display="flex" alignItems="center">
              {settingable && (
                <Tooltip title={t("Điều chỉnh cột hiển thị") || ""} placement="top-start" arrow={true}>
                  <IconButton component="span" onClick={() => toogleSettings && toogleSettings()} size="medium">
                    <SettingIcon style={{ color: colorInk.base40 }} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip
                title={`${t("component:gridHeader.selectAll")} ${nameObjectSelected}`}
                placement="top-start"
                arrow={true}
              >
                <Box>
                  <Checkbox
                    indeterminate={selectedItems.length > 0 && selectedItems.length < rowCount}
                    checked={rowCount > 0 && selectedItems.length === rowCount}
                    onChange={onSelectAllClick}
                    style={{ margin: 0 }}
                  />
                </Box>
              </Tooltip>
            </Box>
          </TableCell>
        ) : (
          (settingable || DrillDown) && (
            <TableCell padding="checkbox" className={classes.cellCheckbox} style={{ paddingLeft: 0 }}>
              <Box display="flex" alignItems="center">
                {settingable && (
                  <Tooltip title={"Điều chỉnh cột hiển thị"} placement="right" arrow={true}>
                    <IconButton component="span" onClick={() => toogleSettings && toogleSettings()}>
                      <SettingIcon style={{ color: colorInk.base40 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </TableCell>
          )
        )}
        {selectedItems.length > 0 ? (
          <React.Fragment>
            <TableCell colSpan={headCells.length} className={clsx(classes.cell)} style={{ padding: 0 }}>
              <Box className={classes.headerWrapper}>
                <Box>
                  <Typography color="secondary">
                    {t("gridHeader.selected")} {selectedItems.length} {nameObjectSelected} {t("gridHeader.inPage")}
                  </Typography>
                </Box>
                <Box className={classes.bulkActions}>{Toolbar ? <Toolbar selectedItems={selectedItems} /> : null}</Box>
              </Box>
            </TableCell>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {headCells.map((headCell) => (
              <React.Fragment key={headCell.property}>
                {headCell.display ? (
                  <TableCell
                    align={headCell.align || "left"}
                    padding={"none"}
                    sortDirection={orderBy === headCell.property ? order : false}
                    className={classes.cellV2}
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
                        {headCell.label}
                        {orderBy === headCell.property ? (
                          <span className={classes.visuallyHidden}>
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                          </span>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      <React.Fragment>{headCell.label}</React.Fragment>
                    )}
                  </TableCell>
                ) : null}
              </React.Fragment>
            ))}
          </React.Fragment>
        )}
      </TableRow>
    </TableHead>
  );
}

export default SapoGridHeaderV2;
