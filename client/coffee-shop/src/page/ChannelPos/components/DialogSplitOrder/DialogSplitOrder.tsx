import { Box, Typography } from "@material-ui/core";
import Dialog from "components/Dialog";
import { useOrderStore } from "page/Orders/store/store";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import TableService, { TableFilterRequest, TableResponse } from "services/TableService";
import { BoxProduct } from "../BoxProduct/BoxProduct";
import { BoxTotal } from "../BoxTotal/BoxTotal";
import useStyles from "./DialogSplitOrder.styles";
import OrderService, { OrderItemRequest, OrderItemResponse, OrderRequest, OrderResponse } from "services/OrderService";
import { Button, Checkbox, Grid, List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { formatMoney, getMessageError } from "utilities";
import { toString } from "lodash";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
export type DialogSplitOrderProps = {
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
export const DialogSplitOrder = (props: DialogSplitOrderProps) => {
    const { open, onClose, order } = props;
    const {
        addLineItem,
        updateLineItem,
        deleteLineItem,
        lineItems,
        code,
        note,
        set,
        customer,
        total,
        discountTotal,
        reset,
    } = useOrderStore();
    const classes = useStyles();
    const [checked, setChecked] = React.useState<OrderItemResponse[]>([]);
    const [oldOrder, setOldOrder] = React.useState<OrderItemResponse[]>([]);
    const [newOrder, setNewOrder] = React.useState<OrderItemResponse[]>([]);
    const history = useHistory();


    const oldOrderChecked = intersection(checked, oldOrder);
    const newOrderChecked = intersection(checked, newOrder);

    useEffect(() => {
        if (order?.orderItemResponses) setOldOrder(order.orderItemResponses)
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

    const handleAllRight = () => {
        setNewOrder(newOrder.concat(oldOrder));
        setOldOrder([]);
    };

    const handleCheckedRight = () => {
        setNewOrder(newOrder.concat(oldOrderChecked));
        setOldOrder(not(oldOrder, oldOrderChecked));
        setChecked(not(checked, oldOrderChecked));
    };

    const handleCheckedLeft = () => {
        setOldOrder(oldOrder.concat(newOrderChecked));
        setNewOrder(not(newOrder, newOrderChecked));
        setChecked(not(checked, newOrderChecked));
    };

    const handleAllLeft = () => {
        setOldOrder(oldOrder.concat(newOrder));
        setNewOrder([]);
    };

    const onSplitOrder = async() => {
        var requests: OrderRequest[] = [];

        let orderLineItemOlds: OrderItemRequest[] = [];
        var totalOldOrder = 0;
        oldOrder.map((item) => {
            let lineItemRequest: OrderItemRequest = {
                id: item.id,
                productId: item.productId,
                combo: item.combo,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            };
            totalOldOrder += item.quantity*item.price;
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
        newOrder.map((item) => {
            let lineItemRequest: OrderItemRequest = {
                id: item.id,
                productId: item.productId,
                combo: item.combo,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            };
            totalNewOrder += item.quantity*item.price;
            orderLineItemNews.push(lineItemRequest);
        });
        let requestNewOrder: OrderRequest = {
            id: 0,
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
            var res = await OrderService.splitOrder(requests, toString(order.id));
            if(res){
                SnackbarUtils.success("Tách đơn thành công");
                onClose();
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

    const totalOldOrder = useMemo(() => {
        var total = 0;
        oldOrder.map((i) => {
            total += i.quantity * i.price;
        })
        return total;
    }, [oldOrder])

    const totalNewOrder = useMemo(() => {
        var total = 0;
        newOrder.map((i) => {
            total += i.quantity * i.price;
        })
        return total;
    }, [newOrder])

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                title={"Tách đơn hàng"}
                onOk={() => {onSplitOrder() }}
                textOk={"Lưu"}
                minWidthPaper="70%"
                textCancel={"Thoát"}
                isCancel={true}
                DialogTitleProps={{
                    dividerBottom: true
                }}
                children={
                    <Box padding={"6px"} style={{ maxHeight: 1000, display: "flex" }}>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item >
                                <Typography style={{fontSize: 16, fontWeight: "bold", marginBottom: 10}}>Đơn hàng {order.code}</Typography>
                                {customList(oldOrder, false)}
                                <ListItem>
                                    <ListItemText primary={`Tổng: `} />
                                    <ListItemText primary={`${formatMoney(totalOldOrder)}đ`} />
                                </ListItem>
                            </Grid>
                            <Grid item>
                                <Grid container direction="column" alignItems="center">
                                    <Button
                                        sx={{ my: 0.5 }}
                                        variant="outlined"
                                        size="small"
                                        onClick={handleAllRight}
                                        disabled={oldOrder.length === 0}
                                        aria-label="move all right"
                                    >
                                        ≫
                                    </Button>
                                    <Button
                                        sx={{ my: 0.5 }}
                                        variant="outlined"
                                        size="small"
                                        onClick={handleCheckedRight}
                                        disabled={oldOrderChecked.length === 0}
                                        aria-label="move selected right"
                                    >
                                        &gt;
                                    </Button>
                                    <Button
                                        sx={{ my: 0.5 }}
                                        variant="outlined"
                                        size="small"
                                        onClick={handleCheckedLeft}
                                        disabled={newOrderChecked.length === 0}
                                        aria-label="move selected left"
                                    >
                                        &lt;
                                    </Button>
                                    <Button
                                        sx={{ my: 0.5 }}
                                        variant="outlined"
                                        size="small"
                                        onClick={handleAllLeft}
                                        disabled={newOrder.length === 0}
                                        aria-label="move all left"
                                    >
                                        ≪
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item>
                            <Typography style={{fontSize: 16, fontWeight: "bold", marginBottom: 10}}>Đơn hàng mới tách</Typography>
                                {customList(newOrder, true)}
                                <ListItem>
                                    <ListItemText primary={`Tổng: `} />
                                    <ListItemText primary={`${formatMoney(totalNewOrder)}đ`} />
                                </ListItem>
                            </Grid>
                        </Grid>
                    </Box>
                }
            />
        </Fragment>
    );
};
