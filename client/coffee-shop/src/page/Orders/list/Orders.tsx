import { Box, Typography, withStyles } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import Button from "components/Button";
import LoadingAuth from "components/Loading/LoadingAuth";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { DataResult, GridPageChangeEvent } from "components/SapoGrid/SapoGrid.type";
import { CellTemplateProps } from "components/SapoGridSticky";
import SearchBox from "components/SearchBox/SearchBox";
import useQueryParams from "hocs/useQueryParams";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { IngredientFilterRequest } from "services/IngredientsService";
import { ItemFilterRequest } from "services/ItemsService";
import { OrderFilterRequest } from "services/OrderService";
import OrderService from "services/OrderService/OrderService";
import { AppState } from "store/store";
import {
    formatDateUTCToLocalDateString, formatMoney
} from "utilities";
import QueryUtils from "utilities/QueryUtils";
import { OrdersQuickFilterOptions, getOrdersQuickFilterLabel } from "./OrderFilter.constant";
import styles from "./Orders.styles";
import {
    OrdersProps
} from "./Orders.types";

const Orders = (props: OrdersProps & PropsFromRedux) => {
    const { classes, authState } = props;
    const location = useLocation();
    const queryParams = useQueryParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<DataResult>({
        data: [],
        total: 0,
    });
    const history = useHistory();
    const getDefaultQuery = () => {
        // Không hiểu tại sao useQueryParams không dùng đk
        const currentFilter = props.history.location.search as string;
        const dataFromQuery: any = {};
        for (let searchFilter of currentFilter.slice(1).split("&")) {
            const data = searchFilter.split("=");
            dataFromQuery[data[0]] = decodeURIComponent(data[1]);
        }
        const initFilter: ItemFilterRequest = {
            page: Number(dataFromQuery["page"]) || 1,
            limit: Number(dataFromQuery["limit"]) || undefined,
            query: dataFromQuery["query"] || undefined,
        };
        return initFilter;
    };
    const [filters, setFilters] = useState<ItemFilterRequest>({
        ...getDefaultQuery(),
    });
    useEffect(() => {
        let filters = getDefaultQuery();
        initData(filters);
    }, [location.search]);
    const changeQueryString = (filters: Record<string, any>) => {
        const queryString = QueryUtils.buildQueryString(filters);
        history.replace({
            search: queryString,
        });
    };
    useEffect(() => {
        document.title = "Danh sách nguyên liệu";
    }, []);

    const initData = async (filters: OrderFilterRequest) => {
        let res = await OrderService.filter(filters);
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
        const newFilters: IngredientFilterRequest = {
            ...filters,
            page: 1,
            query: value?.trim(),
        };
        setFilters((prev) => ({ ...prev, query: value?.trim() }))
        changeQueryString(newFilters);
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
                                    onRowClick={(e, data) => { history.push(`/admin/items/${data.id}`)}}
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
                                        width={150}
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
                                        field="accountName"
                                        title={getOrdersQuickFilterLabel(
                                            OrdersQuickFilterOptions.ACCOUNT_NAME
                                        )}
                                        width={150}
                                        align="left"
                                    />
                                    {/* <GridColumn
                                        field="unit"
                                        title={getItemsQuickFilterLabel(
                                            ItemsQuickFilterOptions.UNIT
                                        )}
                                        width={150}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {dataItem.stockUnitResponse?.name}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn> */}
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

