import { Box, Typography, withStyles } from "@material-ui/core";
import Button from "components/Button";
import Checkbox from "components/Checkbox";
import Image from "components/Image";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import TableService, { TableFilterRequest, TableResponse } from "services/TableService";
import { AppState } from "store/store";
import { colorBlue, colorGreen, colorRedWarning } from "theme/palette";
import Table from "../../images/table.png";
import styles from "./ChannelPos.styles";
import { ChannelPosProps } from "./ChannelPos.type";
import { DialogCreateOrder } from "./components/DialogCreateOrder/DialogCreateOrder";
import { useOrderTableStore } from "./store";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import OrderService, { OrderItemRequest, OrderRequest, OrderResponse } from "services/OrderService";
import { getMessageError } from "utilities";
import { useHistory } from "react-router-dom";
import { BoxOrder } from "./components/BoxOrder/BoxOrder";
import { DialogSplitOrder } from "./components/DialogSplitOrder/DialogSplitOrder";
const ChannelPos = (props: ChannelPosProps & PropsFromRedux) => {
    const [filter, setFilter] = useState<TableFilterRequest>({
        page: 1,
        limit: 20
    });
    const [openCreateOrder, setOpenCreateOrder] = useState<boolean>(false);
    const [openOrders, setOpenOrders] = useState<boolean>(false);
    const [orderSplit, setOrderSplit] = useState<OrderResponse>();
    const [openSplitOrders, setOpenSplitOrders] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [openButton, setOpenButton] = useState(false);
    const classes = props.classes;
    const [tableRes, setTableRes] = useState<TableResponse[]>([]);
    const { tables, set, lineItems, code, order, note, discountTotal, total, reset } = useOrderTableStore();
    const history = useHistory();
    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        let res = await TableService.filter(filter);
        if (res.data) {
            setTableRes(res.data?.data || []);
        }
    }
    const genStatus = (status: number) => {
        let statusString;
        switch (status) {
            case 1:
                statusString = "Đang sử dụng"
                break;
            case 2:
                statusString = "Bàn không hoạt động"
                break;
            case 3:
                statusString = "Bàn trống"
                break;
            default:
                statusString = "Bàn không hoạt động"
                break;
        }
        return statusString;
    }

    const genColor = (status: number) => {
        let color = "";
        switch (status) {
            case 1:
                color = colorBlue.primary["main"]
                break;
            case 2:
                color = colorRedWarning.primary["main"]
                break;
            case 3:
                color = colorGreen.primary["main"];
                break;
            default:
                color = colorRedWarning.primary["main"]
                break;
        }
        return color;
    }
    const handleChangeSelected = (item: TableResponse) => {
        var oldTable = tables?.find((t) => t.id === item.id);
        if (oldTable) {
            set((prev) => ({
                ...prev,
                tables: tables?.filter((t) => t.id !== item.id)
            }))
        } else {
            set((prev) => ({
                ...prev,
                tables: [...tables || [], item]
            }))
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
    const createOrder = async () => {
        if (!lineItems || lineItems.length === 0) {
            SnackbarUtils.error("Sản phẩm không được để trống");
            return;
        }
        if (code && code.includes("DON")) {
            SnackbarUtils.error("Mã đơn hàng không được có tiền tố DON");
            return;
        }
        let orderLineItems: OrderItemRequest[] = [];
        let error = null;
        lineItems.forEach((i) => {
            if (i.quantity > (i.available || 0)) {
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
        let tableId = tables?.map((x) => (
            x.id))
        let requestOrder: OrderRequest = {
            customerId: 1,
            note: note,
            discountTotal: discountTotal || 0,
            orderItemRequest: orderLineItems,
            code: code,
            total: total || 0,
            tableIds: tableId
        };
        try {
            let res = await OrderService.create(requestOrder);
            if (res.data) {
                SnackbarUtils.success("Tạo đơn hàng thành công!");
                setOpenCreateOrder(false);
                set((prev) => ({
                    ...prev,
                    tables: null,
                }))
                initData();
                reset();
            }
        } catch (error) {
            SnackbarUtils.error(getMessageError(error));
        }
    };

    const handleUpdateStatus = async () => {
        if (tables?.length === 0) {
            SnackbarUtils.error("Hãy chọn bàn để làm trống!");
            return;
        }
        if (tables?.find((item) => item.status === 3)) {
            SnackbarUtils.error("Vui lòng chọn bàn Đang sử dụng!");
            return;
        }
        try {
            let res = await TableService.updateStatus(3, tables?.map((i) => i.id).join(","));
            if (res.data) {
                SnackbarUtils.success("Làm trống bàn thành công!");
                initData();
            }
        } catch (error) {
            SnackbarUtils.error(getMessageError(error));
        }
    }

    const createSplitOrder = (order: OrderResponse) => {
        setOrderSplit(order);
        setOpenSplitOrders(true);
    }
    return (
        <Box style={{ width: "95%" }}>
            <Box style={{ width: "95%", marginTop: 10 }}>
                <Button variant="contained" color="primary" style={{ float: "right" }}
                    onClick={() => {
                        if (!tables) {
                            SnackbarUtils.error("Phải chọn bàn để tạo đơn!");
                            return;
                        }
                        // if (tables?.find((i) => i.status === 1)) {
                        //     SnackbarUtils.error("Có bàn đang sử dụng!");
                        //     return;
                        // }
                        setOpenCreateOrder(true);
                    }}
                >
                    Tạo đơn hàng
                </Button>
                {/* <Button variant="outlined" color="primary" style={{ float: "right", marginRight: 10 }}
                    onClick={() => {
                        handleUpdateStatus();
                    }}
                >
                    Đánh dấu bàn trống
                </Button> */}
                <Button variant="outlined" color="primary" style={{ float: "right", marginRight: 10 }} onClick={() => {setOpenOrders(true)}}>Đơn hàng đang phục vụ</Button>
            </Box>
            <Box style={{ width: "95%", margin: "auto", top: "20px", display: "flex", flexWrap: "wrap", marginTop: 20 }}>
                {tableRes.map((item, index) => (
                    <Box style={{ width: 120, textAlign: "center", cursor: "pointer", margin: 10 }} key={index}
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            handleChangeSelected(item);
                            setOpenButton(!openButton);
                            setAnchorEl(event.currentTarget);
                        }}
                        aria-describedby={item.id}
                        id={item.id}
                    >
                        <Checkbox value={item.id} checked={!!tables?.find((i) => i.id === item.id)} />
                        <Image src={Table} style={{ width: 100 }} />
                        <Box style={{ display: "flex", width: 100, margin: "auto" }}>
                            <Box style={{ width: 10, height: 10, background: genColor(item.status), marginTop: 5, borderRadius: 50 }}></Box>
                            <Typography style={{ fontSize: 10, marginLeft: 5 }}>({genStatus(item.status)})</Typography>
                        </Box>
                        <Typography>{item.name}</Typography>

                    </Box>
                ))}
                <DialogCreateOrder createOrder={createOrder} tables={tables || []} open={openCreateOrder} onClose={() => { setOpenCreateOrder(false) }} />
            </Box>
            <BoxOrder
                open={openOrders} onClose={() => {setOpenOrders(false)}}  createSplitOrder={createSplitOrder}/>

            {orderSplit && <DialogSplitOrder order={orderSplit} open={openSplitOrders} onClose={() => {setOpenSplitOrders(false)}}/>}
        </Box>
    );
};

const mapStateToProps = (state: AppState) => ({
    menuState: state.menu,
    authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(ChannelPos));