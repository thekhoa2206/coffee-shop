import { Box, withStyles } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { MenuState } from "store/Menu/types";
import { AppState } from "store/store";
import { DashboardProps } from "./Dashboard.types";
import styles from "./Dashboard.styles";
import DashboardLeftComponent from "./DashboardLeft/DashboardLeft.component";


const Dashboard = (props: DashboardProps) => {
    const {menuState , classes} = props;
    return<Box>
      <Box className={classes.root}>
        <Box
            className={`${menuState && menuState.collapse ? "info-left-collapse" : "info-left-expand"} ${
              classes.infoLeft
            }`}
          >
            <DashboardLeftComponent />
          </Box>
      </Box>
    </Box>;
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
export default connect(mapStateToProps, {})(withStyles(styles)(Dashboard));