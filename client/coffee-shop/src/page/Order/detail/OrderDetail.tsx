import { Box, FormControlLabel, Grid, IconButton, InputAdornment, Typography, withStyles } from "@material-ui/core";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "store/store";
import styles from "./OrderDetail.styles";
import HeaderAction from "components/HeaderAction";
import Button from "components/Button";
import { useHistory, useParams } from "react-router-dom";
import StoreService, { CityResponse, DistrictResponse, StoreResponse, WardResponse } from "services/StoreService";
import { DialogAddPaymentOrdersProps, DialogDeleteOrderProps, DialogOrderCancel, OrderDetailProps } from "./OrderDetail.types";
import OrdersService, { OrdersResponse, PaymentRequest, PaymentResponse, PrintFormRequest } from "services/OrdersService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { formatDate, formatMoney, formatNumber, getMessageError, hasPermission } from "utilities";
import { getOrderShipStatusName, getOrderStatusName, OrderShipStatus, OrderStatus } from "../list/OrdersFilter/OrdersQuickFilter.consant";
import Chip from "components/Chip";
import BoxStep from "./component/BoxStep";
import CircularProgress from "components/Loading/CircularProgress";
import { PrintIcon } from "components/SVG";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import useModal from "components/Modal/useModal";
import { OrderUpdateStatusRequest } from "../create/CreateOrder.types";
import { AccountRole } from "utilities/AccountRole";
import PrintUtils from "components/PrintiIframe/PrintUtils";
import PrintiIframe from "components/PrintiIframe";
import Dialog from "components/Dialog";
import TextField from "components/TextField";
import { isNil, toNumber } from "lodash";
import { PaymentStatus } from "utilities/PaymentStatus";
import { color } from "highcharts";
import { colorBlue } from "theme/palette";
import RadioGroup from "components/RadioGroup";
import Radio from "components/RadioGroup/Radio";
import NumberInputTextField from "components/NumberInput/NumberInputTextField";


