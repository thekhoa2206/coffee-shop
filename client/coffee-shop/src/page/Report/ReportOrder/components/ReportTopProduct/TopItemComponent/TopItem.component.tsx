import { Avatar, Box, Link, Typography, withStyles } from "@material-ui/core";
import React, { Fragment } from "react";
import styles from "./TopItem.style";
import { connect } from "react-redux";
import { TopItemProps } from "./TopItem.types";
import Tooltip from "components/Tooltip";
import { AppState } from "store/store";
import { formatMoney } from "utilities";

const TopItem = (props: TopItemProps) => {
  const { classes, item, index, isStore } = props;
  return (
    <Box className={classes.root}>
      <Avatar className={`color-${index}`}>0{index}</Avatar>
      {item ? (
        <Fragment>
          <Box className={classes.boxVariantName}>
            <Tooltip title={item.variant?.name} placement="top-start" arrow leaveDelay={1}>
              <Typography variant="subtitle1" noWrap style={{ maxWidth: "100%" }} color="textPrimary">
                {item.variant?.name}
              </Typography>
            </Tooltip>
          </Box>
          <Box className={classes.boxVariantAmount}>
            <Tooltip title={isStore ? "Số lượng đơn hàng và tổng doanh thu của cửa hàng" : "Số lượng đơn hàng và tổng COD của cửa hàng"} placement="top-start" arrow leaveDelay={1}>
              <Typography variant="subtitle1" color="textPrimary">
                {item.totalQuantity}
              </Typography>
            </Tooltip>
              <Typography variant="subtitle1" color="textPrimary">
                {formatMoney(item.totalRevenue || 0)}
              </Typography>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          <Box width="calc(100% - 200px)" className={classes.boxVariantName}>
            <Box className={classes.textNoData} width="100%" height={18}></Box>
            <Box className={classes.textNoData} width="40%" height={7}></Box>
          </Box>
          <Box className={classes.textNoData} width={95} marginLeft="auto" height={18} alignSelf="flex-start"></Box>
        </Fragment>
      )}
    </Box>
  );
};

const mapStateToProps = (state: AppState) => ({
});
export default connect(mapStateToProps)(withStyles(styles)(TopItem));
