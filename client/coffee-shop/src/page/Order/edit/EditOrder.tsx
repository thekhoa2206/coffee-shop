import { Box, FormControlLabel, Grid, IconButton, InputAdornment, Link, Typography, withStyles } from "@material-ui/core";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "store/store";
import { EditOrderProps} from "./EditOrder.types";
import styles from "./EditOrder.styles";
import HeaderAction from "components/HeaderAction";
import Button from "components/Button";
import { useHistory, useParams } from "react-router-dom";
import Checkbox from "components/Checkbox";
import StoreService, { CityResponse, DistrictRequestFilter, DistrictResponse, StoreResponse, WardResponse } from "services/StoreService";
import TextField from "components/TextField";
import InputChoiceCityDistrict from "components/InputChoiceCityDistrict";
import InputChoiceWard from "components/InputChoiceWard";
import InputChoiceDistrict from "components/InputChoiceDistrict";
import { CloseIcon, PlusIcon } from "components/SVG";
import NumberInputTextField from "components/NumberInput/NumberInputTextField";
import TextareaAutosize from "components/TextField/TextareaAutosize";
import { useOrderStore } from "./store";
import OrdersService, { FeeRequest } from "services/OrdersService";
import { formatMoney, getMessageError } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { REGEX_EMAIL, REGEX_PHONE_NUMBER_VN } from "utilities/Regex";
import { CustomerRequest, OrderRequest } from "../create/CreateOrder.types";

