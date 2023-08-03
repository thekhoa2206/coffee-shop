import { Box, Typography, withStyles } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import Button from "components/Button";
import Chip from "components/Chip/Chip.component";
import Image from "components/Image";
import LoadingAuth from "components/Loading/LoadingAuth";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { DataResult, GridPageChangeEvent } from "components/SapoGrid/SapoGrid.type";
import { CellTemplateProps } from "components/SapoGridSticky";
import SearchBox from "components/SearchBox/SearchBox";
import ListTagFilterItem from "components/TagFilterItem";
import useQueryParams from "hocs/useQueryParams";
import FiberManualRecordIcon from "images/order/full_circle.svg";
import FiberManualRecordOutlinedIcon from "images/order/none_circle.svg";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { IOOrderFilter, OrderFilter, OrderFilterModel } from "services/OrderService";
import OrderService from "services/OrderService/OrderService";
import { AppState } from "store/store";
import {
    convertDateUTCToLocalDate,
    formatDateUTC,
    formatDateUTCToLocalDateString, formatMoney
} from "utilities";
import QueryUtils from "utilities/QueryUtils";
import { OrderStatus, PaymentStatus } from "../utils/OrderContants";
import { OrdersQuickFilterOptions, getOrdersQuickFilterLabel } from "./OrderFilter.constant";
import styles from "./Orders.styles";
import {
    OrdersProps
} from "./Orders.types";
import OrderFilterOther from "./components/OrderFilterOther";
import { cloneDeep, toString } from "lodash";
import { TagFilterItemType } from "components/TagFilterItem/TagFilterItem.types";
import { convertPredefinedToDate } from "utilities/DateRangesPredefine";
import { OrderFilterHelpers } from "./components/OrderFilterHelpers";

