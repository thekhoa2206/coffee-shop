import { Box, withStyles } from "@material-ui/core";
import React from "react";
import BussinesssReult from "./BussinessResult";
import styles from "./DashboardLeft.styles";
import { DashboardLeftProps } from "./DashboardLeft.types";
import OrderWaitHandle from "./OrderWaitHandle";
import RevenueProportionSaleComponent from "./RevenueProportionSale/RevenueProportionSale.component";
import TopShipper from "./TopShipper/TopShipper";
import TopShipperStore from "./TopShipperStore/TopShipperStore";

const DashboardLeft = (props: DashboardLeftProps) => {
  return (
    <Box className={props.classes.root} display="flex" flexWrap="wrap" style={{marginTop: 40, marginLeft: 40}}>
      <BussinesssReult></BussinesssReult>
      <OrderWaitHandle></OrderWaitHandle>
      <RevenueProportionSaleComponent></RevenueProportionSaleComponent>
      <TopShipperStore></TopShipperStore>
      <TopShipper></TopShipper>
    </Box>
  );
};

export default withStyles(styles)(DashboardLeft);
