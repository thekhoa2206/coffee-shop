import {
    Box,
    ButtonGroup,
    Grid,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core";
import InputQuantity from "components/InputQuantity/InputQuantity";
import Link from "components/Link";
import Paper from "components/Paper/Paper";
import TextareaAutosize from "components/TextField/TextareaAutosize/TextareaAutosize";
import React, { useCallback, useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { CustomerResponse } from "services/CustomerService";
import { OrderItemRequest, OrderPrintFormFilter, OrderRequest } from "services/OrderService";
import OrderService from "services/OrderService/OrderService";
import { ProductIngredientResponse, ProductVariantResponse } from "services/ProductService";
import { VariantFilterRequest } from "services/VariantService";
import VariantService from "services/VariantService/VariantService";
import { AppState } from "store/store";
import { formatDateUTCToLocalDateString, formatNumberDecimal, getMessageError } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { TableLineItem } from "../create/components/TableLineItem";
import { LineItemStore } from "../list/Orders.types";
import { useOrderStore } from "../store/store";
import { OrderStatus, PaymentStatus } from "../utils/OrderContants";
import styles from "./OrderDetail.styles";
import Chip from "components/Chip/Chip.component";
import BoxStep from "./components/BoxStep";
import Button from "components/Button";
import { OrderCancelIcon, OrderIcon, PencilIcon, PrintIcon } from "components/SVG";
import { ArrowDropDownCircle, ArrowDropDownCircleOutlined, ArrowDropDownCircleRounded, ArrowDropDownCircleSharp, ArrowDropDownSharp, CloseOutlined, PaymentOutlined } from "@material-ui/icons";
import Dialog from "components/Dialog/Dialog";
import ConfirmDialog from "components/Dialog/ConfirmDialog/ConfirmDialog";
import useModal from "components/Modal/useModal";
import Select from "components/Select/Index";
import PrintiIframe from "components/PrintiIframe";
import PrintUtils from "components/PrintiIframe/PrintUtils";

export interface OrderDetailProps extends WithStyles<typeof styles> { }
const OrderDetail = (props: OrderDetailProps & PropsFromRedux) => {
    const { classes, authState } = props;
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
        order,
        table,
    } = useOrderStore();
    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const { closeModal, confirm, openModal } = useModal();
    const [openMenuCreateOrder, setOpenMenuCreateOrder] = useState(false);
    const refPrint = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        initData();
    }, [id])
    useEffect(() => {
        reset();
        set((prev) => ({ ...prev, context: "detail" }));
    }, [])

    const printOrder = () => {
        try {
            let htmlContent = "";
            if (order) {
                let printFormRequest: OrderPrintFormFilter = {
                    orderId: order.id,
                }
                OrderService.printForm(printFormRequest).then((res) => {
                    if (res && res.data) {
                        if (res.data.htmlContent) {
                            htmlContent += res.data.htmlContent;
                        }
                    }
                    PrintUtils.print(htmlContent);
                })
            }
        } catch (error) {

        }
    }

    const initData = async () => {
        let res = await OrderService.getById(id);
        if (res.data) {
            try {
                let order = res.data;

                order.orderItemResponses?.map(async (li) => {
                    let variantIds: number[] = [];
                    let filter: VariantFilterRequest = {};
                    let comboIds: number[] = [];
                    order.orderItemResponses?.map((item) => {
                        if (item.combo)
                            comboIds.push(item.productId);
                        else
                            variantIds.push(item.productId);
                    });
                    if (comboIds.length > 0) {
                        filter.comboIds = comboIds;
                    }
                    let variantRes = await VariantService.filter(filter);
                    let variants: ProductVariantResponse[] = [];
                    if (li.combo) {
                        if (variantRes.data.data) {
                            variantRes.data.data.map((v) => {
                                let combo = li.orderItemComboResponses?.find((co) => v.id === co.variantId && li.id === co.orderItemId);
                                let ingredients = v.ingredients.map((ig) => {
                                    let ingredientRq: ProductIngredientResponse = {
                                        id: ig.id || 0,
                                        amountConsume: ig.amountConsume,
                                        createdBy: ig.createdBy,
                                        createdOn: ig.createdOn,
                                        ingredientId: ig.ingredientId,
                                        modifiedBy: ig.modifiedBy,
                                        modifiedOn: ig.modifiedOn,
                                        name: ig.name,
                                        quantityInventory: 0,
                                    }
                                    return ingredientRq;
                                })
                                if (combo) {
                                    variants.push({
                                        id: v.id,
                                        available: v.available,
                                        createdBy: v.createdBy,
                                        createdOn: v.createdOn,
                                        ingredients: ingredients,
                                        modifiedBy: v.modifiedBy,
                                        modifiedOn: v.modifiedOn,
                                        name: combo?.name,
                                        price: combo?.price,
                                        productItemId: v.itemId,
                                        quantity: combo?.quantity,
                                    });
                                }
                            })
                        }
                    }
                    let lineItemStore: LineItemStore = {
                        available: 0,
                        combo: li.combo || false,
                        price: li.price,
                        productId: li.productId,
                        quantity: li.quantity,
                        lineAmount: li.quantity * li.price,
                        name: li.name,
                        variants: variants,
                        status: li.status
                    }
                    set((prev) => ({
                        ...prev,
                        lineItems: [...(prev.lineItems || []), lineItemStore]
                    }))
                    return lineItemStore;
                })
                set((prev) => ({
                    ...prev,
                    code: order.code,
                    note: note,
                    customer: order.customerResponse,
                    discountTotal: order.discountTotal,
                    total: order.total,
                    order: order,
                    table: order.tableResponses,

                }))
            } catch (error) {

            }
        }
    }
    const totalLineAmount = () => {
        let total = 0;
        if (lineItems && lineItems.length > 0) {
            lineItems.map((item) => {
                total += item.lineAmount || 0;
            });
        }
        return total;
    };
    useEffect(() => {
        set((prev) => ({
            ...prev,
            total: totalLineAmount() - (discountTotal || 0),
        }));
    }, [totalLineAmount, discountTotal]);


    const renderOrderStatus = (status?: number) => {
        switch (status) {
            case OrderStatus.DRAFT:
                return <Chip className="default" variant="outlined" size="medium" label={OrderStatus.getName(status)} />;
            case OrderStatus.WAITING_DELIVERY:
                return <Chip className="warning" variant="outlined" size="medium" label={OrderStatus.getName(status)} />;
            case OrderStatus.IN_PROGRESS:
                return <Chip className="info" variant="outlined" size="medium" label={OrderStatus.getName(status)} />;
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
            case OrderStatus.DRAFT:
                return <Chip className="warning" variant="outlined" size="medium" label={PaymentStatus.getName(status)} />;
            case OrderStatus.WAITING_DELIVERY:
                return <Chip className="success" variant="outlined" size="medium" label={PaymentStatus.getName(status)} />;
            default:
                return <Chip className="warning" variant="outlined" size="medium" label={PaymentStatus.getName(status)} />;
        }
    };

    const addPayment = async () => {
        try {
            let res = await OrderService.addPayment(id);
            if (res) {
                SnackbarUtils.success("Thanh toán đơn hàng thành công")
                set((prev) => ({
                    ...prev,
                    order: order,
                }))
            }
        } catch (error) {
            SnackbarUtils.error(getMessageError(error));
        }
    }
    return (
        <>
            <Box className={classes.container}>
                <Grid container>
                    <Grid item style={{ flexDirection: "column" }} xs={6}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h4" style={{ lineHeight: "28px", marginRight: 20 }}>
                                {code}
                            </Typography>
                            {order?.status && renderOrderStatus(order.status)}
                        </Box>
                        <Box display="flex" alignItems="center" style={{ marginTop: 10 }}>
                            <Button startIcon={<PrintIcon />} color="inherit" variant="text" onClick={() => { printOrder() }}>In</Button>
                            {!order?.paymentStatus || order?.paymentStatus !== PaymentStatus.PAID &&
                                <Button startIcon={<PaymentOutlined />} color="inherit" variant="text" onClick={() => {
                                    openModal(ConfirmDialog, {
                                        confirmButtonText: "Xác nhận",
                                        message: "Bạn có muốn thanh toán đơn hàng này không?",
                                        title: "Thanh toán đơn hàng",
                                        cancelButtonText: "Thoát",
                                    }).result.then((res) => {
                                        if (res) {
                                            addPayment();
                                        }
                                    })
                                }}>Thanh toán</Button>
                            }
                            <ButtonGroup style={{ background: "#eff3f3" }} variant="text">
                                <Button
                                    variant="text"
                                    id={`btn-create-order`}
                                    onClick={() => {
                                        setOpenMenuCreateOrder(true);
                                    }}
                                >
                                    Khác <ArrowDropDownSharp style={{ color: openMenuCreateOrder ? "#0088FF" : "", marginLeft: 10 }} />
                                </Button>
                            </ButtonGroup>
                            <Menu
                                anchorEl={document.getElementById(`btn-create-order`)}
                                getContentAnchorEl={null}
                                open={openMenuCreateOrder}
                                onClose={() => {
                                    setOpenMenuCreateOrder(false);
                                }}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                disableRestoreFocus
                            >
                                <MenuItem
                                    onClick={() => { history.push(`/admin/orders/${id}/edit`) }}
                                >
                                    <PencilIcon style={{ color: "#adadad", marginRight: 10 }} /> Sửa
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        setOpenMenuCreateOrder(false);
                                        if (order?.status !== OrderStatus.DRAFT) {
                                            SnackbarUtils.error("Đơn hàng không thể hủy");
                                            return;
                                        }
                                        openModal(ConfirmDialog, {
                                            title: "Hủy đơn hàng",
                                            message: "Bạn có chắc chắn muốn hủy đơn hàng này không? Thao tác không thể khôi phục.",
                                            isDelete: true,
                                            deleteButtonText: "Hủy đơn",
                                            cancelButtonText: "Thoát"
                                        }).result.then(async (res) => {
                                            if (res) {
                                                try {
                                                    let res = await OrderService.updateStatus(id, OrderStatus.DELETED);
                                                    if (res.data) {
                                                        SnackbarUtils.success("Đơn hàng đã hủy thành công");
                                                        set((prev) => ({
                                                            ...prev,
                                                            order: res.data,
                                                        }))
                                                    }
                                                } catch (error) {
                                                    SnackbarUtils.error(getMessageError(error));
                                                }
                                            }
                                        })
                                    }}
                                >
                                    <OrderCancelIcon style={{ color: "#adadad", marginRight: 10 }} /> Hủy
                                </MenuItem>

                                {/* <MenuItem
                                    onClick={async () => {
                                        setOpenMenuCreateOrder(false);
                                        try {
                                            let res = await OrderService.updateStatus(id, OrderStatus.IN_PROGRESS);
                                            if (res.data) {
                                                SnackbarUtils.success("Đơn hàng đang được thực hiện");
                                                set((prev) => ({
                                                    ...prev,
                                                    order: res.data,
                                                }))
                                            }
                                        } catch (error) {
                                            SnackbarUtils.error(getMessageError(error));
                                        }
                                    }}
                                >
                                    <OrderIcon style={{ color: "#adadad", marginRight: 10 }} /> Đang thực hiện
                                </MenuItem> */}


                                {/* <MenuItem
                                    onClick={async () => {
                                        setOpenMenuCreateOrder(false);
                                        try {
                                            let res = await OrderService.updateStatus(id, OrderStatus.WAITING_DELIVERY);
                                            if (res.data) {
                                                SnackbarUtils.success("Đơn hàng đã chuyển sang trạng thái chờ lấy đồ");
                                                set((prev) => ({
                                                    ...prev,
                                                    order: res.data,
                                                }))
                                            }
                                        } catch (error) {
                                            SnackbarUtils.error(getMessageError(error));
                                        }
                                    }}
                                >
                                    <OrderIcon style={{ color: "#adadad", marginRight: 10 }} /> Chờ lấy đồ
                                </MenuItem> */}

                                <MenuItem
                                    onClick={async () => {
                                        setOpenMenuCreateOrder(false);
                                        try {
                                            let res = await OrderService.updateStatus(id, OrderStatus.COMPLETED);
                                            if (res.data) {
                                                SnackbarUtils.success("Đơn hàng đã giao cho khách");
                                                set((prev) => ({
                                                    ...prev,
                                                    order: res.data,
                                                }))
                                            }
                                        } catch (error) {
                                            SnackbarUtils.error(getMessageError(error));
                                        }
                                    }}
                                >
                                    <OrderIcon style={{ color: "#adadad", marginRight: 10 }} /> Hoàn thành
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Grid>
                    <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <BoxStep order={order} />
                    </Grid>
                </Grid>
                <Grid container xs={12} spacing={2}>
                    <Grid item xs={8}>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin sản phẩm
                            </Typography>
                            <Box className={classes.boxContentPaper} style={{ padding: 5 }}>

                            </Box>
                            <TableLineItem />
                        </Paper>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Box display="flex">
                                <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                    Thông tin thanh toán
                                </Typography>
                                <Box style={{ marginLeft: 300, marginTop: 6 }}>
                                    {renderPaymentStatus(order?.paymentStatus)}
                                </Box>
                            </Box>
                            <Box className={classes.boxContentPaper}>
                                <Grid container xs={12}>
                                    <Grid item xs={6}>
                                        <Typography>Ghi chú: {note}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ListItem className={classes.listItemRoot}>
                                            <ListItemText
                                                primary={
                                                    "Tổng tiền (" +
                                                    (lineItems?.length || 0) +
                                                    " sản phẩm)"
                                                }
                                            />
                                            <ListItemText
                                                primary={formatNumberDecimal(totalLineAmount())}
                                                primaryTypographyProps={{ align: "right" }}
                                            />
                                        </ListItem>
                                        <ListItem className={classes.listItemRoot}>
                                            <ListItemText primary={"Chiết khấu"} />
                                            <ListItemText
                                                primary={formatNumberDecimal(discountTotal || 0)}
                                                style={{ marginLeft: "180px" }}
                                                primaryTypographyProps={{ align: "right" }}
                                            />
                                        </ListItem>
                                        <ListItem className={classes.listItemRoot}>
                                            <ListItemText primary={"Tiền khách phải trả"} />
                                            <ListItemText
                                                primary={formatNumberDecimal(total)}
                                                primaryTypographyProps={{ align: "right" }}
                                            />
                                        </ListItem>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Box>
                                <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                    Thông tin bàn
                                </Typography>
                                <Box
                                    className={classes.boxContentPaper}
                                    style={{ padding: "8px 16px", height: 70 }}
                                >
                                    <Grid xs={12} style={{ padding: 0 }}>
                                        {table && (table.length > 0) ? (
                                            table.map((x) =>
                                                <Box style={{ width: 330 }}>
                                                    <Grid xs={12} container>
                                                        <Grid xs={5} item>
                                                            Tên bàn
                                                        </Grid>
                                                        <Grid xs={1} item>
                                                            :
                                                        </Grid>
                                                        <Grid xs={6} item>
                                                            {x.name}

                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            )

                                        ) : null}
                                    </Grid>
                                </Box>
                            </Box>
                        </Paper>
                        {/* <Paper className={classes.wrapperBoxInfo}>
                            <Box>
                                <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                    Thông tin khách hàng
                                </Typography>
                                <Box
                                    className={classes.boxContentPaper}
                                    style={{ padding: "8px 16px", height: 70 }}
                                >
                                    <Grid xs={12} style={{ padding: 0 }}>
                                        {customer && (
                                            <Box style={{ width: 330 }}>
                                                <Grid xs={12} container>
                                                    <Grid xs={5} item>
                                                        Tên khách hàng
                                                    </Grid>
                                                    <Grid xs={1} item>
                                                        :
                                                    </Grid>
                                                    <Grid xs={6} item>
                                                        <Link
                                                            to={`/admin/customers`}
                                                            target="_blank"
                                                            style={{ fontWeight: 500 }}
                                                        >
                                                            {customer.name}
                                                        </Link>
                                                    </Grid>
                                                </Grid>
                                                <Grid xs={12} container>
                                                    <Grid xs={5} item>
                                                        Sđt khách hàng
                                                    </Grid>
                                                    <Grid xs={1} item>
                                                        :
                                                    </Grid>
                                                    <Grid xs={6} item>
                                                        {customer.phoneNumber}
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        )}
                                    </Grid>
                                </Box>
                            </Box>
                        </Paper> */}
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin bổ sung
                            </Typography>
                            <Box
                                className={classes.boxContentPaper}
                                style={{ padding: "16px 16px" }}
                            >
                                <Grid container xs={12} style={{ padding: 0 }}>
                                    <Grid item xs={5}>Ngày tạo</Grid>
                                    <Grid item xs={1}>:</Grid>
                                    <Grid item xs={5}>{order?.createdOn ? formatDateUTCToLocalDateString(order?.createdOn) : "---"}</Grid>
                                </Grid>
                                <Grid container xs={12} style={{ padding: 0 }}>
                                    <Grid item xs={5}>Ngày cập nhật</Grid>
                                    <Grid item xs={1}>:</Grid>
                                    <Grid item xs={5}>{order?.modifiedOn ? formatDateUTCToLocalDateString(order?.modifiedOn) : "---"}</Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <PrintiIframe iframeId="printOrderDetailForm">
                <div ref={refPrint}></div>
            </PrintiIframe>

        </>
    );
};

const mapStateToProps = (state: AppState) => ({
    menuState: state.menu,
    authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(OrderDetail));