const Orders = (props: OrdersProps & PropsFromRedux) => {
    const { classes, authState } = props;
    const location = useLocation();
    const queryParams = useQueryParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [tagsFilterItem, setTagsFilterItem] = useState<TagFilterItemType[]>([]);
    const [data, setData] = useState<DataResult>({
        data: [],
        total: 0,
    });
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const history = useHistory();
    const getDefaultQuery = () => {
        // Không hiểu tại sao useQueryParams không dùng đk
        const currentFilter = props.history.location.search as string;
        const dataFromQuery: any = {};
        for (let searchFilter of currentFilter.slice(1).split("&")) {
            const data = searchFilter.split("=");
            dataFromQuery[data[0]] = decodeURIComponent(data[1]);
        }
        const initFilter: OrderFilter = {
            page: Number(dataFromQuery["page"]) || 1,
            limit: Number(dataFromQuery["limit"]) || undefined,
            query: dataFromQuery["query"] || undefined,
            modifiedOnMax: queryParams.get("modifiedOnMax") || undefined,
            modifiedOnMin: queryParams.get("modifiedOnMin") || undefined,
            modifiedOnPredefined: queryParams.get("modifiedOnPredefined")
                ? toString(queryParams.get("modifiedOnPredefined"))
                : undefined,
            createdOnMax: queryParams.get("createdOnMax") || undefined,
            createdOnMin: queryParams.get("createdOnMin") || undefined,
            createdOnPredefined: queryParams.get("createdOnPredefined")
                ? toString(queryParams.get("createdOnPredefined"))
                : undefined,
            statuses: queryParams.get("statuses") || undefined,
            paymentStatus: queryParams.get("paymentStatus") || undefined,

        };
        return initFilter;
    };
    const [filters, setFilters] = useState<IOOrderFilter>(new OrderFilter());
    const [filterModel, setFilterModel] = useState<OrderFilterModel | null>(null);
    useEffect(() => {
        let filters = getDefaultQuery();
        OrderFilterHelpers.fetchDataFilterItems(filters).then((
            { filterModel, tagsFilterItem }) => {
            setFilterModel(filterModel);
            setTagsFilterItem(tagsFilterItem);
        })
        setFilters(filters);
        initData(filters);
    }, [location.search]);
    const changeQueryString = (filters: Record<string, any>) => {
        const queryString = QueryUtils.buildQueryString(filters);
        history.replace({
            search: queryString,
        });
    };
    useEffect(() => {
        document.title = "Danh sách đơn hàng";
    }, []);

    const initData = async (filters: OrderFilter) => {
        let _filters = cloneDeep(filters);
        if (_filters.createdOnPredefined) {
            let newDateCreatedOn = convertPredefinedToDate(_filters.createdOnPredefined);
            _filters.createdOnMin = formatDateUTC(newDateCreatedOn.startDate, false);
            _filters.createdOnMax = formatDateUTC(newDateCreatedOn.endDate, true);
        }
        if (_filters.modifiedOnPredefined) {
            let newDateCreatedOn = convertPredefinedToDate(_filters.modifiedOnPredefined);
            _filters.modifiedOnMin = formatDateUTC(newDateCreatedOn.startDate, false);
            _filters.modifiedOnMax = formatDateUTC(newDateCreatedOn.endDate, true);
        }
        let res = await OrderService.filter(_filters);
        if (res.data) setData({
            data: res.data.data?.map((item, index) => {
                return {
                    stt: index + 1,
                    createdBy: item.createdBy,
                    createdOn: item.createdOn,
                    id: item.id,
                    modifiedBy: item.modifiedBy,
                    modifiedOn: item.modifiedOn,
                    code: item.code,
                    status: item.status,
                    discount: item.discountTotal,
                    note: item.note,
                    name: item.customerResponse?.name,
                    phone: item.customerResponse?.phoneNumber,
                    total: item.total,
                    accountName: item.userResponse?.name,
                }
            }) || [], total: res.data.metadata?.total || 0
        })
        setLoading(false)
    };
     const handlePageChange = (e: GridPageChangeEvent) => {
        setLoading(true)
        const page = e.page;
        const newParams: Record<string, any> = {
            ...Object.fromEntries(queryParams),
            page: page.page,
            limit: page.pageSize,
        };
        setFilters((prev) => ({ ...prev, limit: page.pageSize, page: page.page }))
        changeQueryString(newParams);
    };
    const handleSearch = (value: any) => {
        if (!value || !value?.trim()) {
        }
        const newFilters: IOOrderFilter = {
            ...filters,
            page: 1,
            query: value?.trim(),
        };
        setFilters((prev) => ({ ...prev, query: value?.trim() }))
        changeQueryString(newFilters);
    };

    const renderOrderStatus = (status?: number) => {
        switch (status) {
            case OrderStatus.DRAFT:
                return <Chip className="default" variant="outlined" size="medium" label={OrderStatus.getName(status)} />;
            case OrderStatus.IN_PROGRESS:
                return <Chip className="info" variant="outlined" size="medium" label={OrderStatus.getName(status)} />;
            case OrderStatus.WAITING_DELIVERY:
                return <Chip className="warning" variant="outlined" size="medium" label={OrderStatus.getName(status)} />;
            case OrderStatus.COMPLETED:
                return <Chip className="success" variant="outlined" size="medium" label={OrderStatus.getName(status)} />;
            case OrderStatus.DELETED:
                return <Chip className="danger" variant="outlined" size="medium" label={OrderStatus.getName(status)} />;
            default:
                return "";
        }
    };
    const renderPaymentStatus = (status?: number) => {
        switch (status) {
            case PaymentStatus.UNPAID:
                return <Image src={FiberManualRecordOutlinedIcon} style={{ width: "12px", height: "12px" }} />;
            case PaymentStatus.PAID:
                return <Image src={FiberManualRecordIcon} style={{ width: "12px", height: "12px" }} />;
            default:
                return <Image src={FiberManualRecordOutlinedIcon} style={{ width: "12px", height: "12px" }} />;
        }
    };


    return (
        <>
            <Box className={classes.container}>
                <Box className={classes.header}>
                    <Box className={classes.headerItem} display="flex">
                        {""}
                    </Box>
                    <Box className={classes.headerItem}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutline />}
                            onClick={() => {
                                history.push("/admin/orders/create");
                            }}
                        >
                            {"Thêm đơn hàng khác"}
                        </Button>
                    </Box>
                </Box>
                <Box className={classes.listBox}>
                    <Box className={classes.utilities}>
                        <Box className={classes.filterAndSearchBox}>
                            <SearchBox
                                placeholder={"Tìm kiếm mã đơn, tên, số điện thoại khách hàng, tên sản phẩm ..."}
                                onSubmit={(e, value) => { handleSearch(value) }}
                                value={null}
                                onBlur={(value: any) => {
                                    if (value !== filters.query) handleSearch(value);
                                }}
                                className={classes.searchbox}
                            />
                            <Button onClick={() => { setOpenFilter(true) }}>Bộ lọc</Button>
                            <OrderFilterOther
                                open={openFilter}
                                filters={filters}
                                filterModel={filterModel}
                                setOpen={setOpenFilter}
                                onSubmit={(newFilter) => {
                                    changeQueryString({ ...newFilter, page: 1 });
                                    setOpenFilter(false);
                                }}
                            />
                        </Box>
                        <Box>
                            <ListTagFilterItem
                                data={tagsFilterItem}
                                handleClickTagFilter={(filterName) => {
                                    setOpenFilter(true);
                                    setTimeout(() => {
                                        document.querySelector(`[filter-name=${filterName}]`)?.scrollIntoView();
                                    }, 300);
                                }}
                                handleDeleteTagFilter={(filterType) => {
                                    let newFilterQuery = cloneDeep(filters) as IOOrderFilter;
                                    filterType.split(",").forEach((item) => {
                                        (newFilterQuery as any)[`${item}`] = undefined;
                                    });
                                    changeQueryString({ ...newFilterQuery, page: 1 });
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
                                    tableDrillDown
                                    stickyHeaderTop={52}
                                    onRowClick={(e, data) => { history.push(`/admin/orders/${data.id}`) }}
                                    disablePaging={false}
                                >
                                    <GridColumn
                                        field="stt"
                                        title={"STT"}
                                        width={80}
                                        align="center"
                                    />
                                    <GridColumn
                                        field="code"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.CODE
                                        )}
                                        width={100}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {dataItem.code}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="note"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.NOTE
                                        )}
                                        width={100}
                                        align="left"
                                    />
                                    <GridColumn
                                        field="phone"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.PHONE
                                        )}
                                        width={100}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {dataItem?.phone}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="name"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.NAME
                                        )}
                                        width={100}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {dataItem?.name}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="createdOn"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.CREATED_ON
                                        )}
                                        width={100}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {formatDateUTCToLocalDateString(
                                                            dataItem.createdOn,
                                                            false,
                                                            "DD/MM/YYYY"
                                                        )}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="createdOn"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.MODIFIED_ON
                                        )}
                                        width={100}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {formatDateUTCToLocalDateString(
                                                            dataItem.createdOn,
                                                            false,
                                                            "DD/MM/YYYY"
                                                        )}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="total"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.TOTAL
                                        )}
                                        width={100}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {formatMoney(dataItem.total || 0)}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="discount"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.DISCOUNT
                                        )}
                                        width={100}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {formatMoney(dataItem.discountTotal || 0)}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="status"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.STATUS
                                        )}
                                        width={100}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    {renderOrderStatus(dataItem.status)}
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="status"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.PAYMENT_STATUS
                                        )}
                                        width={100}
                                        align="center"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    {renderPaymentStatus(dataItem.paymentStatus)}
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    {/* <GridColumn
                                        field="accountName"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.ACCOUNT_NAME
                                        )}
                                        width={150}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        ---
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn> */}
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
        </>
    );
};

const mapStateToProps = (state: AppState) => ({
    menuState: state.menu,
    authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(Orders));

