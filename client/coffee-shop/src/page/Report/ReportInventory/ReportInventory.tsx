import { withStyles } from "@material-ui/core";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { AppState } from "store/store";
import useStyles from "./ReportInventory.styles";
import { ReportInventoryProps } from "./ReportInventory.types";

const ReportInventory = (props: ReportInventoryProps & PropsFromRedux) => {
  const {  classes, authState } = props;
  return (
    <>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(useStyles)(ReportInventory));

