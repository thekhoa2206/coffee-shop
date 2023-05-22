import { Box, FormControlLabel, Grid, IconButton, InputAdornment, Link, MenuItem, Typography, withStyles } from "@material-ui/core";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "store/store";
import { CreateOrderProps, OrderRequest, ProductItemRequest } from "./CreateOrder.types";
import styles from "./CreateOrder.styles";
import HeaderAction from "components/HeaderAction";
import Button from "components/Button";
import { useHistory } from "react-router-dom";
import Checkbox from "components/Checkbox";
import StoreService, { CityResponse, DistrictResponse, StoreResponse, WardResponse } from "services/StoreService";
import TextField from "components/TextField";
import InputChoiceCityDistrict from "components/InputChoiceCityDistrict";
import InputChoiceWard from "components/InputChoiceWard";
import InputChoiceDistrict from "components/InputChoiceDistrict";
import { CloseIcon, PlusIcon } from "components/SVG";
import NumberInputTextField from "components/NumberInput/NumberInputTextField";
import TextareaAutosize from "components/TextField/TextareaAutosize";
import { useOrderStore } from "./store";
import OrdersService, { CustomerResponse, FeeRequest } from "services/OrdersService";
import { formatMoney, formatStringLength, getMessageError, hasPermission } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { REGEX_EMAIL, REGEX_PHONE_NUMBER_VN } from "utilities/Regex";
import SearchSuggest from "components/Filter/SearchSuggest";
import PartnerService, { PartnerFilterRequest } from "services/PartnerService";
import { AccountRole } from "utilities/AccountRole";
import _, { isArray } from "lodash";
import SearchSuggestInfinite from "components/Select/SearchSuggestInfinite";
import { DataSource } from "components/Select/types";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import { DialogAddCustomer } from "page/Partner/customer/DialogAddCustomer/DialogAddCustomer";