const EditOrder = (props: EditOrderProps) => {
    const history = useHistory();
    const { authState, classes, storeContext } = props;
    const [store, setStore] = useState<StoreResponse>();
    const [city, setCity] = useState<CityResponse | null | undefined>();
    const [district, setDistrict] = useState<DistrictResponse | null | undefined>();
    const [ward, setWard] = useState<WardResponse | null | undefined>();
    const { id } = useParams<{ id: string }>();
    const { orderRequest, customer, errors, lineItems, addProductLineItem, deleteProductLineItem, set, updateProductLineItem } = useOrderStore();
    const totalWeightValue = useMemo(() => {
        let total: number = 0;
        if (lineItems) {
            lineItems.map((item) => {
                total += (item?.weightValue || 0) * (item?.quantity || 0);
            })
        }
        return total;
    }, [lineItems])
    useEffect(() => {
        document.title = "Tạo đơn hàng";
    }, []);
    useEffect(() => {
        StoreService.getStore().then((res) => {
            if (res) {
                setStore(res.data.store)
            }
        })
    }, []);

    const onExitAccountDetailPage = () => {
        history.push("/admin/settings/accounts/");
    };
    useEffect(() => {
        handleUpdateFee();
    }, [totalWeightValue, district?.id, store?.id])
    const handleUpdateFee = useCallback(async () => {
        let filter: FeeRequest = {
            totalWeightValue: totalWeightValue || 0,
            districtShipId: district?.id,
            districtReceiptId: store?.id
        }
        if (totalWeightValue && district && store) {
            let res = await OrdersService.getFee(filter);
            if (res) {
                set((prev) => ({
                    ...prev,
                    orderRequest: {
                        ...prev.orderRequest,
                        fee: res.data.fee_response.fee
                    }
                }))
            }
        }
    }, [totalWeightValue, district?.id, store?.id])


    useEffect(() => {
        let total: number = 0;
        if (lineItems) {
            lineItems.filter((item) => {
                total += (item?.price || 0) * (item?.quantity || 0)
            })
            total += (orderRequest?.fee || 0);
        }
        set((prev) => ({
            ...prev,
            orderRequest: {
                ...prev.orderRequest,
                total: total,
            }
        }))
    }, [orderRequest, lineItems])

    useEffect(() => {
        fetchData();
    }, [id])
    const fetchData = async () => {
        try {
            let res = await OrdersService.getById(id);
            if (res.data.OrderResponse) {
                let order = res.data.OrderResponse;
                if (order.lineItem) {
                    order.lineItem.map((item) => {
                        set((prev) => ({
                            ...prev,
                            lineItems: [
                                {
                                    id: item.id,
                                    code: item.code,
                                    name: item.name,
                                    price: item.price,
                                    quantity: item.quantity,
                                    storeId: item.storeId,
                                    weightValue: item.weightValue,
                                }, ...(prev.lineItems || [])],
                        }))
                    })
                }
                let customer: CustomerRequest = {
                    id: order.receiptPersonal.id,
                    cityId: order.receiptPersonal.cityId,
                    address: order.receiptPersonal.address,
                    code: order.receiptPersonal.code,
                    districtId: order.receiptPersonal.districtId,
                    name: order.receiptPersonal.name,
                    phone: order.receiptPersonal.phone,
                    storeId: order.receiptPersonal.storeId,
                    wardId: order.receiptPersonal.wardId,
                    cityName: order.receiptPersonal.cityName,
                    districtName: order.receiptPersonal.districtName,
                    wardName: order.receiptPersonal.wardName,
                }
                let orderRequest: OrderRequest = {
                    id: order.id,
                    cod: order.cod,
                    code: order.code,
                    fee: order.fee,
                    note: order.note,
                    total: order.total,
                    partnerDesId: order.receiptPersonal.id,
                    customer: customer,
                    storeId: order.storeId,
                    packsizeWeightValue: order.packsizeWeightValue,
                    height: order.height,
                    high: order.high,
                    width: order.width,
                }
                set((prev) => ({
                    ...prev,
                    customer: customer,
                    orderRequest: {
                        ...orderRequest
                    }
                }))

                let cityRes = await StoreService.getCites();
                let city = cityRes.data.list_city.city.find((ci) => ci.id === order.receiptPersonal.cityId);
                if (city) {
                    setCity(city);
                    let fil: DistrictRequestFilter = {
                        city_id: city?.id,
                    }
                    let districtRes = await StoreService.getDistricts(fil);
                    let district = districtRes.data.list_district.district.find((ci) => ci.id === order.receiptPersonal.cityId);
                    setDistrict(district);
                    if (district) {
                        const wardsRes = await StoreService.getWards(district.id);
                        let ward = wardsRes.data.list_ward.ward.find((wr) => wr.id === order.receiptPersonal.wardId);
                        if (ward)
                            setWard(ward);
                    }
                }
            }
        } catch (error) {
            SnackbarUtils.error(getMessageError(error))
        }
    }
    const EditOrder = async () => {
        if(orderRequest){
            let order: OrderRequest = {
                ...orderRequest,
                storeId: storeContext.store?.id,
                packsizeWeightValue: totalWeightValue,
                lineItem: lineItems,
                customer: {
                    ...orderRequest.customer,
                    storeId: storeContext.store?.id
                },
            }
            try {
                let res = await OrdersService.update(order);
                if (res) {
                    SnackbarUtils.success("Cập nhật đơn thành công!");
                    history.push(`/admin/orders/${res.data.OrderResponse.id}`);
                }
            } catch (e) {
                SnackbarUtils.error(getMessageError(e));
            }
        }else{
            SnackbarUtils.error("Không có thông tin vui lòng nhập thông tin!");
        }
    }
    console.log(orderRequest)
    return <>
        <HeaderAction
            title={"Thêm mới đơn hàng"}
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
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        btnType="default"
                        style={{ marginLeft: 16 }}
                        onClick={() => { EditOrder() }}
                        size="small"
                    >
                        Lưu
                    </Button>
                </Fragment>
            }
        />
        <Box className={classes.container}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Grid item xs={12}>
                        <Box className={classes.accountInformationBox}>
                            <Box className={classes.headerInformationBox}>
                                <Typography style={{ fontWeight: 500 }}>
                                    Thông tin người gửi
                                </Typography>
                            </Box>
                            <Box className={classes.detailInformationBox}>
                                <table style={{ width: "70%" }}>
                                    <tr>
                                        <td>Tên: </td>
                                        <td>{authState.user.fullName}</td>
                                    </tr>
                                    <tr>
                                        <td>Số điện thoại: </td>
                                        <td>{authState.user.phoneNo}</td>
                                    </tr>
                                    <tr>
                                        <td>Email: </td>
                                        <td>{authState.user.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Địa chỉ: </td>
                                        <td>{store?.address} - {store?.wardName} - {store?.districtName} - {store?.cityName}</td>
                                    </tr>
                                </table>
                            </Box>
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
                            <>
                                    <Grid xs={12} style={{ marginTop: 30 }} container>
                                        <Grid xs={2}>
                                            <Typography>Mã khách</Typography>
                                        </Grid>
                                        <Grid xs={1}>
                                            <Typography>:</Typography>
                                        </Grid>
                                        <Grid xs={4}>
                                            <Typography component={Link} href={`/admin/partners`}
                                                target="_blank">{orderRequest?.customer?.code ? orderRequest?.customer?.code : "---"}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={12} style={{ marginTop: 10 }} container>
                                        <Grid xs={2}>
                                            <Typography>Tên</Typography>
                                        </Grid>
                                        <Grid xs={1}>
                                            <Typography>:</Typography>
                                        </Grid>
                                        <Grid xs={4}>
                                            <Typography>{orderRequest?.customer?.name ? orderRequest?.customer?.name : "---"}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={12} style={{ marginTop: 10 }} container>
                                        <Grid xs={2}>
                                            <Typography>Số điện thoại</Typography>
                                        </Grid>
                                        <Grid xs={1}>
                                            <Typography>:</Typography>
                                        </Grid>
                                        <Grid xs={4}>
                                            <Typography>{orderRequest?.customer?.phone ? orderRequest?.customer?.phone : "---"}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid xs={12} style={{ marginTop: 10 }} container>
                                        <Grid xs={2}>
                                            <Typography>Địa chỉ</Typography>
                                        </Grid>
                                        <Grid xs={1}>
                                            <Typography>:</Typography>
                                        </Grid>
                                        <Grid xs={9}>
                                            <Typography>{(orderRequest?.customer?.address || "") + " - " + orderRequest?.customer?.wardName  + " - " 
                                             + orderRequest?.customer?.districtName + " - "  + orderRequest?.customer?.cityName || "---"}</Typography>
                                        </Grid>
                                    </Grid>
                                </>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Box className={classes.accountInformationBox}>
                        <Box className={classes.headerInformationBox}>
                            <Typography style={{ fontWeight: 500 }}>
                                Thông tin hàng hóa
                            </Typography>
                        </Box>
                        <Box className={classes.detailInformationBox}>
                            <Grid xs={12} style={{ marginTop: 10 }}>
                                <TextField
                                    label="Mã đơn hàng"
                                    style={{ width: "98%" }}
                                    placeholder="Nhập mã đơn hàng"
                                    value={orderRequest?.code}
                                    onChange={(e: any) => {
                                        set((prev) => ({
                                            ...prev,
                                            orderRequest: {
                                                ...prev.orderRequest,
                                                code: e.target.value,
                                            }
                                        }))
                                    }}
                                />
                            </Grid>
                            {lineItems.map((product, index) => {
                                return (
                                    <Fragment key={"productItem" + index}>
                                        <Box style={{ borderBottom: '1px solid #E8EAEB', paddingBottom: 20 }}>
                                            <Grid xs={12} style={{ marginTop: 10 }} >
                                                {index > 0 &&
                                                    <IconButton style={{ width: 20, height: 20, float: "right" }} onClick={() => deleteProductLineItem(product.id)}>
                                                        <CloseIcon style={{ width: 15, height: 15, color: "red" }} />
                                                    </IconButton>
                                                }
                                                <TextField
                                                    label={"Tên hàng " + (index + 1)}
                                                    style={{ width: "98%" }}
                                                    required
                                                    value={product?.name}
                                                    placeholder={"Nhập tên hàng" + (index + 1)}
                                                    onChange={(e: any) => {
                                                        updateProductLineItem({ ...product, name: e.target.value })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid container xs={12}>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        placeholder="Số lượng"
                                                        style={{ width: "95%" }}
                                                        required
                                                        value={product?.quantity}
                                                        onChange={(e: any) => {
                                                            updateProductLineItem({ ...product, quantity: e.target.value })

                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        placeholder="Trọng lượng"
                                                        style={{ width: "95%" }}
                                                        required
                                                        value={product?.weightValue}
                                                        onChange={(e: any) => {
                                                            updateProductLineItem({ ...product, weightValue: e.target.value })

                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        placeholder="Giá trị hàng"
                                                        style={{ width: "95%" }}
                                                        required
                                                        value={product?.price}
                                                        onChange={(e: any) => {
                                                            updateProductLineItem({ ...product, price: e.target.value })
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Fragment>
                                )
                            })}
                            <Box >
                                <Button
                                    startIcon={<PlusIcon />}
                                    variant="outlined"
                                    color="primary"
                                    style={{ margin: 'auto', marginTop: 20 }}
                                    size="small"
                                    onClick={() => addProductLineItem()}
                                >
                                    <Typography>Thêm hàng hóa</Typography>
                                </Button>
                            </Box>
                            <Box>
                                <Typography>Kích thước</Typography>
                                <Grid container xs={12}>
                                    <Grid item xs={4}>
                                        <TextField
                                            placeholder="Dài(cm)"
                                            style={{ width: "95%" }}
                                            required
                                            value={orderRequest?.width}
                                            onChange={(e: any) => {
                                                set((prev) => ({
                                                    ...prev,
                                                    orderRequest: {
                                                        ...prev.orderRequest,
                                                        width: e.target.value,
                                                    }
                                                }))
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            placeholder="Rộng(cm)"
                                            style={{ width: "95%" }}
                                            required
                                            value={orderRequest?.height}
                                            onChange={(e: any) => {
                                                set((prev) => ({
                                                    ...prev,
                                                    orderRequest: {
                                                        ...prev.orderRequest,
                                                        height: e.target.value,
                                                    }
                                                }))
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            placeholder="Cao(cm)"
                                            style={{ width: "95%" }}
                                            required
                                            value={orderRequest?.high}
                                            onChange={(e: any) => {
                                                set((prev) => ({
                                                    ...prev,
                                                    orderRequest: {
                                                        ...prev.orderRequest,
                                                        high: e.target.value,
                                                    }
                                                }))
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Grid xs={12} style={{ marginTop: 20, marginBottom: 20 }}>
                                <TextField
                                    disabled
                                    label="Quy đổi"
                                    style={{ width: "98%" }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">Gram</InputAdornment>,
                                    }}
                                    type="number"
                                    value={totalWeightValue}
                                />
                            </Grid>
                        </Box>
                    </Box>
                    <Box className={classes.accountInformationBox} style={{ marginTop: "20px" }}>
                        <Box className={classes.headerInformationBox}>
                            <Typography style={{ fontWeight: 500 }}>
                                Thông tin tiền thu hộ
                            </Typography>
                        </Box>
                        <Box className={classes.detailInformationBox}>
                            <Grid container xs={12}>
                                <Grid item xs={6}>
                                    <Box style={{ width: "100%" }}>
                                        <NumberInputTextField
                                            label="Tiền thu hộ"
                                            value={orderRequest?.cod}
                                            onChange={(e: any) => {
                                                set((prev) => ({
                                                    ...prev,
                                                    orderRequest: {
                                                        ...prev.orderRequest,
                                                        cod: Number(e.target.value),
                                                    }
                                                }))
                                            }}
                                            placeholder="Nhập số tiền thu hộ"
                                            name="cod"
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box>
                                        <table style={{ width: "300px", float: "right", marginTop: 20 }}>
                                            <tr>
                                                <td>Tiền hàng</td>
                                                <td>:</td>
                                                <td style={{ float: "right" }}>{formatMoney((orderRequest?.total || 0) - (orderRequest?.fee || 0))}</td>
                                            </tr>
                                            <tr>
                                                <td>Phí giao hàng</td>
                                                <td>:</td>
                                                <td style={{ float: "right" }}>{formatMoney(orderRequest?.fee || 0)}</td>
                                            </tr>
                                            <tr>
                                                <td>Tổng tiền</td>
                                                <td>:</td>
                                                <td style={{ float: "right" }}>{formatMoney(orderRequest?.total || 0)}</td>
                                            </tr>
                                        </table>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid xs={6}>
                                <Box>
                                    <TextareaAutosize
                                        maxLength={500}
                                        label={"Ghi chú"}
                                        minHeight={60}
                                        value={orderRequest?.note}
                                        onChange={(e: any) => {
                                            set((prev) => ({
                                                ...prev,
                                                orderRequest: {
                                                    ...prev.orderRequest,
                                                    note: e.target.value,
                                                }
                                            }))
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </>;
};

const mapStateToProps = (state: AppState) => ({
    menuState: state.menu,
    authState: state.auth,
    storeContext: state.storeContext,
});
export default connect(mapStateToProps, {})(withStyles(styles)(EditOrder));