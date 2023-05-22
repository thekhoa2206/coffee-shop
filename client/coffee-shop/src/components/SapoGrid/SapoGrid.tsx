import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import clsx from "clsx";
import React, { ReactElement, SyntheticEvent, useCallback, useEffect, useMemo, useRef } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import ColGroup from "./ColGroup";
import SapoGridHeader from "./Header/SapoGridHeader";
import SapoPagintation2 from "./Paging/Custom/SapoPagination2";
import SapoPagintation from "./Paging/SapoPagination";
import SapoGridRow from "./Row/SapoGridRow";
import { DEFAULT_PAGE, DEFAULT_PAGESIZE, DEFAULT_PAGESIZE_OPTIONS } from "./SapoGrid.constants";
import useStyles from "./SapoGrid.style";
import SapoGridProps, {
  GridDataStateChangeEvent,
  GridSelectionChangeEvent,
  GridState,
  HeadCell,
} from "./SapoGrid.type";
import ReactTooltip from "react-tooltip";
import { positionValues, Scrollbars } from "react-custom-scrollbars";


const SapoGrid = React.memo((props: SapoGridProps) => {
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
    selectedItems,
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
    borderCell,
    isMenuCollapse,
    disablePaging = false,
    stickyHeaderTop = 0,
    tableDrillDown,
    disablePageSizeChange,
    withRowCountInSettingColumn,
    fixTopTableRow,
    staticScrollBar,
  } = props;

  const classes = useStyles();
  const headerRef = React.useRef<any>();
  const scrollbarRef = React.useRef<any>();

  // Grid state Refs
  const dataRef = useRef(data);
  const selectedItemsRef = useRef(selectedItems);
  const pageRef = useRef(page);
  const pageSizeRef = useRef(pageSize);
  const sortRef = useRef(sort);
  const settingColumnsRef = useRef(settingColumns);

  // Callback Refs
  const onSortChangeRef = useRef(onSortChange);
  const onPageChangeRef = useRef(onPageChange);
  const onDataStateChangeRef = useRef(onDataStateChange);
  const onSelectionChangeRef = useRef(onSelectionChange);
  const onRowClickRef = useRef(onRowClick);
  const onMouseRowEnterRef = useRef(onMouseRowEnter);
  const onMouseRowLeaveRef = useRef(onMouseRowLeave);
  const toogleSettingsRef = useRef(toogleSettings);

  useEffect(() => {
    // Set current Grid state refs
    dataRef.current = data;
    selectedItemsRef.current = selectedItems;
    pageRef.current = page;
    pageSizeRef.current = pageSize;
    sortRef.current = sort;
    settingColumnsRef.current = settingColumns;

    // Set current Callback Refs
    onSortChangeRef.current = onSortChange;
    onPageChangeRef.current = onPageChange;
    onDataStateChangeRef.current = onDataStateChange;
    onSelectionChangeRef.current = onSelectionChange;
    onRowClickRef.current = onRowClick;
    onMouseRowEnterRef.current = onMouseRowEnter;
    onMouseRowLeaveRef.current = onMouseRowLeave;
    toogleSettingsRef.current = toogleSettings;
  });

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [data]);

  useEffect(() => {
    if (scrollbarRef.current && headerRef.current) {
      let values = scrollbarRef.current.getValues();
      headerRef.current.scrollLeft = values.scrollLeft;
    }
  }, [selectedItems]);

  const renderHeadCell = useCallback(
    (col: ReactElement, compare_prop: { isSubCell: boolean; display: boolean }): HeadCell => {
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
        component: col.props.component,
        variant: col.props.variant,
        disableTooltip: col.props.disableTooltip,
        colStyle: col.props.colStyle,
      } as HeadCell;

      if (settingColumns) {
        cell.display = compare_prop.isSubCell ? compare_prop.display : settingColumns[cell.property];
      } else {
        cell.display = true;
      }
      if (cell.variant === "group" && cell.template) {
        cell.subCells = [];
        (cell.template as any).forEach((cellTmp: any) => {
          const subCell = renderHeadCell(cellTmp as ReactElement, { isSubCell: true, display: !!cell.display });
          cell.subCells?.push(subCell);
        });
        if (settingColumns && cell.subCells && cell.subCells.length > 0) {
          cell.subCells.sort((a, b) => {
            return Object.keys(settingColumns).indexOf(a.property) - Object.keys(settingColumns).indexOf(b.property);
          });
        }
      }

      return cell;
    },
    [settingColumns]
  );

  const headCells = useMemo(() => {
    const childrens = React.Children.toArray(children);
    const columnElements: ReactElement[] = [];

    childrens.forEach((child: any) => {
      if (child && child.type.displayName === "SapoGridColumn") {
        columnElements.push(child);
      }
    });
    const cells: HeadCell[] = [];
    columnElements.forEach((col) => {
      const cell = renderHeadCell(col, { isSubCell: false, display: true });
      cells.push(cell);
    });
    if (settingColumns) {
      cells.sort((a, b) => {
        return Object.keys(settingColumns).indexOf(a.property) - Object.keys(settingColumns).indexOf(b.property);
      });
    }
    return cells;
  }, [settingColumns]);

  const splitRow = (cell: HeadCell, rowHeads: HeadCell[], rowIndex: number) => {
    if (cell.variant === "group" && cell.subCells) {
      cell.subCells.forEach((subCell) => splitRow(subCell, rowHeads, rowIndex + 1));
    } else rowHeads.push(cell);
  };

  const headWithSubCells = useMemo(() => {
    let rowHeads: HeadCell[] = [];
    headCells.forEach((cell: HeadCell) => splitRow(cell, rowHeads, 1));
    return rowHeads;
  }, [headCells]);

  const drillDown = useMemo(() => {
    const childrens = React.Children.toArray(children);
    let _drillDown: any = undefined;
    childrens.forEach((child: any) => {
      if (tableDrillDown && child && child.type.displayName === "SapoGridDrillDown") {
        _drillDown = child;
      }
    });
    return _drillDown;
  }, []);

  const toolbar = useMemo(() => {
    const childrens = React.Children.toArray(children);
    let _toolbar: any = undefined;
    childrens.forEach((child: any) => {
      if (child && child.type.displayName === "SapoGridToolbar") {
        _toolbar = child;
      }
    });
    return _toolbar;
  }, []);

  const handleSelectAllClick = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = [...dataRef.current.data];
      if (onSelectionChangeRef.current) {
        onSelectionChangeRef.current({
          nativeEvent: event.nativeEvent,
          dataItems: newSelecteds,
        } as GridSelectionChangeEvent);
      }
      return;
    }
    if (onSelectionChangeRef.current) {
      onSelectionChangeRef.current({
        nativeEvent: event.nativeEvent,
        dataItems: [],
      } as GridSelectionChangeEvent);
    }
  }, []);

  const handleSelectionClick = React.useCallback((event: React.SyntheticEvent<any>, row: any) => {
    if (selectedItemsRef.current) {
      let newSelected: any[] = [];
      const selected = [...selectedItemsRef.current];

      const selectedIndex = selected.findIndex((s) => s[selectBy] === row[selectBy]);
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, row);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
      }

      if (onSelectionChangeRef.current) {
        onSelectionChangeRef.current({
          nativeEvent: event.nativeEvent,
          dataItems: newSelected,
        } as GridSelectionChangeEvent);
      }
    }
  }, []);

  const handlePageChange = React.useCallback((event: React.SyntheticEvent<HTMLElement>, newPage: number) => {
    if (Array.isArray(dataRef.current)) {
      // TODO
      // client pagination
    }

    raiseDataEvent(
      onPageChangeRef.current,
      {
        page: {
          page: newPage,
          pageSize: pageSizeRef.current,
        },
      },
      { page: newPage, pageSize: pageSizeRef.current },
      event
    );
  }, []);

  const handlePageSizeChange = React.useCallback((event: React.SyntheticEvent<HTMLElement>, newPageSize: number) => {
    if (Array.isArray(dataRef.current)) {
      // TODO
      // client pagination
    }

    raiseDataEvent(
      onPageChangeRef.current,
      { page: { page: 1, pageSize: newPageSize } },
      { page: 1, pageSize: newPageSize },
      event
    );
  }, []);

  const handleRequestSort = React.useCallback((event: React.SyntheticEvent<HTMLElement>, property: string) => {
    if (sortRef.current) {
      const isDesc = sortRef.current.field === property && sortRef.current.dir === "desc";
      let dataSort = {
        field: property,
        dir: isDesc ? "asc" : "desc",
      };
      if (sortable) {
        raiseDataEvent(
          onSortChangeRef.current,
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
  }, []);

  const raiseDataEvent = (handler: any, data: any, moreData: any, syntheticEvent: SyntheticEvent) => {
    if (handler) {
      handler.call(undefined, Object.assign({}, getArguments(syntheticEvent), data));
    } else if (onDataStateChangeRef.current) {
      onDataStateChangeRef.current(
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
  const isSelected = (name: string) => selectedItems && selectedItems.findIndex((s) => s[selectBy] === name) !== -1;

  const isSettingColumns = React.useMemo(() => settingColumns != null, [settingColumns]);

  const handleScrollLeft = (values: positionValues) => {
    headerRef.current.scrollLeft = values.scrollLeft;
  };

  const handleRowClick = React.useCallback((e: any, data: any) => {
    if (onRowClickRef.current) {
      onRowClickRef.current(e, data);
    }
  }, []);
  const handleMouseRowEnter = React.useCallback((e: any, data: any, field: any) => {
    if (onMouseRowEnterRef.current) {
      onMouseRowEnterRef.current(e, data, field);
    }
  }, []);
  const handleMouseRowLeave = React.useCallback((e: any, data: any, field: any) => {
    if (onMouseRowLeaveRef.current) {
      onMouseRowLeaveRef.current(e, data, field);
    }
  }, []);

  const handleToggleSetting = React.useCallback(() => {
    if (toogleSettingsRef.current) {
      toogleSettingsRef.current();
    }
  }, []);

  return (
    <Paper className={clsx(classes.root, "sapo-grid")} style={style}>
      <TableContainer
        className={clsx(classes.headerWrapper, "sapo-grid-header-wrapper", stickyHeader ? "stickyHeader" : "")}
        ref={headerRef}
        style={stickyHeader ? { top: stickyHeaderTop } : {}}
      >
        <Table
          className={clsx(classes.headerTable, "sapo-grid-header", borderCell ? classes.cellBorder : "")}
          aria-labelledby="tableTitle"
          size={"medium"}
          aria-label="enhanced table"
        >
          <ColGroup
            selected={selectedItems}
            selectable={selectable}
            settingable={settingColumns ? true : false}
            drillDown={drillDown ? true : false}
            columnWidths={headWithSubCells.filter((cell) => cell.display).map((cell) => (cell.width ? cell.width : 0))}
            columnStyles={headWithSubCells.filter((cell) => cell.display)}
          />
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
            settingable={settingColumns ? true : false}
            toogleSettings={handleToggleSetting}
            drillDown={drillDown}
          />
        </Table>
      </TableContainer>

      <TableContainer
        className={clsx(classes.bodyWrapper, "sapo-grid-body-wrapper", isMenuCollapse ? "menuCollapse" : "")}
      >
        <Scrollbars
          ref={scrollbarRef}
          autoHeight
          autoHeightMax="unset"
          onScrollFrame={handleScrollLeft}
          renderTrackHorizontal={({ style, ...props }) => (
            <div
              {...props}
              className={classes.trackHorizontal}
              style={{ ...style, position: staticScrollBar ? "static" : "fixed", left: isMenuCollapse ? 88 : 262 }}
            />
          )}
          renderThumbHorizontal={(props) => <div {...props} className={classes.thumbHorizontal} />}
        >
          <Table
            className={clsx(classes.bodyTable, "sapo-grid-body", borderCell ? classes.cellBorder : "")}
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <ColGroup
              selectable={selectable}
              settingable={settingColumns ? true : false}
              drillDown={drillDown ? true : false}
              columnWidths={headWithSubCells
                .filter((cell) => cell.display)
                .map((cell) => (cell.width ? cell.width : 0))}
              columnStyles={headWithSubCells.filter((cell) => cell.display)}
            />
            <TableBody>
              {fixTopTableRow?.()}
              {data.data.map((row, index) => {
                const isItemSelected = isSelected(row[selectBy]);
                return (
                  <SapoGridRow
                    key={`${index}-${row.id}`}
                    selectable={selectable}
                    row={row}
                    isItemSelected={isItemSelected}
                    isSettingColumns={isSettingColumns}
                    drillDown={drillDown}
                    headCells={headWithSubCells}
                    withRowCountInSettingColumn={withRowCountInSettingColumn}
                    handleSelectionClick={handleSelectionClick}
                    onRowClick={onRowClick ? handleRowClick : undefined}
                    onMouseRowEnter={handleMouseRowEnter}
                    onMouseRowLeave={handleMouseRowLeave}
                  />
                );
              })}
            </TableBody>
          </Table>
        </Scrollbars>
      </TableContainer>
      {!disablePaging &&
        (props.shortPagination ? (
          <SapoPagintation2
            nameObjectSelected={nameObjectSelected}
            total={data.total}
            page={page}
            pageSize={pageSize}
            pageChange={handlePageChange}
          />
        ) : (
          <SapoPagintation
            style={{position: "-webkit-sticky"}}
            total={data.total}
            page={page}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            pageChange={handlePageChange}
            pageSizeChange={handlePageSizeChange}
            disablePageSizeChange={disablePageSizeChange}
          />
        ))}
      <ReactTooltip effect="solid" type="light" className={classes.tooltip} />
    </Paper>
  );
});

export default SapoGrid;
