import { Box, Grid, Typography } from "@material-ui/core";
import Button from "components/Button";
import HeaderAction from "components/HeaderAction";
import Paper from "components/Paper";
import { isNil } from "lodash";
import React, { useState } from "react";
import { memo, Fragment } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory } from "react-router-dom";
import StoreService from "services/StoreService";
import { AppState } from "store/store";
import { getMessageError } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import BoxStoreInfo from "./component/BoxStoreInfo/BoxStoreInfo";
import BoxUserInfo from "./component/BoxUserInfo/BoxUserInfo";
import useStyles from "./CreateStore.styles";
import { CreateStoreRequest } from "./CreateStore.types";

const CreateStore = memo((props: PropsFromRedux) => {
  const classes = useStyles();
  const history = useHistory();
  const [store, setStore] = useState<CreateStoreRequest>();

  const createStore = async () => {
    if(isNil(store?.email)){
        SnackbarUtils.error("Email cửa hàng không được để trống");
        return;
    }
    if(isNil(store?.phoneNumber)){
        SnackbarUtils.error("SĐT cửa hàng không được để trống");
        return;
    }
    if(isNil(store?.address)){
        SnackbarUtils.error("Địa chỉ cửa hàng không được để trống");
        return;
    }
    if(isNil(store?.label)){
        SnackbarUtils.error("Tên cửa hàng không được để trống");
        return;
    }
    if(isNil(store?.districtId)){
        SnackbarUtils.error("Quận/Huyện không được để trống");
        return;
    }
    if(isNil(store?.wardId)){
        SnackbarUtils.error("Phường/Xã không được để trống");
        return;
    }
    if(isNil(store?.account)){
        SnackbarUtils.error("Thông tin chủ cửa hàng không được để trống");
        return;
    }
    if(isNil(store?.account.email)){
        SnackbarUtils.error("Email chủ cửa hàng không được để trống");
        return;
    }
    if(isNil(store?.account.name)){
        SnackbarUtils.error("Tên chủ cửa hàng không được để trống");
        return;
    }
    if(isNil(store?.account.password)){
        SnackbarUtils.error("Mật khẩu chủ cửa hàng không được để trống");
        return;
    }
    if(isNil(store?.account.phoneNumber)){
        SnackbarUtils.error("SĐT chủ cửa hàng không được để trống");
        return;
    }

    try {
        let res = await StoreService.create(store);
        if(res){
            history.push(`/admin/store/${res.data.store.id}`);
            SnackbarUtils.success("Tạo cửa hàng thành công")
        }
    } catch (error) {
        SnackbarUtils.error(getMessageError(error));
    }
  }
  return (
    <Fragment>
      <HeaderAction
        title={"Thêm mới cửa hàng"}
        linkTo={"/admin/stores"}
        groupAction={
          <Fragment>
            <Button
              variant="outlined"
              color="primary"
              btnType="default"
              style={{ marginLeft: 16 }}
              onClick={() => {
                history.push("/admin/stores");
              }}
              size="small"
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="primary"
              btnType="default"
              style={{ marginLeft: 16 }}
              onClick={() => {createStore()}}
              size="small"
            >
              Lưu
            </Button>
          </Fragment>
        }
      />
      <Grid xs={12} container  style={{padding: "24px 32px"}} spacing={3}>
        <Grid xs={8} item style={{ flex: "1 0 0" }}>
          <BoxStoreInfo store={store} setStore={setStore}/>
        </Grid>
        <Grid xs={4} item>
          <BoxUserInfo store={store} setStore={setStore}/>
        </Grid>
      </Grid>
    </Fragment>
  );
});

const mapStateToProps = ({ auth: { user } }: AppState) => ({
  user,
});
const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CreateStore);
