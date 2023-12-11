import { Box, Dialog, DialogTitle, Grid, IconButton, Slide, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import Chip from "components/Chip/Chip.component";
import DialogContent from "components/Dialog/DialogContent";
import { CloseIcon } from "components/SVG";
import { OrderStatus } from "page/Orders/utils/OrderContants";
import React, { useEffect, useState } from "react";
import OrderService, { OrderFilter, OrderItemResponse } from "services/OrderService";
import { TableOrderResponses } from "services/TableService";
import { colorBlue } from "theme/palette";
import { formatMoney, getMessageError } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import useStyles from "./BoxOrder.style";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { ArrowDropUp } from "@material-ui/icons";

export type BoxOrderProps = {
    open: boolean;
    onClose: () => void;
    classRoot?: string;
}

export const BoxOrder = (props: BoxOrderProps) => {
    const classes = useStyles();
    const {
        onClose,
        open,
        classRoot,
    } = props;
    const [orders, setOrders] = useState<TableOrderResponses>({
        data: [],
        metadata: {
            limit: 20,
            page: 1,
            total: 0,
        }
    });

    const [filter, setFilter] = useState<OrderFilter>({
        statuses: "1,2,5",
    });
    const handleClose = () => {
        onClose();
    };
    useEffect(() => {
        initData();
    }, [open])
    const initData = async () => {
        try {
            var res = await OrderService.filter(filter);
            if (res.data) {
                setOrders(res.data);
            }
        } catch (error) {
            SnackbarUtils.error(getMessageError(error));
        }
    }
    const renderOrderStatus = (status?: number) => {
        switch (status) {
            case OrderStatus.DRAFT:
                return <Chip className="default" variant="outlined" size="small" label={OrderStatus.getName(status)} />;
            case OrderStatus.IN_PROGRESS:
                return <Chip className="info" variant="outlined" size="small" label={OrderStatus.getName(status)} />;
            case OrderStatus.WAITING_DELIVERY:
                return <Chip className="warning" variant="outlined" size="small" label={OrderStatus.getName(status)} />;
            case OrderStatus.COMPLETED:
                return <Chip className="success" variant="outlined" size="small" label={OrderStatus.getName(status)} />;
            case OrderStatus.DELETED:
                return <Chip className="danger" variant="outlined" size="small" label={OrderStatus.getName(status)} />;
            default:
                return "";
        }
    };

    const handleOpenDrillDown = (orderId: number) => {
        if (orders.data) {
            setOrders({
                ...orders,
                data: orders.data.map((item) => {
                    if (item.id === orderId) {
                        return {
                            ...item,
                            isShow: !item.isShow,
                        }
                    } else return item;
                })
            })
        }
    }
    const totalQuantity = (lineItems: OrderItemResponse[]) => {
        var total = 0;
        if (lineItems && lineItems.length > 0) {
            lineItems.map((i) => (total += i.quantity));
        }
        return total;
    }

    const totalPrice = (lineItems: OrderItemResponse[]) => {
        var total = 0;
        if (lineItems && lineItems.length > 0) {
            lineItems.map((i) => (total += i.quantity * i.price));
        }
        return total;
    }
    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="filter-dialog"
            open={open}
            TransitionComponent={Slide}
            TransitionProps={{ direction: "left", timeout: 400 } as any}
            fullWidth={true}
            maxWidth="sm"
            disableBackdropClick
            disableRestoreFocus
            disableEnforceFocus
            classes={{
                paper: `${classes.dialog} ${classRoot ?? ""}`,
            }}
        >
            <DialogTitle classes={{ root: classes.dialogTitle }} disableTypography>
                <Box display="flex" alignItems="center">
                    <Typography className="title">Danh sách đơn hàng đang phục vụ</Typography>
                </Box>
                <IconButton aria-label="close" onClick={handleClose} classes={{ root: classes.iconButtonClose }}>
                    <CloseIcon className={classes.iconClose} />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers={true} dividerBottom={true} className={classes.dialogContent}>
                <Box padding={"10px"}>
                    {orders.data && orders.data?.map((item) => (
                        <Box key={item.id} onClick={() => { handleOpenDrillDown(item.id) }}>
                            <Grid xs={12} container spacing={2}>
                                <Grid item xs={1}>
                                    <Box style={{ marginTop: -3 }}><IconButton style={{ width: 20, height: 20 }}>{item.isShow ? <ArrowDropUp style={{ width: 20, color: colorBlue.primary.main }} /> : <ArrowDropDownIcon style={{ width: 20 }} />}</IconButton></Box>
                                </Grid>
                                <Grid item xs={3} onClick={() => { handleOpenDrillDown(item.id) }}><Typography style={{ color: colorBlue.primary.main, fontSize: 12, cursor: "pointer" }}>{item.code}</Typography></Grid>
                                <Grid item xs={4}>{item.tableResponses && item.tableResponses?.map((t) => t.name).join(", ")}</Grid>
                                <Grid item xs={4}>{renderOrderStatus(item.status)}</Grid>
                            </Grid>
                            {item.isShow && (
                                <Box style={{ border: "1px solid #D3D5D7", margin: "10px", borderRadius: 3, padding: "5px" }}>
                                    <Box>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell width="70%">Tên</TableCell>
                                                    <TableCell>SL</TableCell>
                                                    <TableCell align="right">Giá</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {item.orderItemResponses && item.orderItemResponses.map((lineItem, index) => (
                                                    <TableRow>
                                                        <TableCell><Typography  style={{fontSize: 12}}>{lineItem.name}</Typography></TableCell>
                                                        <TableCell><Typography  style={{fontSize: 12}}>{lineItem.quantity}</Typography></TableCell>
                                                        <TableCell align="right"><Typography  style={{fontSize: 12}}>{formatMoney(lineItem.price)}</Typography></TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell><Typography></Typography></TableCell>
                                                    <TableCell><Typography  style={{fontSize: 12}}>{item.orderItemResponses && totalQuantity(item.orderItemResponses)}</Typography></TableCell>
                                                    <TableCell align="right"><Typography  style={{fontSize: 12}}>{item.orderItemResponses &&  formatMoney(totalPrice(item.orderItemResponses))}</Typography></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>

                                    </Box>
                                </Box>
                            )}
                        </Box>
                    ))
                    }
                </Box>
            </DialogContent>
        </Dialog>
    );
}