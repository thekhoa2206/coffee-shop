import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import clsx from "clsx";
import React, { ReactElement, SyntheticEvent, useCallback, useEffect, useMemo } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import ColGroup from "./ColGroup";
import SapoGridHeader from "./Header/SapoGridHeader";
import SapoPagintation2 from "./Paging/Custom/SapoPagination2";
import SapoPagintation from "./Paging/SapoPagination";
import { DEFAULT_PAGE, DEFAULT_PAGESIZE, DEFAULT_PAGESIZE_OPTIONS } from "./SapoGrid.constants";
import useStyles from "./SapoGrid.style";
import { GridDataStateChangeEvent, GridSelectionChangeEvent, GridState, HeadCell } from "./SapoGrid.type";
import { SapoGridV2Props } from "components/SapoGrid/SapoGridV2.type";
import { isEqual } from "lodash";
import SapoGridRowV2 from "components/SapoGrid/Row/SapoGridRowV2";
import SapoGridHeaderV2 from "components/SapoGrid/Header/SapoGridHeaderV2";
import { TableCell, TableRow, Typography } from "@material-ui/core";
import { formatSummaryNumberDecimal } from "utilities";


const SapoGridV2 = React.memo((props: React.PropsWithChildren<SapoGridV2Props>) => {
  const {
    style,
    data,
    sortable,
    sort,
    onSortChange,
    onPageChange,
    onDataStateChange,
    selectable,
    selectBy = "id",
    onSelectionChange,
    selectedItems = [],
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGESIZE,
    pageSizeOptions = DEFAULT_PAGESIZE_OPTIONS,
    children,
    onRowClick,
    onMouseRowEnter,
    onMouseRowLeave,
    nameObjectSelected,
    settingColumns,
    toogleSettings,
    stickyHeader,
    isMenuCollapse,
    disablePaging = false,
    stickyHeaderTop = 0,
    tableDrillDown,
    disablePageSizeChange,
    context,
    headerVersion,
    summary,
    totalPage,
    showSetting,
    heightRowReport = true,
  } = props;
  const classes = useStyles();
  const [selected, setSelected] = React.useState<any[]>(selectedItems);
  const headerRef = React.useRef<any>();
  const entities = useMemo(() => (Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : []), [data]);
  const total = useMemo(() => (Array.isArray(data) ? data.length : Array.isArray(data.data) ? data.total : 0), [data]);
  const [atTop, setAtTop] = React.useState(true);
  let root = document.getElementById("root");
  useEffect(() => {
    function handleScroll() {
      if (root) {
        if (root.scrollTop === 0) {
          setAtTop(true);
        }
        if (root.scrollTop > 0) {
          setAtTop(false);
        }
      }
    }

    if (root) {
      root.addEventListener("scroll", handleScroll);
    }

    return function cleanupListener() {
      if (root) {
        root.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  let headCells = useMemo(() => {
    const childrens = React.Children.toArray(children);
    const columnElements: ReactElement[] = [];
    childrens.forEach((child: any) => {
      if (child && child.type.displayName === "SapoGridColumn") {
        columnElements.push(child);
      }
    });
    const cells: HeadCell[] = [];
    columnElements.forEach((col) => {
      const cell = {
        property: col.props.field,
        label: col.props.title,
        template: col.props.children,
        sortable: col.props.sortable,
        width: col.props.width,
        align: col.props.align,
        style: col.props.style,
        classname: col.props.classname,
        disablePadding: col.props.disablePadding,
      } as HeadCell;

      if (settingColumns) {
        cell.display = settingColumns[cell.property];
      } else {
        cell.display = true;
      }
      cells.push(cell);
    });
    if (settingColumns) {
      cells.sort((a, b) => {
        return Object.keys(settingColumns).indexOf(a.property) - Object.keys(settingColumns).indexOf(b.property);
      });
    }
    return cells;
  }, [settingColumns, context]);

  let drillDown = useMemo(() => {
    const childrens = React.Children.toArray(children);
    let _drillDown: any = undefined;
    childrens.forEach((child: any) => {
      if (tableDrillDown && child && child.type.displayName === "SapoGridDrillDown") {
        _drillDown = child;
      }
    });
    return _drillDown;
  }, [context]);

  let toolbar = useMemo(() => {
    const childrens = React.Children.toArray(children);
    let _toolbar: any = undefined;
    childrens.forEach((child: any) => {
      if (child && child.type.displayName === "SapoGridToolbar") {
        _toolbar = child;
      }
    });
    return _toolbar;
  }, [context, selected]);

  useEffect(() => {
    if (!isEqual(selected, selectedItems)) {
      setSelected(selectedItems);
    }
  }, [selectedItems]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = [...entities];
      setSelected(newSelecteds);
      if (onSelectionChange) {
        onSelectionChange({
          nativeEvent: event.nativeEvent,
          dataItems: newSelecteds,
        } as GridSelectionChangeEvent);
      }
      return;
    }
    setSelected([]);
    if (onSelectionChange) {
      onSelectionChange({
        nativeEvent: event.nativeEvent,
        dataItems: [],
      } as GridSelectionChangeEvent);
    }
  };

  const handleSelectionClick = useCallback(
    (event: React.SyntheticEvent<any>, row: any) => {
      let newSelected: any[] = [];
      setSelected((preSelected) => {
        const selectedIndex = preSelected.findIndex((s) => s[selectBy] === row[selectBy]);
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(preSelected, row);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(preSelected.slice(1));
        } else if (selectedIndex === preSelected.length - 1) {
          newSelected = newSelected.concat(preSelected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(preSelected.slice(0, selectedIndex), preSelected.slice(selectedIndex + 1));
        }
        return newSelected;
      });

      if (onSelectionChange) {
        onSelectionChange({
          nativeEvent: event.nativeEvent,
          dataItems: newSelected,
        } as GridSelectionChangeEvent);
      }
    },
    [onSelectionChange]
  );

  const handlePageChange = (event: React.SyntheticEvent<HTMLElement>, newPage: number) => {
    if (Array.isArray(data)) {
      // TODO
      // client pagination
    }
    raiseDataEvent(
      onPageChange,
      {
        page: {
          page: newPage,
          pageSize: pageSize,
        },
      },
      { page: newPage, pageSize: pageSize },
      event
    );
  };

  const handlePageSizeChange = (event: React.SyntheticEvent<HTMLElement>, newPageSize: number) => {
    if (Array.isArray(data)) {
      // TODO
      // client pagination
    }

    raiseDataEvent(
      onPageChange,
      { page: { page: 1, pageSize: newPageSize } },
      { page: 1, pageSize: newPageSize },
      event
    );
  };

  const handleRequestSort = (event: React.SyntheticEvent<HTMLElement>, property: string) => {
    if (sort) {
      const isDesc = sort.field === property && sort.dir === "desc";
      let dataSort = {
        field: property,
        dir: isDesc ? "asc" : "desc",
      };
      if (sortable) {
        raiseDataEvent(
          onSortChange,
          {
            sort: dataSort,
          },
          {
            sort: dataSort,
          },
          event
        );
      }
    }
  };

  const raiseDataEvent = (handler: any, data: any, moreData: any, syntheticEvent: SyntheticEvent) => {
    if (handler) {
      handler.call(undefined, Object.assign({}, getArguments(syntheticEvent), data));
    } else if (onDataStateChange) {
      onDataStateChange(
        Object.assign({}, getArguments(syntheticEvent), {
          dataState: Object.assign({}, getDataState(), moreData),
        } as GridDataStateChangeEvent)
      );
    }
  };

  const getDataState = (): GridState => {
    return {
      page: page,
      pageSize: pageSize,
      sort: sort,
    };
  };

  const getArguments = (syntheticEvent: SyntheticEvent) => {
    return {
      nativeEvent: syntheticEvent && syntheticEvent.nativeEvent,
      syntheticEvent: syntheticEvent,
    };
  };
  const isSelected = (name: string) => selected.findIndex((s) => s[selectBy] === name) !== -1;

  const handleTableScroll = (e: React.UIEvent<HTMLElement>) => {
    if (headerRef && headerRef.current) {
      headerRef.current.scrollTop = e.currentTarget.scrollTop;
      headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const handleSrollLeft = (container: HTMLElement) => {
    if (headerRef && headerRef.current) {
      headerRef.current.scrollLeft = container.scrollLeft;
    }
  };

  return (
    <Paper className={classes.root} style={style}>
      {/* <SapoGridToolbar numSelected={selected.length} /> */}

      <TableContainer
        className={clsx(classes.headerWrapper, stickyHeader ? "stickyHeader" : "")}
        ref={headerRef}
        style={
          stickyHeader
            ? { top: stickyHeaderTop, boxShadow: !atTop && summary ? "0px 4px 8px rgba(168, 168, 168, 0.25)" : "" }
            : { boxShadow: !atTop && summary ? "0px 4px 8px rgba(168, 168, 168, 0.25)" : "" }
        }
      >
        <Table className={classes.headerTable} aria-labelledby="tableTitle" size={"medium"} aria-label="enhanced table">
          <ColGroup
            selectable={selectable}
            settingable={showSetting ? showSetting : !!settingColumns}
            drillDown={!!drillDown}
            columnWidths={headCells.filter((cell) => cell.display).map((cell) => (cell.width ? cell.width : 0))}
          />
          {headerVersion && headerVersion === 2 ? (
            <SapoGridHeaderV2
              headCells={headCells}
              sortable={sortable}
              selectable={selectable}
              selectedItems={selectedItems}
              order={sort && sort.dir === "asc" ? "asc" : "desc"}
              orderBy={sort && sort.field ? sort.field : ""}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.data.length < pageSize ? data.data.length : pageSize}
              toolbar={toolbar}
              nameObjectSelected={nameObjectSelected}
              settingable={showSetting ? showSetting : !!settingColumns}
              toogleSettings={toogleSettings}
              drillDown={drillDown}
            />
          ) : (
            <SapoGridHeader
              headCells={headCells}
              sortable={sortable}
              selectable={selectable}
              selectedItems={selectedItems}
              order={sort && sort.dir === "asc" ? "asc" : "desc"}
              orderBy={sort && sort.field ? sort.field : ""}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.data.length < pageSize ? data.data.length : pageSize}
              toolbar={toolbar}
              nameObjectSelected={nameObjectSelected}
              settingable={showSetting ? showSetting : !!settingColumns}
              toogleSettings={toogleSettings}
              drillDown={drillDown}
            />
          )}
          {summary && (
            <TableBody style={{ backgroundColor: "#FFF" }}>
              <TableRow>
                <TableCell align={"left"} padding={"none"} className={classes.cellV2}></TableCell>
                {summary["sum"] && (
                  <TableCell align={"left"} padding={"none"} className={classes.cellV2}>
                    <Typography variant={"body1"} style={{ fontWeight: 500 }}>
                      {summary["sum"]}
                    </Typography>
                  </TableCell>
                )}
                {Object.keys(summary)
                  .filter((key) => key !== "sum")
                  .map((key: string) => (
                    <TableCell align={"right"} padding={"none"} className={classes.cellV2} key={key}>
                      <Typography variant={"body1"} style={{ fontWeight: 500, paddingRight: "6px" }}>
                        {formatSummaryNumberDecimal(key, summary[key])}
                      </Typography>
                    </TableCell>
                  ))}
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <TableContainer
        onScroll={handleTableScroll}
        className={clsx(classes.bodyWrapper, isMenuCollapse ? "menuCollapse" : "")}
      >
        <PerfectScrollbar onScrollX={handleSrollLeft}>
          <Table className={classes.bodyTable} aria-labelledby="tableTitle" size={"medium"} aria-label="enhanced table">
            <ColGroup
              selectable={selectable}
              settingable={showSetting ? showSetting : !!settingColumns}
              drillDown={!!drillDown}
              columnWidths={headCells.filter((cell) => cell.display).map((cell) => (cell.width ? cell.width : 0))}
            />
            <TableBody>
              {entities.map((row, index) => {
                const isItemSelected = isSelected(row[selectBy]);
                return (
                  <SapoGridRowV2
                    key={`${page}-${index}-${row[selectBy]}`}
                    selectable={selectable}
                    row={row}
                    isItemSelected={isItemSelected}
                    settingColumns={settingColumns}
                    drillDown={drillDown}
                    headCells={headCells}
                    handleSelectionClick={handleSelectionClick}
                    onRowClick={onRowClick}
                    onMouseRowEnter={onMouseRowEnter}
                    onMouseRowLeave={onMouseRowLeave}
                    showSetting={showSetting}
                    heightRowReport={heightRowReport}
                  />
                );
              })}
            </TableBody>
          </Table>
        </PerfectScrollbar>
      </TableContainer>
      {!disablePaging &&
        (props.shortPagination ? (
          <SapoPagintation2
            nameObjectSelected={nameObjectSelected}
            total={totalPage ? totalPage : total}
            page={page}
            pageSize={pageSize}
            pageChange={handlePageChange}
          />
        ) : (
          <SapoPagintation
            total={totalPage ? totalPage : total}
            page={page}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            pageChange={handlePageChange}
            pageSizeChange={handlePageSizeChange}
            disablePageSizeChange={disablePageSizeChange}
          />
        ))}
    </Paper>
  );
});

export default SapoGridV2;