const OrderDetail = (props: OrderDetailProps) => {
    const history = useHistory();
    const { authState, classes, storeContext } = props;
    const [store, setStore] = useState<StoreResponse>();
    const [order, setOrder] = useState<OrdersResponse>();
    const [payment, setPayment] = useState<PaymentResponse>();
    const { id } = useParams<{ id: string }>();
    const { confirm } = useModal();
    const [isLoading, setIsLoading] = useState(true);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogCancel, setOpenDialogCancel] = useState<boolean>(false);
    const [openDialogAddPayment, setOpenDialogAddPayment] = useState<boolean>(false);
    const refPrint = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        document.title = "Chi tiết đơn hàng";
    }, []);
    useEffect(() => {
        fetchData();
    }, []);

    const onExitAccountDetailPage = () => {
        history.push("/admin/orders");
    };

    const fetchData = async () => {
        try {
            let res = await OrdersService.getById(id);
            if (res) {
                setOrder(res.data.OrderResponse)
            }
            OrdersService.getPayment(id).then((resPayment) => {
                if (resPayment) {
                    setPayment(resPayment.data.PaymentResponse)
                }
            })

            StoreService.getStoreById(String(res.data.OrderResponse?.storeId)).then((res) => {
                if (res) {
                    setStore(res.data.store)
                }
            })
        } catch (error) {
            SnackbarUtils.error(getMessageError(error))
        }
    }

    const getOrderStatus = (order: any) => {
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
    const handleReFindShipper = async () => {
        try {
            let res = await OrdersService.reFindShipper(id);
            if (res) {
                setOrder(res.data.OrderResponse)
            }
        } catch (Error) {
            SnackbarUtils.error(getMessageError(Error))
        }
    }
    useEffect(() => {
        setTimeout(() => {
            OrdersService.getById(id).then((res) => {
                if (res) {
                    setOrder(res.data.OrderResponse);
                }
            }).catch((error) => {
                SnackbarUtils.error(getMessageError(error));
            })
        }, 1500)
    }, [order?.shipStatus])
    const genStatusOrders = () => {
        const orderStatus = getOrderStatus(order);
        return orderStatus ? (
            orderStatus.color === 1 ? <Chip variant="outlined" size="small" label={orderStatus.name} className="info" />
                : orderStatus.color === 2 ? <Chip variant="outlined" size="small" label={orderStatus.name} className="success" />
                    : orderStatus.color === 3 ? <Chip variant="outlined" size="small" label={orderStatus.name} className="warning" />
                        : orderStatus.color === 4 ? <Chip variant="outlined" size="small" label={orderStatus.name} className="danger" />
                            : <Chip size="small" label={orderStatus.name} color="default" />
        ) : null;
    }

    const getOrderShipStatus = (order: any) => {
        if (!order) {
            return undefined;
        }
        let name = getOrderShipStatusName(order.shipStatus);
        let color = 0;
        switch (order.shipStatus) {
            case OrderShipStatus.READY_SHIPPER:
                color = 2;
                break;
            case OrderShipStatus.SEARCHING_SHIPPER:
                color = 1;
                break;
            case OrderShipStatus.NO_SHIPPER:
                color = 3;
                break;
        }
        return { name, color };
    };
    const getOrderPaymentStatus = (order: any) => {
        if (!order) {
            return undefined;
        }
        let name = PaymentStatus.getName(order.paymentStatus);
        let color = 0;
        switch (order.paymentStatus) {
            case PaymentStatus.PAID:
                color = 2;
                break;
            case PaymentStatus.UNPAID:
                color = 1;
                break;
            case PaymentStatus.SHOP_PAID:
                color = 3;
                break;
        }
        return { name, color };
    };
    const genShipStatusOrders = () => {
        const orderShipStatus = getOrderShipStatus(order);
        return orderShipStatus ? (
            orderShipStatus.color === 1 ? <Chip variant="outlined" size="small" label={orderShipStatus.name} className="info" />
                : orderShipStatus.color === 2 ? <Chip variant="outlined" size="small" label={orderShipStatus.name} className="success" />
                    : orderShipStatus.color === 3 ? <Chip variant="outlined" size="small" label={orderShipStatus.name} className="warning" />
                        : <Chip size="small" label={orderShipStatus.name} color="default" />
        ) : null;
    }
    const genPaymentStatusOrders = () => {
        const orderShipStatus = getOrderPaymentStatus(order);
        return orderShipStatus ? (
            orderShipStatus.color === 1 ? <Chip variant="outlined" size="small" label={orderShipStatus.name} className="info" />
                : orderShipStatus.color === 2 ? <Chip variant="outlined" size="small" label={orderShipStatus.name} className="success" />
                    : orderShipStatus.color === 3 ? <Chip variant="outlined" size="small" label={orderShipStatus.name} className="warning" />
                        : <Chip variant="outlined" size="small" label={"Chưa thanh toán"} className="info" />
        ) : null;
    }
    const caculatorTotal = useMemo(() => {
        let total = 0;
        if (order && order?.lineItem) {
            order?.lineItem.map((item) => {
                total += item.price * item.quantity;
            })
        }
        return total;
    }, [order?.lineItem])
    const initOrder = (order: OrdersResponse) => {
        setOrder(order);
    }
    const closeDialog = () => {
        setOpenDialogCancel(false);
    }
    const printOrder = () => {
        try {
            let htmlContent = "";
            if (order) {
                let printFormRequest: PrintFormRequest = {
                    orderId: order.id,
                }
                OrdersService.printOrder(printFormRequest).then((res) => {
                    if (res && res.data.order_print_form) {
                        if (res.data.order_print_form.htmlContent) {
                            htmlContent += res.data.order_print_form.htmlContent;
                        }
                    }
                    PrintUtils.print(htmlContent);
                })
            }
        } catch (error) {

        }
    }
    return <>
        <HeaderAction
            title={"Danh sách đơn hàng"}
            linkTo={"/admin/orders"}
            groupAction={
                <Fragment>
                    <Button
                        variant="outlined"
                        color="primary"
                        btnType="default"
                        style={{ marginLeft: 16 }}
                        onClick={onExitAccountDetailPage}
                        size="small"
                    >
                        Thoát
                    </Button>
                    {order && order.status === OrderStatus.DRAFT && order.status === OrderStatus.READY_TO_PICK && hasPermission([AccountRole.CUSTOMER], authState.user) &&
                        <Button
                            variant="outlined"
                            btnType="destruction"
                            color="primary"
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                confirm({
                                    cancelButtonText: "Thoát",
                                    confirmButtonText: "Hủy",
                                    isDelete: true,
                                    message: "Bạn có chắc chắn muốn hủy đơn hàng",
                                    title: "Bạn có chắc muốn hủy đơn",
                                    deleteButtonText: "Hủy đơn",
                                }).result.then(async () => {
                                    let orderUpdate: OrderUpdateStatusRequest = {
                                        orderId: Number(id),
                                        accountId: authState.user.id,
                                        status: OrderStatus.CANCEL,
                                        storeId: order?.storeId,
                                    }
                                    OrdersService.updateStatus(orderUpdate).then((res) => {
                                        if (res) {
                                            setOrder(res.data.OrderResponse)
                                            SnackbarUtils.success("Hủy đơn thành công");
                                        }
                                    }).catch((err) => {
                                        SnackbarUtils.error(getMessageError(err))
                                    });
                                })
                            }}
                            size="small"
                        >
                            Hủy đơn
                        </Button>
                    }
                    {order && (order.status === OrderStatus.DRAFT) && hasPermission([AccountRole.CUSTOMER], authState.user) &&
                        <Button
                            variant="contained"
                            color="primary"
                            btnType="default"
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                history.push(`/admin/orders/${id}/edit`);
                            }}
                            size="small"
                        >
                            Sửa
                        </Button>
                    }
                    {order && order.status === OrderStatus.DRAFT && order.shipStatus === OrderShipStatus.NO_SHIPPER && hasPermission([AccountRole.ADMIN, AccountRole.CUSTOMER], authState.user) &&
                        <Button
                            variant="outlined"
                            color="primary"
                            btnType="destruction"
                            style={{ marginLeft: 16 }}
                            onClick={() => { setOpenDialogDelete(true) }}
                            size="small"
                        >
                            Xóa đơn hàng
                        </Button>
                    }
                    {order && order.status === OrderStatus.DRAFT && order.shipStatus === OrderShipStatus.NO_SHIPPER && hasPermission([AccountRole.ADMIN, AccountRole.CUSTOMER], authState.user) &&
                        <Button
                            variant="contained"
                            color="primary"
                            btnType="default"
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                let orderUpdate: OrderUpdateStatusRequest = {
                                    orderId: Number(id),
                                    accountId: authState.user.id,
                                    status: OrderStatus.READY_TO_PICK,
                                }
                                OrdersService.updateStatus(orderUpdate).then((res) => {
                                    if (res) {
                                        setOrder(res.data.OrderResponse)
                                        SnackbarUtils.success("Đơn hàng đang tìm tài xế");
                                    }
                                }).catch((err) => {
                                    SnackbarUtils.error(getMessageError(err))
                                });
                            }}
                            size="small"
                        >
                            Tìm tài xế
                        </Button>
                    }
                    {order && order.status === OrderStatus.READY_TO_PICK && order.shipStatus === OrderShipStatus.READY_SHIPPER && hasPermission([AccountRole.SHIPPER], authState.user) &&
                        <Button
                            variant="contained"
                            color="primary"
                            btnType="default"
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                let orderUpdate: OrderUpdateStatusRequest = {
                                    orderId: Number(id),
                                    accountId: authState.user.id,
                                    status: OrderStatus.PICKING,
                                }
                                OrdersService.updateStatus(orderUpdate).then((res) => {
                                    if (res) {
                                        setOrder(res.data.OrderResponse)
                                        SnackbarUtils.success("Đã nhận đơn hàng");
                                    }
                                }).catch((err) => {
                                    SnackbarUtils.error(getMessageError(err))
                                });
                            }}
                            size="small"
                        >
                            Nhận đơn hàng
                        </Button>
                    }
                    {order && order.status === OrderStatus.READY_TO_PICK && order.shipStatus === OrderShipStatus.READY_SHIPPER && hasPermission([AccountRole.SHIPPER], authState.user) &&
                        <Button
                            variant="contained"
                            color="primary"
                            btnType="default"
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                let orderUpdate: OrderUpdateStatusRequest = {
                                    orderId: Number(id),
                                    accountId: authState.user.id,
                                    status: OrderStatus.READY_TO_PICK,
                                }
                                OrdersService.updateStatus(orderUpdate).then((res) => {
                                    if (res) {
                                        setOrder(res.data.OrderResponse)
                                        SnackbarUtils.success("Đã nhận đơn hàng");
                                    }
                                }).catch((err) => {
                                    SnackbarUtils.error(getMessageError(err))
                                });
                            }}
                            size="small"
                        >
                            Hủy nhận hàng
                        </Button>
                    }
                    {order && order.status === OrderStatus.PICKING && order.shipStatus === OrderShipStatus.READY_SHIPPER && hasPermission([AccountRole.SHIPPER], authState.user) &&
                        <Button
                            variant="contained"
                            color="primary"
                            btnType="default"
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                let orderUpdate: OrderUpdateStatusRequest = {
                                    orderId: Number(id),
                                    accountId: authState.user.id,
                                    status: OrderStatus.DELIVERING,
                                }
                                OrdersService.updateStatus(orderUpdate).then((res) => {
                                    if (res) {
                                        setOrder(res.data.OrderResponse)
                                        SnackbarUtils.success("Nhận hàng thành công!");
                                    }
                                }).catch((err) => {
                                    SnackbarUtils.error(getMessageError(err))
                                });
                            }}
                            size="small"
                        >
                            Đã Nhận hàng
                        </Button>
                    }
                    {order && order.status === OrderStatus.PICKING && order.shipStatus === OrderShipStatus.READY_SHIPPER && hasPermission([AccountRole.SHIPPER], authState.user) &&
                        <Button
                            variant="contained"
                            color="primary"
                            btnType="default"
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                let orderUpdate: OrderUpdateStatusRequest = {
                                    orderId: Number(id),
                                    accountId: authState.user.id,
                                    status: OrderStatus.PICKING_FAILED,
                                }
                                OrdersService.updateStatus(orderUpdate).then((res) => {
                                    if (res) {
                                        setOrder(res.data.OrderResponse)
                                        SnackbarUtils.success("Hủy nhận hàng thành công!");
                                    }
                                }).catch((err) => {
                                    SnackbarUtils.error(getMessageError(err))
                                });
                            }}
                            size="small"
                        >
                            Hủy nhận hàng
                        </Button>
                    }
                    {order && order.status === OrderStatus.DELIVERING && order.shipStatus === OrderShipStatus.READY_SHIPPER && hasPermission([AccountRole.SHIPPER], authState.user) &&
                        <Button
                            variant="contained"
                            color="primary"
                            btnType="default"
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                let orderUpdate: OrderUpdateStatusRequest = {
                                    orderId: Number(id),
                                    accountId: authState.user.id,
                                    status: OrderStatus.FINISH,
                                }
                                OrdersService.updateStatus(orderUpdate).then((res) => {
                                    if (res) {
                                        setOrder(res.data.OrderResponse)
                                        SnackbarUtils.success("Giao hàng thành công!");
                                    }
                                }).catch((err) => {
                                    SnackbarUtils.error(getMessageError(err))
                                });
                            }}
                            size="small"
                        >
                            Đơn hàng đã giao
                        </Button>
                    }
                    {order && order.status === OrderStatus.DELIVERING && order.shipStatus === OrderShipStatus.READY_SHIPPER && hasPermission([AccountRole.SHIPPER], authState.user) &&
                        <Button
                            variant="contained"
                            color="primary"
                            btnType="default"
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                setOpenDialogCancel(true)
                            }}
                            size="small"
                        >
                            Hủy giao
                        </Button>
                    }
                    {order && order.status === OrderStatus.DELIVERING_FAILED && order.shipStatus === OrderShipStatus.READY_SHIPPER && hasPermission([AccountRole.SHIPPER], authState.user) &&
                        <Button
                            variant="contained"
                            color="primary"
                            btnType="default"
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                let orderUpdate: OrderUpdateStatusRequest = {
                                    orderId: Number(id),
                                    accountId: authState.user.id,
                                    status: OrderStatus.RETURNING,
                                }
                                OrdersService.updateStatus(orderUpdate).then((res) => {
                                    if (res) {
                                        setOrder(res.data.OrderResponse)
                                        SnackbarUtils.success("Đơn hàng đang được trả!");
                                    }
                                }).catch((err) => {
                                    SnackbarUtils.error(getMessageError(err))
                                });
                            }}
                            size="small"
                        >
                            Trả hàng
                        </Button>
                    }
                    {order && order.status === OrderStatus.RETURNING && order.shipStatus === OrderShipStatus.READY_SHIPPER && hasPermission([AccountRole.SHIPPER, AccountRole.CUSTOMER], authState.user) &&
                        <Button
                            variant="contained"
                            color="primary"
                            btnType="default"
                            style={{ marginLeft: 16 }}
                            onClick={() => {
                                let orderUpdate: OrderUpdateStatusRequest = {
                                    orderId: Number(id),
                                    accountId: authState.user.id,
                                    status: OrderStatus.RETURNED,
                                }
                                OrdersService.updateStatus(orderUpdate).then((res) => {
                                    if (res) {
                                        setOrder(res.data.OrderResponse)
                                        SnackbarUtils.success("Đơn hàng đã được trả!");
                                    }
                                }).catch((err) => {
                                    SnackbarUtils.error(getMessageError(err))
                                });
                            }}
                            size="small"
                        >
                            Đã trả hàng
                        </Button>
                    }
                </Fragment>
            }
        />
        <Box className={classes.container}>
            <Grid xs={12} container>
                <Grid xs={6} item><Button onClick={() => { printOrder() }} variant="text" endIcon={<PrintIcon color="disabled" />}>In đơn</Button></Grid>
                <Grid xs={6} item><BoxStep order={order} /></Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Grid item xs={12}>
                        <Box className={classes.accountInformationBox}>
                            <Box className={classes.headerInformationBox}>
                                <Typography style={{ fontWeight: 500 }}>
                                    Thông tin người gửi
                                </Typography>
                            </Box>
                            {order ? (
                                <Box className={classes.detailInformationBox}>
                                    <table style={{ width: "70%" }}>
                                        <tr>
                                            <td>Tên: </td>
                                            <td>{order.sendPersonal?.name ? order.sendPersonal?.name : "---"}</td>
                                        </tr>
                                        <tr>
                                            <td>Số điện thoại: </td>
                                            <td>{order.sendPersonal?.phone ? order.sendPersonal.phone : "---"}</td>
                                        </tr>
                                        <tr>
                                            <td>Email: </td>
                                            <td>{order.sendPersonal?.email ? order.sendPersonal.email : "---"}</td>
                                        </tr>
                                        <tr>
                                            <td>Địa chỉ: </td>
                                            <td>{store?.address} - {store?.wardName} - {store?.districtName} - {store?.cityName}</td>
                                        </tr>
                                    </table>
                                </Box>
                            ) : (
                                <Box>
                                    <CircularProgress />
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: 20 }}>
                        <Box className={classes.accountInformationBox}>
                            <Box className={classes.headerInformationBox}>
                                <Typography style={{ fontWeight: 500 }}>
                                    Thông tin người nhận
                                </Typography>
                            </Box>
                            <Box className={classes.detailInformationBox}>
                                <Grid xs={12} style={{ marginTop: 10 }} container>
                                    <Grid xs={2} item>Số điện thọai</Grid>
                                    <Grid xs={1} item>:</Grid>
                                    <Grid xs={2} item>{order?.receiptPersonal?.phone}</Grid>
                                </Grid>
                                <Grid xs={12} style={{ marginTop: 10 }} container>
                                    <Grid xs={2} item>Họ tên</Grid>
                                    <Grid xs={1} item>:</Grid>
                                    <Grid xs={2} item>{order?.receiptPersonal?.name}</Grid>
                                </Grid>
                                <Grid xs={12} style={{ marginTop: 10 }} container>
                                    <Grid xs={2} item>Địa chỉ</Grid>
                                    <Grid xs={1} item>:</Grid>
                                    <Grid xs={9} item>{order?.receiptPersonal?.address} - {order?.receiptPersonal?.wardName} - {order?.receiptPersonal?.districtName} - {order?.receiptPersonal?.cityName}</Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Box className={classes.accountInformationBox}>
                        <Box className={classes.headerInformationBox}>
                            <Typography style={{ fontWeight: 500 }}>
                                Thông tin đơn hàng
                            </Typography>
                            <Box>
                                <Grid xs={12} container>
                                    <Grid xs={4} item>{genShipStatusOrders()}</Grid>
                                </Grid>
                            </Box>
                        </Box>
                        <Box className={classes.detailInformationBox}>
                            <Grid xs={12} container>
                                <Grid xs={6} item>
                                    <Grid xs={12} style={{ marginTop: 10 }} container>
                                        <Grid xs={4} item>Mã đơn hàng</Grid>
                                        <Grid xs={2} item>:</Grid>
                                        <Grid xs={4} item>{order?.code}</Grid>
                                    </Grid>
                                    <Grid xs={12} style={{ marginTop: 10 }} container>
                                        <Grid xs={4} item>Người tạo đơn</Grid>
                                        <Grid xs={2} item>:</Grid>
                                        <Grid xs={4} item>{authState.user.fullName}</Grid>
                                    </Grid>
                                </Grid>
                                <Grid xs={6} item>
                                    <Grid xs={12} style={{ marginTop: 10 }} container>
                                        <Grid xs={4} item>Ngày tạo</Grid>
                                        <Grid xs={2} item>:</Grid>
                                        <Grid xs={4} item>{order && formatDate(order.createdOn)}</Grid>
                                    </Grid>
                                    <Grid xs={12} style={{ marginTop: 10 }} container>
                                        <Grid xs={4} item>Ngày cập nhật</Grid>
                                        <Grid xs={2} item>:</Grid>
                                        <Grid xs={4} item>{order && formatDate(order.modifiledOn)}</Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Box style={{ marginTop: 10 }}>
                                <Grid container xs={12} style={{ marginTop: 10 }}>
                                    <Grid item xs={6}>
                                        <Grid xs={12} container>
                                            <Grid xs={4} item>Nv giao hàng:</Grid>
                                            <Grid xs={2} item>:</Grid>
                                            <Grid xs={4} item>{order?.shipper ? order?.shipper.name : "---"}</Grid>
                                        </Grid>
                                        <Grid xs={12} style={{ marginTop: 10 }} container>
                                            <Grid xs={4} item>Số điện thoại</Grid>
                                            <Grid xs={2} item>:</Grid>
                                            <Grid xs={4} item>{order?.shipper ? order?.shipper.phone : "---"}</Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Grid xs={12}>
                                            {(order?.status === OrderStatus.DRAFT || order?.status === OrderStatus.READY_TO_PICK)
                                                && !(order?.shipStatus === OrderShipStatus.READY_SHIPPER)
                                                && hasPermission([AccountRole.ADMIN, AccountRole.CUSTOMER], authState.user) &&
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    style={{ width: 120 }}
                                                    isLoading={order?.shipStatus === OrderShipStatus.SEARCHING_SHIPPER}
                                                    onClick={() => handleReFindShipper()}>
                                                    Tìm tài xế
                                                </Button>
                                            }
                                        </Grid>
                                        <Grid xs={12} style={{ marginTop: 10 }}></Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                    <Box className={classes.accountInformationBox} style={{ marginTop: 20 }}>
                        <Box className={classes.headerInformationBox}>
                            <Typography style={{ fontWeight: 500 }}>
                                Thông tin sản phẩm
                            </Typography>
                        </Box>
                        <Box className={classes.detailInformationBox}>
                            <Table>
                                <TableHead>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Tên sp</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Khối lượng</TableCell>
                                    <TableCell>Giá</TableCell>
                                    <TableCell>Thành tiền</TableCell>
                                </TableHead>
                                {order && order?.lineItem && order?.lineItem.map((item, index) => {
                                    return (
                                        <TableBody>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{formatNumber(item.weightValue)}</TableCell>
                                            <TableCell>{formatNumber(item.price)}</TableCell>
                                            <TableCell>{formatNumber(item.price * item.quantity)}</TableCell>
                                        </TableBody>
                                    )
                                })}
                            </Table>
                            <Grid xs={12} container style={{ marginTop: 20 }}>
                                <Grid xs={6} item>
                                    <Typography style={{ fontWeight: 500 }}>Ghi chú</Typography>
                                    <Typography>{order?.note ? order?.note : "Chưa có ghi chú"}</Typography>
                                </Grid>
                                <Grid xs={6} item>
                                    <Grid xs={12} container>
                                        <Grid xs={6} item><Typography style={{ float: "right", fontWeight: 500 }}>Tổng tiền sp:</Typography></Grid>
                                        <Grid xs={6} item><Typography style={{ float: "right" }}>{formatNumber(caculatorTotal)}</Typography></Grid>
                                    </Grid>
                                    <Grid xs={12} container>
                                        <Grid xs={6} item><Typography style={{ float: "right", fontWeight: 500 }}>Tiền COD:</Typography></Grid>
                                        <Grid xs={6} item><Typography style={{ float: "right" }}>{formatNumber(order?.cod || 0)}</Typography></Grid>
                                    </Grid>
                                    <Grid xs={12} container>
                                        <Grid xs={6} item><Typography style={{ float: "right", fontWeight: 500 }}>Phí giao hàng:</Typography></Grid>
                                        <Grid xs={6} item><Typography style={{ float: "right" }}>{formatNumber(order?.fee || 0)}</Typography></Grid>
                                    </Grid>
                                    <Grid xs={12} container>
                                        <Grid xs={6} item><Typography style={{ float: "right", fontWeight: 500 }}>Tổng tiền:</Typography></Grid>
                                        <Grid xs={6} item><Typography style={{ float: "right" }}>{formatNumber(order?.total || 0)}</Typography></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                    <Box className={classes.accountInformationBox}>
                        <Box className={classes.headerInformationBox}>
                            <Typography style={{ fontWeight: 500 }}>
                                Thông tin thanh toán đơn hàng
                            </Typography>
                            <Box>
                                <Grid xs={12} container>
                                    <Grid xs={4} item>{genPaymentStatusOrders()}</Grid>
                                </Grid>
                            </Box>
                        </Box>
                        <Box className={classes.detailInformationBox}>
                            <Grid xs={12} container>
                                <Grid xs={4}><Typography><span style={{ fontWeight: 500 }}>Cần thanh toán</span> : {formatMoney(order?.cod || 0)}</Typography></Grid>
                                <Grid xs={4}><Typography><span style={{ fontWeight: 500 }}>Đã thanh toán</span> : {formatMoney(order?.paymentResponse?.amount || 0)}</Typography></Grid>
                                <Grid xs={4}><Typography><span style={{ fontWeight: 500, color: "red" }}>Còn phải trả </span> : {formatMoney((order?.cod || 0) - (order?.paymentResponse?.amount || 0))}</Typography></Grid>
                            </Grid>
                            {(order?.paymentStatus === null || order?.paymentStatus === "unpaid") && (order.status !== OrderStatus.DRAFT && order.status !== OrderStatus.READY_TO_PICK && order.status !== OrderStatus.PICKING  && order.shipStatus === OrderShipStatus.READY_SHIPPER) &&
                                <Button
                                    style={{ marginTop: 10, marginLeft: 600 }}
                                    variant="contained"
                                    color="primary"
                                    btnType="default" onClick={() => { setOpenDialogAddPayment(true) }}>Thanh toán</Button>
                            }
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <PrintiIframe iframeId="printOrderDetailForm">
                <div ref={refPrint}></div>
            </PrintiIframe>
        </Box>
        <DialogCancelOrder
            authState={authState}
            id={id}
            initOrder={initOrder}
            onClose={closeDialog}
            open={openDialogCancel}
        />
        <DialogAddPaymentOrders
            authState={authState}
            id={id}
            initOrder={initOrder}
            onClose={() => { setOpenDialogAddPayment(false) }}
            open={openDialogAddPayment}
            order={order}
        />
        <DialogDeleteOrder
            id={id}
            onClose={() => { setOpenDialogDelete(false) }}
            open={openDialogDelete}
        />
    </>;
};

