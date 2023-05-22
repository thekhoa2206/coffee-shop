import { Box, MenuItem, Typography, withStyles } from "@material-ui/core";
import { Image } from "@material-ui/icons";
import CircularProgress from "components/Loading/CircularProgress";
import Select from "components/Select/Index";
import { OrderPenddingIcon, OrderShippingIcon, OrderWaitPackageIcon, OrderWaitPaymentIcon, OrderWaitReceiveIcon, OrderWaitShipIcon } from "components/SVG";
import moment from "moment";
import { getOrderShipStatusName, getOrderStatusName, OrderShipStatus, OrderStatus } from "page/Order/list/OrdersFilter/OrdersQuickFilter.consant";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import OrdersService, { OrdersFilter, OrdersFilterRequest } from "services/OrdersService";
import { AppState } from "store/store";
import {
  CompositeFulfillmentStatus,
  DeliveryType,
  formatDateUTC,
  GetNameCompositeFulfillmentStatus,
  hasPermission
} from "utilities";
import { AccountRole } from "utilities/AccountRole";
import { DateRangeType, GetListDateRangeOrderHandle, GetNameDateRangeType } from "utilities/DateRangeType";
import BoxNoAccess from "../BoxNoAccess";
import styles from "./OrderWaitHandle.styles";
import { OrderWaitHandleProps } from "./OrderWaitHandle.types";
import OrderWaitHandleItem from "./OrderWaitHandleItem";

