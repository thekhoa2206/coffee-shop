import { Box, Grid, withStyles } from "@material-ui/core";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { AppState } from "store/store";
import useStyles from "./Dashboard.styles";
import { ReportOrderProps } from "./Dashboard.types";
import DashboardRevenueComponent from "./components/DashboardRevenue/DashboardRevenue.component";

const ReportOrder = (props: ReportOrderProps & PropsFromRedux) => {
  const { classes, authState } = props;
  return (
    <Box>
      <Box
      style={{ margin: "auto", marginTop: 30, width: "90%", height: "500px" }}
      >
<DashboardRevenueComponent/>
      </Box>
      <Box style={{ margin: "auto", marginTop: 60, width: "90%" }}>
        <Grid xs={12} container spacing={2}>
          <Grid xs={6} item>

          </Grid>
          <Grid xs={6} item>
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
