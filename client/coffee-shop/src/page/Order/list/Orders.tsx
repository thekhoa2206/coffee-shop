import { Box, IconButton, Link, MenuItem, Typography, WithStyles, withStyles } from "@material-ui/core";
import { Replay } from '@material-ui/icons';
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import Button from "components/Button";
import Chip from "components/Chip";
import LoadingAuth from "components/Loading/LoadingAuth";
import useModal from "components/Modal/useModal";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { SapoGridToolbarProps } from "components/SapoGrid/Header/SapoGridHeader.type";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { DataResult, GridPageChangeEvent, GridSelectionChangeEvent } from "components/SapoGrid/SapoGrid.type";
import { GridToolbar } from "components/SapoGrid/Toolbar/GridToolbar";
import { CellTemplateProps } from "components/SapoGridSticky";
import SearchBox from "components/SearchBox/SearchBox";
import Select from "components/Select/Index";
import SettingColumnsV2 from "components/SettingColumnsV2/SettingColumnsV2";
import ListTagFilterItem from "components/TagFilterItem";
import { TagFilterItemType } from "components/TagFilterItem/TagFilterItem.types";
import Tooltip from "components/Tooltip";
import useQueryParams from "hocs/useQueryParams";
import i18next from "i18next";
import { cloneDeep } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { AccountFilterRequest } from "services/AccountService";
import OrdersService, { OrdersFilter, OrdersFilterRequest, OrdersResponse } from "services/OrdersService";
import { AuthState } from "store/Authenticate/types";
import { AppState } from "store/store";
import { formatDateUTC, formatDateUTCToLocalDateString, formatMoney, getMessageError, hasPermission } from "utilities";
import { AccountRole } from "utilities/AccountRole";
import { convertPredefinedToDate, getNameAndDatePredefined } from "utilities/DateRangesPredefine";
import { OrderStatusHelper } from "utilities/OrderStatusHelper";
import { PaymentStatus } from "utilities/PaymentStatus";
import QueryUtils from "utilities/QueryUtils";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { getOrderColumnsGroup, OrderColumnNames, OrderSettingColumns } from "./OrderColumns";
import styles from "./Orders.styles";
import OrderQuickFilter from "./OrdersFilter/OrdersQuickFilter.component";
import { getOrderQuickFilterLabel, getOrderShipStatusName, getOrderStatusName, OrderQuickFilterOptions, OrderShipStatus, OrderStatus } from "./OrdersFilter/OrdersQuickFilter.consant";
import { IOrderQuickFilter } from "./OrdersFilter/OrdersQuickFilter.type";

export interface OrdersProps extends WithStyles<typeof styles> {
  history: any;
  authState: AuthState;
}