const OrderWaitHandle = (props: OrderWaitHandleProps) => {
  const { classes, authContext, storeContext } = props;
  const [access, setAccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("dashboard");
  const [createOnMin, setCreateOnMin] = useState(
    moment(new Date()).startOf("days").subtract(6, "days").format("DD/MM/YYYY")
  );
  const [createOnMax, setCreateOnMax] = useState(moment(new Date()).startOf("days").format("DD/MM/YYYY"));
  const [packedOnMin, setPackedOnMin] = useState(
    moment(new Date())
      .startOf("days")
      .subtract(6, "days")
      .subtract(moment.duration(7, "hours"))
      .format("YYYY-MM-DDTHH:mm:ss[Z]")
  );
  const [packedOnMax, setPackedOnMax] = useState(
    moment(new Date())
      .startOf("days")
      .add(moment.duration(1, "days"))
      .subtract(moment.duration(7, "hours"))
      .subtract(moment.duration(1, "seconds"))
      .format("YYYY-MM-DDTHH:mm:ss[Z]")
  );
  const [dateRange, setDateRange] = useState(DateRangeType.DAY_LAST_7);
  const [stateCountData, setState] = useState({
    draftState: 0,
    waitForPaidState: 0,
    waitToPackState: 0,
    packedState: 0,
    reutrningState: 0,
    finishState: 0,
  });
  const [filter, setFilter] = useState<OrdersFilter>(
    {
      status: [OrderStatus.DRAFT, OrderStatus.READY_TO_PICK, OrderStatus.PICKING, OrderStatus.DELIVERING, OrderStatus.RETURNING, OrderStatus.FINISH].join(','),
      page: 1,
      limit: 1000
    }
  );
  const { draftState, waitForPaidState, waitToPackState, packedState, reutrningState, finishState } =
    stateCountData;
  const handleChangeTime = (event: React.ChangeEvent<{ value: string }>) => {
   
  };
  useEffect(() =>{
    initData();
  }, [])
  const initData = () => {
    if(filter){
      OrdersService.countOrders(filter).then((res) =>{
        if(res){
          setState({
            draftState: res.data.list_analytics_order_response.listAnalytics?.find((i) => i.status === OrderStatus.DRAFT)?.count || 0,
            waitForPaidState: res.data.list_analytics_order_response.listAnalytics?.find((i) => i.status === OrderStatus.READY_TO_PICK)?.count || 0,
            waitToPackState: res.data.list_analytics_order_response.listAnalytics?.find((i) => i.status === OrderStatus.PICKING)?.count || 0,
            packedState: res.data.list_analytics_order_response.listAnalytics?.find((i) => i.status === OrderStatus.DELIVERING)?.count || 0,
            reutrningState: res.data.list_analytics_order_response.listAnalytics?.find((i) => i.status === OrderStatus.RETURNING)?.count || 0,
            finishState: res.data.list_analytics_order_response.listAnalytics?.find((i) => i.status === OrderStatus.FINISH)?.count || 0,
          })
        }
      })
    }
  }

  return (
    <Box className={classes.root} borderRadius="3px">
      <Box className="box-title">
        <Typography variant="h6">ĐƠN HÀNG CHỜ XỬ LÝ TRONG NGÀY</Typography>
        {access && (
          <Box className="header-group-button">
            {/* <Select
              className={classes.selectDateRange}
              value={dateRange}
              style={{ height: 36 }}
              onChange={(event: React.ChangeEvent<{ value: any }>) => {
                handleChangeTime(event);
              }}
            >
              {GetListDateRangeOrderHandle.map((item) => (
                <MenuItem value={item} key={item}>
                  {GetNameDateRangeType(item)}
                </MenuItem>
              ))}
            </Select> */}
          </Box>
        )}
      </Box>
      {loading ? (
        <Box className={classes.boxLoading}>
          <CircularProgress/>
        </Box>
      ) : access ? (
        <Box className={classes.orderWaitHandleList}>
          <OrderWaitHandleItem
            icon={<OrderPenddingIcon color="primary" />}
            count={draftState}
            decription={getOrderStatusName(OrderStatus.DRAFT)}
            href={`/admin/orders?status=${OrderStatus.DRAFT}&created_on_min=${formatDateUTC(
              createOnMin
            )}&created_on_max=${formatDateUTC(createOnMax, true)}`}
          />
          <OrderWaitHandleItem
            icon={<OrderWaitPaymentIcon color="primary" />}
            count={waitForPaidState}
            decription={getOrderStatusName(OrderStatus.READY_TO_PICK)}
            href={`/admin/orders?status=${OrderStatus.READY_TO_PICK}&created_on_min=${formatDateUTC(
              createOnMin
            )}&created_on_max=${formatDateUTC(createOnMax, true)}`}
          />
          <OrderWaitHandleItem
            icon={<OrderWaitPackageIcon color="primary" />}
            count={waitToPackState}
            decription={getOrderStatusName(OrderStatus.PICKING)}
            href={`/admin/orders?status=${OrderStatus.PICKING}&created_on_min=${formatDateUTC(
              createOnMin
            )}&created_on_max=${formatDateUTC(createOnMax, true)}`}
          />
          <OrderWaitHandleItem
            icon={<OrderWaitShipIcon color="primary"  />}
            count={packedState}
            decription={getOrderStatusName(OrderStatus.DELIVERING)}
            href={`/admin/orders?status=${OrderStatus.DELIVERING}&created_on_min=${formatDateUTC(
              createOnMin
            )}&created_on_max=${formatDateUTC(createOnMax, true)}`}
          />
          <OrderWaitHandleItem
            icon={<OrderShippingIcon color="primary" />}
            count={reutrningState}
            decription={getOrderStatusName(OrderStatus.RETURNING)}
            href={`/admin/orders?status=${OrderStatus.RETURNING}&created_on_min=${formatDateUTC(
              createOnMin
            )}&created_on_max=${formatDateUTC(createOnMax, true)}`}
          />
          <OrderWaitHandleItem
            icon={<OrderShippingIcon color="primary" />}
            count={finishState}
            decription={getOrderStatusName(OrderStatus.FINISH)}
            href={`/admin/orders?status=${OrderStatus.FINISH}&created_on_min=${formatDateUTC(
              createOnMin
            )}&created_on_max=${formatDateUTC(createOnMax, true)}`}
          />
        </Box>
      ) : (
        <BoxNoAccess type="icon" />
      )}
    </Box>
  );
};
const mapStateToProps = (state: AppState) => ({
  theme: state.theme,
  authContext: state.auth,
  storeContext: state.storeContext,
});

export default connect(mapStateToProps)(withStyles(styles)(OrderWaitHandle));
