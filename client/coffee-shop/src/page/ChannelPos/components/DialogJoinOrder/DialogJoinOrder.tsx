import { Box, Typography } from "@material-ui/core";
import Dialog from "components/Dialog";
import { useOrderStore } from "page/Orders/store/store";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import TableService, { TableFilterRequest, TableResponse } from "services/TableService";
import { BoxProduct } from "../BoxProduct/BoxProduct";
import { BoxTotal } from "../BoxTotal/BoxTotal";
import useStyles from "./DialogJoinOrder.styles";
import OrderService, { OrderFilter, OrderItemRequest, OrderItemResponse, OrderRequest, OrderResponse } from "services/OrderService";
import { Button, Checkbox, Grid, List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { formatMoney, getMessageError } from "utilities";
import { toString } from "lodash";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import SelectInfinite from "components/Select/SelectInfinite";
import { DataSource } from "components/Select/types";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { useOrderTableStore } from "page/ChannelPos/store";
export type DialogJoinOrderProps = {
    open: boolean;
    onClose: () => void;
    order: OrderResponse;
}
function intersection(a: OrderItemResponse[], b: OrderItemResponse[]) {
    return a.filter((value) => b.find((m) => m.id === value.id));
}

function not(a: OrderItemResponse[], b: OrderItemResponse[]) {
    return a.filter((value) => !b.find((m) => m.id === value.id));
}
export const DialogJoinOrder = (props: DialogJoinOrderProps) => {
    const { open, onClose, order } = props;
    const classes = useStyles();
    const [checked, setChecked] = React.useState<OrderItemResponse[]>([]);
    const [oldOrder, setOldOrder] = React.useState<OrderResponse>();
    const [newOrder, setNewOrder] = React.useState<OrderResponse>();
    const history = useHistory();
    const { isInitData, set } = useOrderTableStore();



    useEffect(() => {
        if (order?.orderItemResponses) setOldOrder(order)
    }, [order]);
    const handleToggle = (value: OrderItemResponse) => () => {
        const orderItem = checked.find((item) => item.id === value.id);
        var newChecked = [...checked];

        if (!orderItem) {
            newChecked.push(value);
        } else {
            newChecked = newChecked.filter((i) => i.id !== orderItem.id);
        }

        setChecked(newChecked);
    };


    const onSplitOrder = async () => {
        var requests: OrderRequest[] = [];

        let orderLineItemOlds: OrderItemRequest[] = [];
        var totalOldOrder = 0;
        oldOrder?.orderItemResponses?.map((item) => {
            let lineItemRequest: OrderItemRequest = {
                id: item.id,
                productId: item.productId,
                combo: item.combo,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            };
            totalOldOrder += item.quantity * item.price;
            orderLineItemOlds.push(lineItemRequest);
        });
        let tableId = order.tableResponses?.map((i) => i.id);
        let requestOrder: OrderRequest = {
            id: order.id,
            customerId: 1,
            note: order.note,
            discountTotal: order?.discountTotal || 0,
            orderItemRequest: orderLineItemOlds,
            code: order.code,
            total: totalOldOrder || 0,
            tableIds: tableId
        };

        requests.push(requestOrder);

        //Đơn mới
        let orderLineItemNews: OrderItemRequest[] = [];
        var totalNewOrder = 0;
        newOrder?.orderItemResponses?.map((item) => {
            let lineItemRequest: OrderItemRequest = {
                id: item.id,
                productId: item.productId,
                combo: item.combo,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            };
            totalNewOrder += item.quantity * item.price;
            orderLineItemNews.push(lineItemRequest);
        });
        let requestNewOrder: OrderRequest = {
            id: newOrder?.id,
            customerId: 1,
            note: order.note,
            discountTotal: 0,
            orderItemRequest: orderLineItemNews,
            code: null,
            total: totalNewOrder || 0,
            tableIds: tableId,
            status: order.status,
            paymentStatus: order.paymentStatus,
        };

        requests.push(requestNewOrder);
        try {
            var res = await OrderService.joinOrder(requests, toString(order.id));
            if (res) {
                SnackbarUtils.success("Gộp đơn thành công");
                onClose();
                set((prev) => ({...prev, isInitData: true,}))
            }
        } catch (error) {
            SnackbarUtils.error(getMessageError(error));

        }

    }

    const customList = (items: OrderItemResponse[], isNewOrder: boolean) => (
        <Paper sx={{ width: 500, height: 230, overflow: 'auto' }}>
            <List dense component="div" role="list">
                {items.map((value: OrderItemResponse) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItem
                            key={value.id}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value.name} -------- ${value.quantity} x ${formatMoney(value.price)}đ`} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );

    

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                title={"Gộp đơn hàng"}
                onOk={() => { onSplitOrder() }}
                textOk={"Lưu"}
                minWidthPaper="40%"
                textCancel={"Thoát"}
                isCancel={true}
                DialogTitleProps={{
                    dividerBottom: true
                }}
                children={
                    <Box padding={"6px"} style={{ maxHeight: 1000, display: "flex" }}>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item >
                                <Typography style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Đơn hàng {order.code}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography style={{  fontSize: 16, fontWeight: "bold", marginBottom: 10, marginTop: 40 }}>Đơn hàng cần gộp {newOrder ? newOrder.code : "---"}</Typography>
                                <Box style={{}}>
                                    <Box>
                                        <SelectInfinite
                                            getOptionLabel={(item) => item?.name || ""}
                                            fetchDataSource={async (filter: OrderFilter) => {
                                                filter.statuses = "5,3";
                                                filter.paymentStatus = "1";
                                                let res = await OrderService.filter(filter);
                                                const dataSource = {} as DataSource;
                                                if (res.data.data) {
                                                    dataSource.data = res.data.data;
                                                    dataSource.metaData = {
                                                        totalPage: Math.ceil((res.data.metadata?.total || 0) / (filter.limit || 10)),
                                                        totalItems: (res.data.metadata?.total || 0),
                                                    };
                                                }
                                                return Promise.resolve(dataSource);
                                            }}
                                            onQueryChange={(filter: any) => {
                                                let dataSourceFilter: OrderFilter = {
                                                    limit: 10,
                                                    query: filter.query,
                                                    page: filter.page || 1,
                                                };
                                                return dataSourceFilter;
                                            }}
                                            renderOption={(option: OrderResponse) => (
                                                <Box style={{ width: "100%", lineHeight: "40px", padding: "16px 0px", cursor: "pointer", zIndex: 10000}}>
                                                    <Typography style={{ marginLeft: "16px" }}>{option.code} - Tổng: {formatMoney(option.total)}</Typography>
                                                </Box>
                                            )}
                                            placeholder="Tìm kiếm nguyên liệu"
                                            onChange={(order: OrderResponse) => {
                                                setNewOrder(order);
                                            }}
                                            value={null}
                                            className={classes.infiniteList}
                                            NoResultsComponent={() => (
                                                <NoResultsComponent
                                                    nameObject="đơn hàng"
                                                    helpText={"Thử thay đổi từ khóa tìm kiếm hoặc thêm mới"}
                                                    style={{ padding: "48px 0 84px" }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                }
            />
        </Fragment>
    );
};