const Orders = (props: OrdersProps & PropsFromRedux) => {
  const { classes, menuState, authState } = props;
  const { openModal } = useModal();
  const [loading, setLoading] = useState<boolean>(true);
  const [tagsFilterItem, setTagsFilterItem] = useState<TagFilterItemType[]>([]);
  const [data, setData] = useState<DataResult>({
    data: [],
    total: 0,
  });
  const location = useLocation();
  const queryParams = useQueryParams();
  const queryParamsRef = useRef<URLSearchParams>(queryParams);
  const [selected, setSelected] = useState<OrdersResponse[]>([]);
  const history = useHistory();  // setting columns
  const [settingColumns, setSettingColumns] = useState<Record<string, boolean>>(OrderSettingColumns);
  const t = i18next.getFixedT(null, ["customer", "error", "component", "utilities", "order", "common"]);
  const getDefaultQuery = () => {
    // Không hiểu tại sao useQueryParams không dùng đk
    const currentFilter = props.history.location.search as string;
    const dataFromQuery: any = {};
    for (let searchFilter of currentFilter.slice(1).split("&")) {
      const data = searchFilter.split("=");
      dataFromQuery[data[0]] = decodeURIComponent(data[1]);
    }
    const initFilter: OrdersFilterRequest = {
      page: Number(dataFromQuery["page"]) || 1,
      limit: Number(dataFromQuery["limit"]) || 20,
      query: dataFromQuery["query"] || undefined,
      status: dataFromQuery["status"] || undefined,
      created_on_predefined: dataFromQuery["created_on_predefined"] || undefined,
      created_on_min: dataFromQuery["created_on_min"] || undefined,
      created_on_max: dataFromQuery["created_on_max"] || undefined,
    };
    return initFilter;
  };

  const [filters, setFilters] = useState<OrdersFilterRequest>({ ...getDefaultQuery() });
  const changeQueryString = useCallback(
    (filters: Record<string, any>) => {
      const queryString = QueryUtils.buildQueryString(filters);
      history.replace({
        search: queryString,
      });
    },
    [filters]
  );

  useEffect(() => {
    queryParamsRef.current = queryParams;
  }, [queryParams]);

  useEffect(() => {
    document.title = "Danh sách đơn hàng";
  }, []);
  async function fetchDataFilterItems(filters: IOrderQuickFilter) {
    let tagFilter: TagFilterItemType[] = []
    if (!filters.created_on_predefined) {
      if (filters.created_on_max || filters.created_on_min) {
        let label = `Từ ${filters.created_on_min
          ? formatDateUTCToLocalDateString(filters.created_on_min, false)
          : `${t("trước ")}`
          } đến ${filters.created_on_max
            ? formatDateUTCToLocalDateString(filters.created_on_max, true)
            : `${t("hiện tại")}`
          }`;
        tagFilter.push({
          filterType: "created_on_max,created_on_min",
          filterName: OrderQuickFilterOptions.CREATED_ON,
          label: `${getOrderQuickFilterLabel(OrderQuickFilterOptions.CREATED_ON)}: ${label}`,
        });
      }
    } else {
      if (filters.created_on_predefined) {
        tagFilter.push({
          filterType: "created_on_max,created_on_min,created_on_predefined",
          filterName: OrderQuickFilterOptions.CREATED_ON,
          label: `${getOrderQuickFilterLabel(
            OrderQuickFilterOptions.CREATED_ON
          )}: ${getNameAndDatePredefined(filters.created_on_predefined)}`,
        });
      }
    }
    if (filters.status) {
      let statuses = filters.status.split(",");
      let label = statuses.map((item) => getOrderStatusName(item)).join(", ");
      tagFilter.push({
        filterType: "status",
        label: `${getOrderQuickFilterLabel(OrderQuickFilterOptions.STATUS)}: ${label}`,
        filterName: OrderQuickFilterOptions.STATUS,
      });
    }
    setTagsFilterItem(tagFilter);
  }
  const initData = async (filters: OrdersFilterRequest) => {
    if (filters.created_on_predefined) {
      const newDateCreatedOn = convertPredefinedToDate(filters.created_on_predefined);
      filters.created_on_min = formatDateUTC(newDateCreatedOn.startDate, false);
      filters.created_on_max = formatDateUTC(newDateCreatedOn.endDate, true);
    }
    fetchDataFilterItems(filters).then();
    const orderFilter: OrdersFilter = { limit: filters.limit || 20, page: filters.page || 1 };
    orderFilter.created_on_min = filters.created_on_min;
    orderFilter.created_on_max = filters.created_on_max;
    orderFilter.query = filters.query;
    orderFilter.status = filters.status;
    if(authState.user.typeAccount === "ship"){
      orderFilter.shipperId = authState.user.id;
    }
    try {
      let res = await OrdersService.filter(orderFilter);
      if (res) {
        setData({
          data: res.data.list_orders.orders,
          total: res.data.list_orders.metadata?.total || 0,
        })
        setLoading(false)
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error))
    }
  }

  const getAccountStatus = (order: any) => {
    if (!order) {
      return undefined;
    }
    let name = getOrderStatusName(order.status);
    let color = 0;
    switch (order.status) {
      case OrderStatus.CANCEL:
      case OrderStatus.PICKING_FAILED:
      case OrderStatus.DELIVERING_FAILED:
        color = 4;
        break;
      case OrderStatus.FINISH:
      case OrderStatus.FINISH:
        color = 2;
        break;
      case OrderStatus.DRAFT:
      case OrderStatus.READY_TO_PICK:
        color = 1;
        break;
      case OrderStatus.DELIVERING:
      case OrderStatus.PICKING:
        color = 3;
        break;
    }
    return { name, color };
  };

  const getShipStatus = (order: any) => {
    if (!order) {
      return undefined;
    }
    let name = getOrderShipStatusName(order.shipStatus);
    let color = 0;
    switch (order.shipStatus) {
      case OrderShipStatus.NO_SHIPPER:
        color = 3;
        break;
      case OrderShipStatus.READY_SHIPPER:
        color = 2;
        break;
      case OrderShipStatus.SEARCHING_SHIPPER:
        color = 1;
        break;
        break;
    }
    return { name, color };
  };
  console.log(selected)
  const onSubmitFilter = (filter: IOrderQuickFilter) => {
    filter.page = 1;
    setFilters(filter);
    changeQueryString(filter);
  };

  const handleSelectionChange = useCallback((e: GridSelectionChangeEvent) => {
    if (!e.dataItems) {
      return;
    }
    setSelected(e.dataItems);
  }, []);
  const handlePageChange = (e: GridPageChangeEvent) => {
    setLoading(true)
    setSelected([]);
    const page = e.page;
    const newParams: Record<string, any> = {
      ...Object.fromEntries(queryParams),
      page: page.page,
      limit: page.pageSize,
    };
    setFilters((prev) => ({ ...prev, limit: page.pageSize || 20, page: page.page }))
    changeQueryString(newParams);
  };

  useEffect(() => {
    let filters = getDefaultQuery();
    initData(filters);
  }, [location.search])

  const handleReFindShipper = async (id: string) => {
    try{
        let res = await OrdersService.reFindShipper(id);
        await initData(filters);
    }catch (Error){
        SnackbarUtils.error(getMessageError(Error))
    }
  }
  const handleSearch = (value: any) => {
    if (!value || !value?.trim()) {
    }
    const newFilters: OrdersFilterRequest = {
      ...filters,
      page: 1,
      query: value?.trim(),
    };
    changeQueryString(newFilters);
  };

  const onToggleSettings = useCallback(() => {
    openModal(SettingColumnsV2, {
      defaultSettings: OrderSettingColumns,
      settingColumns: settingColumns,
      columnGroups: getOrderColumnsGroup(),
      columnNames: OrderColumnNames(),
      sortable: true,
      title: "Tùy chỉnh hiển thị",
    }).result.then((newSettingColumns) => {
      if (newSettingColumns) {
        setSettingColumns(newSettingColumns);
      }
    });
  }, [settingColumns]);


  return <>
      <Box className={classes.container}>
        <Box className={classes.header}>
          <Box className={classes.headerItem} display="flex">
            <IconButton onClick={() => {
              initData(filters);
              SnackbarUtils.success("Tải lại trang thành công!")
            }}>
              <Replay />
            </IconButton>
          </Box>
          {hasPermission([AccountRole.CUSTOMER, AccountRole.ADMIN], authState.user) &&
            <Box className={classes.headerItem}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutline />}
              onClick={() => {
                history.push(`/admin/orders/create`)
              }}
            >
              {"Thêm đơn hàng khác"}
            </Button>
          </Box>
          }
        </Box>
        <Box className={classes.listBox}>
          <Box className={classes.utilities}>
            <Box className={classes.filterAndSearchBox}>
              <SearchBox
                placeholder={"Tìm kiếm đơn hàng theo mã đơn hàng, mã khách hàng, tên khách hàng, sđt khách hàng"}
                onSubmit={(e, value) => {handleSearch(value)}}
                value={null}
                onBlur={(value: any) => {
                  if (value !== filters.query) handleSearch(value);
                }} className={classes.searchbox}
              />
              <OrderQuickFilter
                filters={filters}
                onSubmit={onSubmitFilter} />
            </Box>
            <Box>
              <ListTagFilterItem
                data={tagsFilterItem}
                handleClickTagFilter={(filterName) => {
                  setTimeout(() => {
                    document.querySelector(`[filter-name=${filterName}]`)?.scrollIntoView();
                  }, 300);
                }}
                handleDeleteTagFilter={(filterType) => {
                  let newFilterQuery = cloneDeep(filters) as AccountFilterRequest;
                  filterType.split(",").forEach((item) => {
                    (newFilterQuery as any)[`${item}`] = undefined;
                  });
                  setFilters(newFilterQuery);
                  changeQueryString(newFilterQuery);
                }}
              />
            </Box>
          </Box>
          {loading ? (
            <LoadingAuth />
          ) : (
            <React.Fragment>
              {data.total > 0 ? (
                <SapoGrid
                  data={data}
                  page={filters?.page}
                  pageSize={filters?.limit}
                  onPageChange={handlePageChange}
                  stickyHeader
                  stickyHeaderTop={52}
                  onRowClick={() => { }}
                  disablePaging={false}
                  selectable
                  selectedItems={selected}
                  selectBy={"id"}
                  onSelectionChange={handleSelectionChange}
                  nameObjectSelected="đơn hàng"
                  settingColumns={settingColumns}
                  toogleSettings={onToggleSettings}
                >
                  {selected &&
                    <GridToolbar>
                      {(props: SapoGridToolbarProps) => {
                        return (
                          <Select
                            style={{ height: 36, width: 165 }}
                            className={classes.bulkActions}
                            value=""
                            placeholder={`Chọn thao tác`}
                            onChange={(e) => {
                              if(e.target.value === 1){
                                  if(props.selectedItems){
                                    props.selectedItems.map((item) => {
                                      if(item.shipStatus === OrderShipStatus.NO_SHIPPER){
                                          handleReFindShipper(String(item.id))
                                      }
                                    })
                                    setSelected([])
                                    SnackbarUtils.success(("Các đơn hàng đang được tìm tài xế"))
                                  }else{
                                    SnackbarUtils.error("Chưa chọn đơn hàng!")
                                  }
                              }
                            }}
                            MenuProps={{
                              anchorOrigin: { vertical: "bottom", horizontal: "left" },
                              transformOrigin: { vertical: "top", horizontal: "left" },
                              getContentAnchorEl: null,
                            }}
                          >
                            <MenuItem value={1}>Tìm tài xế</MenuItem>
                          </Select>
                        );
                      }}
                    </GridToolbar>
                  }
                  <GridColumn
                    field="code"
                    title={getOrderQuickFilterLabel(OrderQuickFilterOptions.CODE)}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Link style={{ cursor: "pointer" }} onClick={() => { history.push(`/admin/orders/${dataItem.id}`) }}>
                            {dataItem.code}
                          </Link>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="fee"
                    title={getOrderQuickFilterLabel(OrderQuickFilterOptions.FEE)}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {formatMoney(dataItem.fee)}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="cod"
                    title={getOrderQuickFilterLabel(OrderQuickFilterOptions.COD)}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {formatMoney(dataItem.cod)}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="total"
                    title={getOrderQuickFilterLabel(OrderQuickFilterOptions.TOTAL)}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {formatMoney(dataItem.total)}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="status"
                    title={getOrderQuickFilterLabel(OrderQuickFilterOptions.STATUS)}
                    width={150}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      const orderStatus = getAccountStatus(dataItem);
                      return orderStatus ? (
                        orderStatus.color === 1 ? <Chip variant="outlined" size="small" label={orderStatus.name} className="info" />
                          : orderStatus.color === 2 ? <Chip variant="outlined" size="small" label={orderStatus.name} className="success" />
                            : orderStatus.color === 3 ? <Chip variant="outlined" size="small" label={orderStatus.name} className="warning" />
                              : orderStatus.color === 4 ? <Chip variant="outlined" size="small" label={orderStatus.name} className="danger" />
                                : <Chip size="small" label={orderStatus.name} color="default" />
                      ) : null;
                    }}
                  </GridColumn>
                  <GridColumn
                    field="shipStatus"
                    title={getOrderQuickFilterLabel(OrderQuickFilterOptions.SHIP_STATUS)}
                    width={130}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      const orderShipStatus = getShipStatus(dataItem);
                      return orderShipStatus ? (
                        orderShipStatus.color === 1 ? <Chip variant="outlined" size="small" label={orderShipStatus.name} className="info" />
                          : orderShipStatus.color === 2 ? <Chip variant="outlined" size="small" label={orderShipStatus.name} className="success" />
                            : orderShipStatus.color === 3 ? <Chip variant="outlined" size="small" label={orderShipStatus.name} className="danger" />
                              : <Chip size="small" label={orderShipStatus.name} color="default" />
                      ) : null;
                    }}
                  </GridColumn>
                  <GridColumn
                    field="paymentStatus"
                    align="center"
                    title={"Thanh toán"}
                    width={120}
                  >
                    {({ dataItem }: CellTemplateProps) => (
                      <Tooltip arrow title={PaymentStatus.getName(dataItem.paymentStatus)}>
                        <Typography>{OrderStatusHelper.renderStatusOrderIcon(dataItem.paymentStatus)}</Typography>
                      </Tooltip>
                    )}
                  </GridColumn>
                  <GridColumn
                    field="createdOn"
                    title={getOrderQuickFilterLabel(OrderQuickFilterOptions.CREATED_ON)}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {dataItem.createdOn ? formatDateUTCToLocalDateString(dataItem.createdOn, false, "DD/MM/YYYY") : "---"}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="modifiedOn"
                    title={getOrderQuickFilterLabel(OrderQuickFilterOptions.MODIFIED_ON)}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {dataItem.modifiedOn ? formatDateUTCToLocalDateString(dataItem.modifiedOn, false, "DD/MM/YYYY") : "---"}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="nameCustomer"
                    title={getOrderQuickFilterLabel(OrderQuickFilterOptions.NAME)}
                    width={120}
                    align="center"
                    disableTooltip={false}
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography noWrap>
                            {dataItem.receiptPersonal.name ? dataItem.receiptPersonal.name : "---"}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="phoneCustomer"
                    title={getOrderQuickFilterLabel(OrderQuickFilterOptions.PHONE)}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {dataItem.receiptPersonal.phone ? dataItem.receiptPersonal.phone : "---"}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                </SapoGrid>
              ) : (
                <NoResultsComponent
                  message={"Không tìm thấy kết quả"}
                  helpText={"Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm"}
                />
              )}
            </React.Fragment>
          )}
        </Box>
      </Box>

  </>;
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(Orders));