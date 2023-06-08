import {
    Box,
    Grid,
    ListItem,
    ListItemText,
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
import { OrderItemRequest, OrderRequest } from "services/OrderService";
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
    } = useOrderStore();
    const [querySearchCustomer, setQuerySearchCustomer] = useState("");
    const [openDialogAddCustomer, setOpenDialogAddCustomer] = useState(false);
    const history = useHistory();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        initData();
    }, [id])
    useEffect(() => {
        reset();
        set((prev) => ({ ...prev, context: "detail" }));
    }, [])
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
                                variants.push({
                                    id: v.id,
                                    available: v.available,
                                    createdBy: v.createdBy,
                                    createdOn: v.createdOn,
                                    ingredients: ingredients,
                                    modifiedBy: v.modifiedBy,
                                    modifiedOn: v.modifiedOn,
                                    name: v.name,
                                    price: v.price,
                                    productItemId: v.itemId,
                                });
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
                }))
            } catch (error) {

            }
        }
    }
    const handleChangeCustomer = useCallback(
        (customer: CustomerResponse | null) => {
            set((prev) => ({ ...prev, customer: customer }));
        },
        []
    );

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

    const createOrder = async () => {
        if (!lineItems || lineItems.length === 0) {
            SnackbarUtils.error("Sản phẩm không được để trống");
            return;
        }
        if (!customer) {
            SnackbarUtils.error("Thông tin khách hàng không được để trống");
            return;
        }
        let orderLineItems: OrderItemRequest[] = [];
        let error = null;
        lineItems.forEach((i) => {
            if (i.quantity > (i.available)) {
                error = "Số lượng có thể bán nhỏ hơn số lượng bán!";
            }
        });
        if (error) {
            SnackbarUtils.error(error);
            return;
        }
        lineItems.map((item) => {
            let lineItemRequest: OrderItemRequest = {
                productId: item.productId,
                combo: item.combo,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            };
            orderLineItems.push(lineItemRequest);
        });
        let requestOrder: OrderRequest = {
            customerId: customer.id || 0,
            note: note,
            discountTotal: discountTotal || 0,
            orderItemRequest: orderLineItems,
            code: code,
            total: total || 0,
        };
        try {
            let res = await OrderService.create(requestOrder);
            if (res.data) {
                SnackbarUtils.success("Tạo đơn hàng thành công!");
                history.push(`/admin/orders/${res.data.id}`);
            }
        } catch (error) {
            SnackbarUtils.error(getMessageError(error));
        }
    };

    const renderOrderStatus = (status?: number) => {
        switch (status) {
            case OrderStatus.DRAFT:
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
            case OrderStatus.DRAFT:
                return <Chip className="warning" variant="outlined" size="medium" label={PaymentStatus.getName(status)} />;
            case OrderStatus.WAITING_DELIVERY:
                return <Chip className="success" variant="outlined" size="medium" label={PaymentStatus.getName(status)} />;
            default:
                return <Chip className="warning" variant="outlined" size="medium" label={PaymentStatus.getName(status)} />;
        }
    };
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
                                <Box style={{marginLeft: 300, marginTop: 6}}>
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
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin khách hàng
                            </Typography>
                            <Box
                                className={classes.boxContentPaper}
                                style={{ padding: "8px 16px", height: 170 }}
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
                        </Paper>
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
