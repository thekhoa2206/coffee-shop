import { Box, Grid, Typography } from "@material-ui/core";
import Button from "components/Button";
import Dialog from "components/Dialog";
import HeaderAction from "components/HeaderAction";
import InputChoiceDistrict from "components/InputChoiceDistrict";
import InputChoiceWard from "components/InputChoiceWard";
import CircularProgress from "components/Loading/CircularProgress";
import Paper from "components/Paper";
import TextField from "components/TextField";
import { isNil } from "lodash";
import React, { useEffect, useState } from "react";
import { Fragment, memo } from "react";
import { connect, ConnectedProps } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import StoreService, { DistrictRequestFilter, DistrictResponse, StoreResponse, WardResponse } from "services/StoreService";
import { AppState } from "store/store";
import { formatDateTime, formatMoney, getMessageError } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { CreateStoreRequest } from "../createStore/CreateStore.types";
import useStyles from "./DetailStore.styles";
import { DialogDeleteStoreProps, DialogUpdateStoreProps } from "./DetailStore.types";

const DetailStore = memo((props: PropsFromRedux) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [store, setStore] = useState<StoreResponse>();
  const [openDeleteStore, setOpenDeleteStore] = useState(false);
  const [openUpdateStore, setOpenUpdateStore] = useState(false);
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    initData();
  }, [id])
  const initData = async() => {
    try {
      let res = await StoreService.getStoreById(id);
      if(res) {
        setStore(res.data.store);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  }
  const GroupAction = (isBottom = false) => (
    <Fragment>
      <Button
        variant="outlined"
        color="primary"
        style={{ marginRight: 16 }}
        onClick={() => {
          window.location.href = `/admin/stores`;
        }}
      >
        Thoát
      </Button>
      <Button isLoading={loading} variant="contained" color="primary" onClick={() => { setOpenUpdateStore(true)}}>
        Sửa
      </Button>
      <Button style={{marginLeft: 20}}isLoading={loading} variant="outlined" btnType="destruction" color="primary" onClick={() => {setOpenDeleteStore(true) }}>
        Ngừng hoạt động
      </Button>
    </Fragment>
  );
  return (
    <Fragment>
      <HeaderAction
        maxWidthContent={"1366px"}
        title={"Chi tiết cửa hàng"}
        linkTo={"/admin/stores"}
        groupAction={GroupAction()}
      />
      {store ? (
        <Box className={classes.root}>
        <Box className={classes.container}>
          <Box className={classes.formOrder}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item style={{ flex: "1 0 0" }} xs={8}>
                    <Paper className={classes.rootPaper} borderHeader={false} headerProps={{ height: 48 }}>
                      <Box
                        height={"100%"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"space-between"}
                        position={"relative"}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography style={{ fontWeight: 500, fontSize: 16, paddingBottom: 5 }}>Thông tin cửa hàng</Typography>
                            <hr
                              style={{
                                borderTop: "0px solid #F3F4F5",
                                marginLeft: -24,
                                marginRight: -24,
                                marginBottom: 0,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Grid xs={12} style={{ marginTop: "10px" }}>
                              <Grid xs={12} container style={{ marginTop: "10px" }}>
                                <Grid xs={2} item>
                                  <Typography style={{ fontWeight: 400 }}>Tên</Typography>
                                </Grid>
                                <Grid xs={1} item>
                                  <Typography style={{ fontWeight: 400 }}>:</Typography>
                                </Grid>
                                <Grid xs={3} item>
                                  {store?.label}
                                </Grid>
                                <Grid xs={1} item></Grid>
                                <Grid xs={2} item>
                                  <Typography style={{ fontWeight: 400 }}>Ngày tạo</Typography>
                                </Grid>
                                <Grid xs={1} item>
                                  <Typography style={{ fontWeight: 400 }}>:</Typography>
                                </Grid>
                                <Grid xs={2} item>
                                  {store?.createdOn ? formatDateTime(store?.createdOn) : "---"}
                                </Grid>
                              </Grid>
                              <Grid xs={12} container style={{ marginTop: "10px" }}>
                                <Grid xs={2} item>
                                  <Typography style={{ fontWeight: 400 }}>Email:</Typography>
                                </Grid>
                                <Grid xs={1} item>
                                  <Typography style={{ fontWeight: 400 }}>:</Typography>
                                </Grid>
                                <Grid xs={3} item>
                                  {store?.email}
                                </Grid>
                                <Grid xs={1} item></Grid>
                                <Grid xs={2} item>
                                  <Typography style={{ fontWeight: 400 }}>Ngày cập nhật</Typography>
                                </Grid>
                                <Grid xs={1} item>
                                  <Typography style={{ fontWeight: 400 }}>:</Typography>
                                </Grid>
                                <Grid xs={2} item>
                                  {store?.modifiedOn ? formatDateTime(store?.modifiedOn) : "---"}
                                </Grid>
                              </Grid>
                              <Grid xs={12} container style={{ marginTop: "10px" }}>
                                <Grid xs={2} item>
                                  <Typography style={{ fontWeight: 400 }}>Số điện thoại:</Typography>
                                </Grid>
                                <Grid xs={1} item>
                                  <Typography style={{ fontWeight: 400 }}>:</Typography>
                                </Grid>
                                <Grid xs={3} item>
                                  {store?.phoneNumber}
                                </Grid>
                              </Grid>
                              <Grid xs={12} container style={{ marginTop: "10px" }}>
                                <Grid xs={2} item>
                                  <Typography style={{ fontWeight: 400 }}>Địa chỉ:</Typography>
                                </Grid>
                                <Grid xs={1} item>
                                  <Typography style={{ fontWeight: 400 }}>:</Typography>
                                </Grid>
                                <Grid xs={6} item>
                                  {store?.address} - {store?.wardName} - {store?.districtName} - {store?.cityName}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper className={classes.rootPaper} borderHeader={false} headerProps={{ height: 48 }}>
                      <Box
                        height={"100%"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"space-between"}
                        position={"relative"}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography style={{ fontWeight: 500, fontSize: 16, paddingBottom: 5 }}>Thông tin khác</Typography>
                            <hr
                              style={{
                                borderTop: "0px solid #F3F4F5",
                                marginLeft: -24,
                                marginRight: -24,
                                marginBottom: 0,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Grid xs={12} style={{ marginTop: "10px" }}>
                              <Grid xs={12} container style={{ marginTop: "10px" }}>
                                <Grid xs={4} item>
                                  <Typography style={{ fontWeight: 400 }}>Tổng doanh thu</Typography>
                                </Grid>
                                <Grid xs={2} item>
                                  <Typography style={{ fontWeight: 400 }}>:</Typography>
                                </Grid>
                                <Grid xs={6} item>
                                  {formatMoney(store?.totalRevenue || 0)}
                                </Grid>
                              </Grid>
                              <Grid xs={12} container style={{ marginTop: "10px" }}>
                                <Grid xs={4} item>
                                  <Typography style={{ fontWeight: 400 }}>Tổng phí</Typography>
                                </Grid>
                                <Grid xs={2} item>
                                  <Typography style={{ fontWeight: 400 }}>:</Typography>
                                </Grid>
                                <Grid xs={6} item>
                                  {formatMoney(store?.totalShipFee || 0)}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
              <Grid xs={12} item>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                      
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      ) : (
        <Box style={{margin: "auto"}}>
          <CircularProgress/>
        </Box>
      )}
      <DialogDeleteStore
            id={id}
            onClose={() => {setOpenDeleteStore(false)}}
            open={openDeleteStore}
        />
        <DialogUpdateStore
          initData={() => initData()}
          onClose={() => setOpenUpdateStore(false)}
          open={openUpdateStore}
          id={id}
          store={store}
        />
    </Fragment>
  );
});
const mapStateToProps = ({ auth: { user }, storeContext }: AppState) => ({
  user,
});
const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(DetailStore);


export const DialogDeleteStore = (props: DialogDeleteStoreProps) => {
  const { open, onClose, id } = props;
  const history = useHistory();
  const handleCancelOrder = () => {
      StoreService.delete(id)
          .then(async (res) => {
              if (res) {
                  onClose();
                  SnackbarUtils.success("Ngừng hoạt động cửa hàng thành công!");
                  history.push(`/admin/stores`);
              }
          })
          .catch((err) => {
              SnackbarUtils.error(getMessageError(err));
          });
  };
  return (
      <Fragment>
          <Dialog
              open={open}
              onClose={onClose}
              title={"Ngừng hoạt động cửa hàng"}
              onDelete={handleCancelOrder}
              textDelete={"Xóa"}
              children={
                  <>
                      <Box width="500px">
                          <Typography>
                              Bạn có chắc muốn ngừng hoạt động cửa hàng này không?.
                          </Typography>
                      </Box>
                  </>
              }
          />
      </Fragment>
  );
};


export const DialogUpdateStore = (props: DialogUpdateStoreProps) => {
  const { open, onClose, id, store, initData } = props;
  const history = useHistory();

  const [district, setDistrict] = useState<
    DistrictResponse | null | undefined
  >();
  const [ward, setWard] = useState<WardResponse | null | undefined>();
  const [storeUpdate, setStoreUpdate] = useState<CreateStoreRequest>();
  useEffect(() => {
    setStoreUpdate({
      address: store?.address,
      phoneNumber: store?.phoneNumber,
      label: store?.label,
      email: store?.email,
      districtId: store?.districtId,
      wardId: store?.id,
      cityId: 1,
    });
    fetchData();
  }, [store]);
  const fetchData = async () => {
    let fil: DistrictRequestFilter = {
      city_id: 1,
    }
    let districtRes = await StoreService.getDistricts(fil);
    let district = districtRes.data.list_district.district.find((ci) => ci.id === store?.cityId);
    setDistrict(district);
    if (district) {
      const wardsRes = await StoreService.getWards(district.id);
      let ward = wardsRes.data.list_ward.ward.find((wr) => wr.id === store?.wardId);
      if (ward)
        setWard(ward);
    }
  }
  
  const handleUpdate = () => {
    if (isNil(storeUpdate?.label)) {
      SnackbarUtils.error("Tên không được để trống!");
      return;
    }
    if (isNil(storeUpdate?.address)) {
      SnackbarUtils.error("Đia chỉ không được để trống!");
      return;
    }
    if (isNil(storeUpdate?.phoneNumber)) {
      SnackbarUtils.error("SĐT không được để trống!");
      return;
    }
    if (isNil(storeUpdate?.districtId)) {
      SnackbarUtils.error("Quận/Huyện không được để trống!");
      return;
    }
    if (isNil(storeUpdate?.wardId)) {
      SnackbarUtils.error("Phường/Xã không được để trống!");
      return;
    }
    if (storeUpdate) {
      StoreService.update(storeUpdate,id)
        .then(async (res) => {
          if (res) {
            onClose();
            if (res.data.store) {
              initData();
            }
            SnackbarUtils.success("Cập nhật thông tin cửa hàng thành công!");
          }
        })
        .catch((err) => {
          SnackbarUtils.error(getMessageError(err));
        });
    }
  };
  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        title={"Cập nhật cửa hàng"}
        onOk={handleUpdate}
        textOk={"Lưu"}
        minWidthPaper="790px"
        DialogTitleProps={{
          dividerBottom: true
        }}
        children={

          <Box padding="16px">
            <Box>
              <Grid container xs={12} spacing={2}>
                <Grid item xs={6}>
                <TextField
                    name="phonenumber"
                    type="text"
                    label="SĐT khách"
                    required
                    fullWidth
                    value={storeUpdate?.phoneNumber}
                    onChange={(event: any) => {
                      const re = /^[0-9\b]+$/;
                      if (
                        event.target.value === "" ||
                        re.test(event.target.value)
                      ) {
                        setStoreUpdate({
                          ...storeUpdate,
                          phoneNumber: event.target.value,
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="label"
                    type="text"
                    label="Tên cửa hàng"
                    required
                    fullWidth
                    value={storeUpdate?.label}
                    onChange={(event: any) => {
                      setStoreUpdate({
                        ...storeUpdate,
                        label: event.target.value,
                      });
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container xs={12} spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    type="text"
                    label="Địa chỉ"
                    fullWidth
                    value={storeUpdate?.address}
                    onChange={(event: any) => {
                      setStoreUpdate({
                        ...storeUpdate,
                        address: event.target.value,
                      });
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container xs={12} spacing={2}>
                <Grid item xs={6}>
                  <Typography style={{ marginBottom: "5px" }}>Quận/Huyện</Typography>
                  <InputChoiceDistrict
                    cityId={1}
                    value={district}
                    onChange={(value: DistrictResponse | null | undefined) => {
                      setDistrict(value);
                      setStoreUpdate({
                        ...storeUpdate,
                        districtId: value?.id,
                        wardId: 0,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography style={{ marginBottom: "5px" }}>Phường/Xã</Typography>
                  <InputChoiceWard
                    value={ward}
                    districtId={district?.id}
                    onChange={(value: WardResponse | null | undefined) => {
                      setWard(value);
                      setStoreUpdate({
                        ...storeUpdate,
                        wardId: value?.id,
                      });
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        }
      />
    </Fragment>
  );
};
