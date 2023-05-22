import { Avatar, Grid, Link, Typography, withStyles } from "@material-ui/core";
import React from "react";
import { formatNumber } from "utilities/Helpers";
import styles from "./OrderWaitHandleItem.styles";
import { OrderWaitHandleItemProps } from "./OrderWaitHandleItem.types";

const OrderWaitHandleItem = (props: OrderWaitHandleItemProps) => {
  const { classes, icon, count, decription, href } = props;

  return (
    <Grid container className={classes.root} xs={2} item>
      <Link href={href} target="_blank" className="link">
        <Grid className={classes.orderHandleIcon}>
          <Avatar style={{ width: "44px", height: "44px" }} className={classes.backgroundIconOrder}>
            {icon}
          </Avatar>
        </Grid>
        <Typography variant="body2" style={{ width: "100%" }}>
          {decription}
        </Typography>
        <Typography variant="subtitle1" style={{ width: "100%" }}>
          {formatNumber(count)}
        </Typography>
      </Link>
    </Grid>
  );
};

export default withStyles(styles)(OrderWaitHandleItem);
