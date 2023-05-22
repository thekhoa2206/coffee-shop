import { Box, Grid, Link, MenuItem, Typography, withStyles } from "@material-ui/core";
import Select from "components/Select/Index";
import { MoneyBagIcon, OrderCancelIcon, OrderIcon } from "components/SVG";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import OrdersService, { RevenueCurrentDate } from "services/OrdersService";
import { AppState } from "store/store";
import { formatNumber } from "utilities";
import { AccountRole } from "utilities/AccountRole";
import { CompositeFulfillmentStatus } from "utilities/DeliveryCollationStatus";
import BoxNoAccess from "../BoxNoAccess";
import styles from "./BussinessResult.styles";
import { BussinessResultProps } from "./BussinessResult.types";

const BussinesssReult = (props: BussinessResultProps) => {
  const { classes, authContext  } = props;
  const { t } = useTranslation(["dashboard", "common"]);
  const [access, setAccess] = useState(true);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalOrderCancel, setTotalOrderCancel] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrderReturn, setTotalOrderReturn] = useState(0);
  const [tokenAnalytic, setTokenAnalytic] = useState("");
  const [locationId, setLocationId] = useState(0);
  const [data, setData] = useState<RevenueCurrentDate>();
  const [nameLocationLinkAnalytics, setNameLocationLinkAnalytics] = useState("");

  const nowDate = moment(new Date()).format("YYYY-MM-DD");


  useEffect(() => {
    if (authContext && authContext.user) {
      initData();
    } else {
      setAccess(false);
    }
  }, []);
  const initData = async () => {
    let res = await OrdersService.getDashboard();
    if(res.data){
      setData(res.data.RevenueCurrentDate)
    }
  }
  return (
    <Box className={classes.root} borderRadius="3px">
      <Box className="box-title">
        <Typography variant="h6">KẾT QUẢ KINH DOANH TRONG NGÀY</Typography>
        
      </Box>
      {access ? (
        <Box className={classes.resultList} display="flex" width="100%">
          <Grid className={classes.resultItem} xs={3} item>
            <Link
              href={
                `/admin/analytics/sale_orders/revenue_by_order?&dateRangeType=today&location=${nameLocationLinkAnalytics}`
              }
              target="_blank"
              underline="none"
              color="textPrimary"
            >
              <Box className={`${classes.resultItemIcon} ${classes.backgroundColorAmount}`}>
                <MoneyBagIcon style={{height: 20}} />
              </Box>
              <Box className={`content`}>
                <Typography variant="subtitle1">Doanh thu</Typography>
                <Typography variant="h5" className={classes.colorAmount}>
                  {formatNumber(data?.revenues || 0)}
                </Typography>
              </Box>
            </Link>
          </Grid>
          <Grid className={classes.resultItem} xs={3} item>
            <Link
              href={`/admin/orders?created_on_predefined=today${locationId !== 0 ? `&location_ids=${locationId}` : ""}`}
              target="_blank"
              underline="none"
              color="textPrimary"
            >
              <Box className={`${classes.resultItemIcon} ${classes.backgroundColorOrder}`}>
                <OrderIcon />
              </Box>
              <Box className={`content`}>
                <Typography variant="subtitle1">Đơn hàng mới</Typography>
                <Typography variant="h5" className={classes.colorOrder}>
                  {formatNumber(data?.quantityNewOrders || 0)}
                </Typography>
              </Box>
            </Link>
          </Grid>
          <Grid className={classes.resultItem} xs={3} item>
            <Link
              href={`/admin/order_returns?created_on_predefined=today&refundStatuses=partial,paid${
                locationId !== 0 ? `&location_ids=${locationId}` : ""
              }`}
              target="_blank"
              underline="none"
              color="textPrimary"
            >
              <Box className={`${classes.resultItemIcon} ${classes.backgroundColorOrderReturn}`}>
                <OrderCancelIcon />
              </Box>
              <Box className={`content`}>
                <Typography variant="subtitle1">Đơn hàng đã trả</Typography>
                <Typography variant="h5" className={classes.colorOrderReturn}>
                  {formatNumber(data?.quantityReturnOrders || 0)}
                </Typography>
              </Box>
            </Link>
          </Grid>
          <Grid className={classes.resultItem} xs={3} item>
            <Link
              href={`/admin/orders?cancelled_on_predefined=today${
                locationId !== 0 ? `&location_ids=${locationId}` : ""
              }`}
              target="_blank"
              underline="none"
              color="textPrimary"
              style={{ borderRight: "none" }}
            >
              <Box className={`${classes.resultItemIcon} ${classes.backgroundColorOrderCancel}`}>
                <OrderCancelIcon />
              </Box>
              <Box className={`content`}>
                <Typography variant="subtitle1">Đơn hủy</Typography>
                <Typography variant="h5" className={classes.colorOrderCancel}>
                  {formatNumber(data?.quantityCancelOrders || 0)}
                </Typography>
              </Box>
            </Link>
          </Grid>
        </Box>
      ) : (
        <BoxNoAccess type="icon"></BoxNoAccess>
      )}
    </Box>
  );
};
const mapStateToProps = (state: AppState) => ({
  authContext: state.auth,
});
export default connect(mapStateToProps)(withStyles(styles)(BussinesssReult));
