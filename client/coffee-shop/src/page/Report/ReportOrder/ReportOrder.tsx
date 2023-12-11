import { Box, Grid, withStyles } from "@material-ui/core";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { AppState } from "store/store";
import useStyles from "./ReportOrder.styles";
import { ReportOrderProps } from "./ReportOrder.types";
import RevenueComponent from "./components/Revenue/Revenue.component";
import ReportTopProduct from "./components/ReportTopProduct/ReportTopProduct";
import ReportTopCustomer from "./components/ReportTopCustomer/ReportTopCustomer";

const ReportOrder = (props: ReportOrderProps & PropsFromRedux) => {
  const { classes, authState } = props;
  return (
    <Box>
      <Box style={{ margin: "auto", marginTop: 30, width: "90%", height: "500px" }}>
        <RevenueComponent />
      </Box>
      <Box style={{ margin: "auto", marginTop: 60, width: "90%" }}>
        <Grid xs={12} container spacing={2}>
          <Grid xs={6} item>
            <ReportTopProduct />
          </Grid>
          <Grid xs={6} item>
            {/* <ReportTopCustomer /> */}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(useStyles)(ReportOrder));

