import { Box, RootRef } from "@material-ui/core";
import SapoPagintation from "components/SapoGrid/Paging/SapoPagination";
import { DEFAULT_PAGE, DEFAULT_PAGESIZE, DEFAULT_PAGESIZE_OPTIONS } from "components/SapoGrid/SapoGrid.constants";
import { GridDataStateChangeEvent, GridState } from "components/SapoGrid/SapoGrid.type";
import { isArray } from "lodash";
import React, { ReactElement, SyntheticEvent, useCallback, useEffect, useMemo, useRef } from "react";
import ScrollBars from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import StickyGridHeader from "./components/Header/StickyGridHeader";
import initSapoGridHeadSticky from "./components/initSapoGridHeadSticky";
import RowComponent from "./components/Row";
import useStyles from "./SapoGridSticky.styles";
import SapoGridStickyProps, { BodyCell, HeadCell } from "./SapoGridSticky.types";
import ReactTooltip from "react-tooltip";
import clsx from "clsx";

const SapoGridSticky: React.FunctionComponent<SapoGridStickyProps> = (props) => {
  const {
    data,
    children,
    maxHeight,
    width,
    settingColumns,
    stickyHeader,
    stickyHeaderTop = 0,
    onDataStateChange,
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGESIZE,
    pageSizeOptions = DEFAULT_PAGESIZE_OPTIONS,
    disablePaging,
    disablePageSizeChange,
    onPageChange,
    selectBy = "id",
  } = props;
  const classes = useStyles();
  const headerRef = useRef<any>();

  const headCells = useMemo(() => {
    let cells: HeadCell[] = [];
    const childrens = React.Children.toArray(children);
    childrens.forEach((child: any) => {
      if (child?.type?.displayName === "SapoGridHeadSticky") {
        cells = initSapoGridHeadSticky(child, settingColumns);
      }
    });
    return cells;
  }, [settingColumns]);
  const bodyCells = useMemo(() => {
    const childrens = React.Children.toArray(children);
    const columnElements: ReactElement[] = [];
    childrens.forEach((child: any) => {
      if (child?.type?.displayName === "SapoGridBody") {
        if (child?.props?.children) {
          child.props.children.forEach((subChild: any) => {
            if (isArray(subChild)) {
              subChild.forEach((subChild2: any) => {
                if (subChild2?.type?.displayName === "SapoGridColumn") {
                  columnElements.push(subChild2);
                }
              });
            } else if (subChild?.type?.displayName === "SapoGridColumn") {
              columnElements.push(subChild);
            }
          });
        }
      }
    });
    const cells: BodyCell[] = [];
    columnElements.forEach((col) => {
      const cell: BodyCell = {
        disablePadding: false,
        property: col.props.field,
        label: col.props.title,
        template: col.props.children,
        sortable: col.props.sortable,
        width: col.props.width,
        align: col.props.align,
        style: col.props.style,
        classname: col.props.className,
        sticky: col.props.sticky,
      };
      if (settingColumns) {
        cell.display = settingColumns[cell.property];
      } else {
        cell.display = true;
      }
      cells.push(cell);
    });
    return cells;
  }, [settingColumns]);

  const handleSrollLeft = (e: HTMLElement) => {
    if (headerRef && headerRef.current) {
      headerRef.current.scrollLeft = e.scrollLeft;
    }
  };

  const handleTableScroll = (e: React.UIEvent<HTMLElement>) => {
    if (headerRef && headerRef.current) {
      headerRef.current.scrollTop = e.currentTarget.scrollTop;
      headerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const getArguments = useCallback((syntheticEvent: SyntheticEvent) => {
    return {
      nativeEvent: syntheticEvent && syntheticEvent.nativeEvent,
      syntheticEvent: syntheticEvent,
    };
  }, []);

  const getDataState = useCallback((): GridState => {
    return {
      page: page,
      pageSize: pageSize,
    };
  }, [page, pageSize]);

  const raiseDataEvent = useCallback(
    (handler: any, data: any, moreData: any, syntheticEvent: SyntheticEvent) => {
      if (handler) {
        handler.call(undefined, Object.assign({}, getArguments(syntheticEvent), data));
      } else if (onDataStateChange) {
        onDataStateChange(
          Object.assign({}, getArguments(syntheticEvent), {
            dataState: Object.assign({}, getDataState(), moreData),
          } as GridDataStateChangeEvent)
        );
      }
    },
    [getDataState, getArguments]
  );

  const handlePageChange = useCallback(
    (event: React.SyntheticEvent<HTMLElement>, newPage: number) => {
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
    },
    [raiseDataEvent, pageSize]
  );

  const handlePageSizeChange = useCallback(
    (event: React.SyntheticEvent<HTMLElement>, newPageSize: number) => {
      raiseDataEvent(
        onPageChange,
        { page: { page: 1, pageSize: newPageSize } },
        { page: 1, pageSize: newPageSize },
        event
      );
    },
    [raiseDataEvent]
  );

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [data, settingColumns]);

  return (
    <div className={classes.root} style={{ width: width }}>
      <RootRef rootRef={headerRef}>
        <StickyGridHeader cells={headCells} sticky={stickyHeader} top={stickyHeaderTop} />
      </RootRef>
      <ScrollBars onScrollX={handleSrollLeft}>
        <Box maxHeight={maxHeight} className={clsx(classes.body, "TableBody")} onScroll={handleTableScroll}>
          {data.data.map((row, index) => (
            <RowComponent key={`${index}-${row[selectBy]}`} data={row} index={index} bodyCells={bodyCells} />
          ))}
        </Box>
      </ScrollBars>
      {!disablePaging && (
        <SapoPagintation
          total={data.total}
          page={page}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          pageChange={handlePageChange}
          pageSizeChange={handlePageSizeChange}
          disablePageSizeChange={disablePageSizeChange}
        />
      )}
      <ReactTooltip effect="solid" type="light" className={classes.tooltip} />
    </div>
  );
};

SapoGridSticky.displayName = "SapoGridSticky";
export default SapoGridSticky;