const mapStateToProps = (state: AppState) => ({
    menuState: state.menu,
    authState: state.auth,
    storeContext: state.storeContext,
});
export default connect(mapStateToProps, {})(withStyles(styles)(OrderDetail));

export const DialogCancelOrder = (props: DialogOrderCancel) => {
    const { open, onClose, authState, id, initOrder } = props;
    const [reason, setReason] = useState<string>();
    const handleCancelOrder = () => {
        if (isNil(reason)) {
            SnackbarUtils.error("Lý do hủy không được để trống!")
            return;
        }
        let orderUpdate: OrderUpdateStatusRequest = {
            orderId: Number(id),
            accountId: authState.user.id,
            status: OrderStatus.DELIVERING_FAILED,
            reason: reason,
        }
        OrdersService.updateStatus(orderUpdate).then((res) => {
            if (res) {
                initOrder(res.data.OrderResponse)
                SnackbarUtils.success("Hủy giao thành công!");
            }
        }).catch((err) => {
            SnackbarUtils.error(getMessageError(err))
        });
    }
    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                title={"Lý do hủy đơn hàng"}
                onOk={handleCancelOrder}
                textOk={"Hủy giao"}
                children={
                    <>
                        <Box width="500px">
                            <TextField fullWidth label={"Lý do hủy đơn hàng"} value={reason} onChange={(event: any) => setReason(event.target.value)} />
                        </Box>
                    </>
                } />
        </Fragment>
    );
}