const CreateOrder = (props: CreateOrderProps) => {
    const history = useHistory();
    const { authState, classes, storeContext } = props;
    const [store, setStore] = useState<StoreResponse>();
    const [city, setCity] = useState<CityResponse | null | undefined>();
    const [district, setDistrict] = useState<DistrictResponse | null | undefined>();
    const [ward, setWard] = useState<WardResponse | null | undefined>();
    const [openDialogAddCustomer, setOpenDialogAddCustomer] = useState(false);
    const [selected, setSelected] = useState<CustomerResponse | null>()
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
        history.push("/admin/orders");
    };
    useEffect(() => {
        if(totalWeightValue !==0 && orderRequest?.customer?.districtId && store){
            handleUpdateFee();
        }
    }, [orderRequest?.packsizeWeightValue, lineItems, customer.id])
    const handleUpdateFee = async() => {
        let filter: FeeRequest = {
            totalWeightValue: totalWeightValue || 0,
            districtShipId: orderRequest?.customer?.districtId,
            districtReceiptId: store?.id || 0,
        }
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

    const createOrder = async () => {
        let order: OrderRequest = {
            ...orderRequest,
            storeId: storeContext.store?.id,
            packsizeWeightValue: totalWeightValue,
            lineItem: lineItems,
            customer: {
                ...orderRequest?.customer,
                storeId: storeContext.store?.id
            },
        }
        if(!order.customer?.id){
            SnackbarUtils.error("Thông tin người nhận không được để trống!");
            return;
        }
        if(!order.cod){
            SnackbarUtils.error("Tiền thu hộ không được để trống!");
            return;
        }
        if(!order.lineItem){
            SnackbarUtils.error("Thông tin sản phẩm không được để trống!");
            return;
        }
        let isError = false;
        for(let i = 0; i < order.lineItem.length; i++){
            if(!order.lineItem[i].name){
                isError = true;
                SnackbarUtils.error("Tên sản phẩm không được để trống!");
                break;
            }
            if(!order.lineItem[i].quantity){
                isError = true;
                SnackbarUtils.error("Trọng lượng sản phẩm không được để trống!");
                break;
            }
            if(!order.lineItem[i].price){
                isError = true;
                SnackbarUtils.error("Giá sản phẩm không được để trống!");
                break;
            }
        }
        if(isError) return;
        try {
            let res = await OrdersService.create(order);
            if (res) {
                SnackbarUtils.success("Tạo đơn thành công!");
                history.push(`/admin/orders/${res.data.OrderResponse.id}`);
            }
        } catch (e) {
            SnackbarUtils.error(getMessageError(e));
        }
    }

    const getDeliveryService = async (filter: any) => {
        let filterCustomer: PartnerFilterRequest = {
            limit: 250,
            page: 1,
            status: "active",
            query: filter.query,
        };
        try {
            let res = await PartnerService.filter(filterCustomer);
            const dataSource = {} as DataSource;
            if (res.data.list_partner &&
                res.data.list_partner.partnerResponses &&
                res.data.list_partner.partnerResponses.length > 0
            ) {
                dataSource.data = res.data.list_partner.partnerResponses;
            } else {
                dataSource.data = [];
            }
            return Promise.resolve(dataSource);
        } catch (e) { }
    };
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
                        onClick={() => { createOrder() }}
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
                                <Grid xs={12} style={{ marginTop: 10 }}>
                                    <SearchSuggestInfinite
                                        className={selected ? "" : classes.searchBox}
                                        type="select-search"
                                        value={selected}
                                        getOptionLabel={(option) => (option ? option.name : "")}
                                        getLabelSelect={(value) => (!isArray(value) ? value?.name || "" : "")}
                                        placeholder={"Chọn khách hàng"}
                                        placeholderSelect={"Tìm kiếm khách hàng"}
                                        onChange={(value) => {
                                            if (!isArray(value) && value) {
                                                set((prev) => ({
                                                    ...prev,
                                                    orderRequest: {
                                                        ...prev.orderRequest,
                                                        customer: {
                                                            ...prev.customer,
                                                            wardId: value?.wardId,
                                                            cityId: value?.cityId,
                                                            districtId: value?.districtId,
                                                            code: value?.code,
                                                            id: value?.id,
                                                            address: value?.address,
                                                            name: value?.name,
                                                            phone: value?.phone,
                                                            storeId: value?.storeId,
                                                            cityName: value?.cityName,
                                                            districtName: value?.districtName,
                                                            wardName: value?.wardName,
                                                        }
                                                    }
                                                }))
                                                setSelected(value)
                                            }
                                        }}
                                        removeable
                                        uniqKey="id"
                                        fetchDataSource={(filter) => getDeliveryService(filter)}
                                        placement="bottom"
                                        renderOption={(option) => (
                                            <MenuItem className={classes.customOptionShipper}>
                                                <AccountCircleRoundedIcon className="icon" />
                                                <Box display={"flex"} width={"calc(100% - 20px)"}>
                                                    <Box width="45%">
                                                        <Typography noWrap>{formatStringLength(option.name, 20)}</Typography>
                                                        {option.phone ? (
                                                            <Typography variant={"subtitle1"} noWrap>
                                                                {option.phone}
                                                            </Typography>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </Box>
                                                </Box>
                                            </MenuItem>
                                        )}
                                        width="95%"
                                        debounce={300}
                                        creatable={true}
                                        required
                                        creatableText="Thêm mới khách hàng"
                                        handleClickCreatable={() => { setOpenDialogAddCustomer(true) }}

                                    />
                                </Grid>
                                {orderRequest?.customer && <>
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
                                </>}
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
                                                    placeholder={"Nhập tên hàng" + (index + 1)}
                                                    onChange={(e: any) => {
                                                        updateProductLineItem({ ...product, name: e.target.value })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid container xs={12} style={{marginTop: 20}}>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="Số lượng"
                                                        placeholder="Số lượng"
                                                        style={{ width: "95%" }}
                                                        required
                                                        onChange={(e: any) => {
                                                            updateProductLineItem({ ...product, quantity: e.target.value })

                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="Trọng lượng"
                                                        placeholder="Trọng lượng"
                                                        style={{ width: "95%" }}
                                                        required
                                                        onChange={(e: any) => {
                                                            updateProductLineItem({ ...product, weightValue: e.target.value })

                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <NumberInputTextField
                                                        placeholder="Giá trị hàng"
                                                        style={{ width: "95%" }}
                                                        required
                                                        onChange={(e: any) => {
                                                            updateProductLineItem({ ...product, price: e.target.value })
                                                        }}
                                                        name={"price"}
                                                        label="Giá"
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
                                            required
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
        <DialogAddCustomer
            initData={(customerR) => {
                set((prev) => ({
                    ...prev,
                    customer: {
                        ...prev.customer,
                        wardId: customerR?.wardId,
                        cityId: customerR?.cityId,
                        districtId: customerR?.districtId,
                        code: customerR?.code,
                        id: customerR?.id,
                        address: customerR?.address,
                        name: customerR?.name,
                        phone: customerR?.phone,
                        storeId: customerR?.storeId,
                        cityName: customerR?.cityName,
                        districtName: customerR?.districtName,
                        wardName: customerR?.wardName,
                    }
                }))
                setSelected(customerR)
            }}
            onClose={() => setOpenDialogAddCustomer(false)}
            open={openDialogAddCustomer}
            storeContext={storeContext}
        />
    </>;
};

const mapStateToProps = (state: AppState) => ({
    menuState: state.menu,
    authState: state.auth,
    storeContext: state.storeContext,
});
export default connect(mapStateToProps, {})(withStyles(styles)(CreateOrder));