export const DialogDeleteOrder = (props: DialogDeleteOrderProps) => {
    const { open, onClose, id } = props;
    const history = useHistory();
    const handleCancelOrder = () => {
        OrdersService.delete(id)
            .then(async (res) => {
                if (res) {
                    onClose();
                    SnackbarUtils.success("Xóa đơn hàng thành công!");
                    history.push(`/admin/accounts`);
                }
            })
            .catch((err) => {
                SnackbarUtils.error(getMessageError(err));
            });
    };
    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                title={"Xóa đơn hàng"}
                onDelete={handleCancelOrder}
                textDelete={"Xóa"}
                children={
                    <>
                        <Box width="500px">
                            <Typography>
                                Bạn có chắc muốn xóa đơn hàng này không?.
                            </Typography>
                        </Box>
                    </>
                }
            />
        </Fragment>
    );
};

export const DialogAddPaymentOrders = (props: DialogAddPaymentOrdersProps) => {
    const { open, onClose, authState, id, initOrder, order } = props;
    const [freightPayer, setFreightPayer] = useState<string>("shop");
    const [amount, setAmount] = useState<number>(order?.cod || 0);
    const isOwner = hasPermission([AccountRole.ADMIN], authState.user);
    const handleCancelOrder = () => {
        if (isNil(amount) || amount === 0) {
            SnackbarUtils.error("Giá trị được để trống hoặc bằng 0!")
            return;
        }
        let payment: PaymentRequest = {
            orderId: Number(id),
            amount: amount,
            freightPayer: freightPayer,
        }
        OrdersService.addPayment(payment).then(async (res) => {
            if (res) {
                onClose();
                SnackbarUtils.success("Thanh toán đơn hàng thành công!");
                let res = await OrdersService.getById(id);
                if (res) {
                    initOrder(res.data.OrderResponse)
                }
            }
        }).catch((err) => {
            SnackbarUtils.error(getMessageError(err))
        });
    }
    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                title={"Thanh toán đơn hàng"}
                onOk={handleCancelOrder}
                textOk={"Thanh toán"}
                children={
                    <>
                        <Box width="500px">
                            <RadioGroup label="Người thanh toán" onChange={(e: any) => { setFreightPayer(e.target.value) }} value={freightPayer} row>
                                <FormControlLabel value="customer" control={<Radio />} label="Khách hàng" />
                                <FormControlLabel value="shop" control={<Radio />} label="Cửa hàng" />
                            </RadioGroup>
                            <TextField fullWidth label={"Giá trị"} value={formatMoney(amount || 0)} onChange={(event: any) => {
                                let value = toNumber(event.target.value);
                                if (value < (order?.cod || 0)) {
                                    setAmount(value);
                                } else {
                                    setAmount(order?.cod || 0);
                                }
                            } } name={"amount"} />
                        </Box>
                    </>
                } />
        </Fragment>
    );
}