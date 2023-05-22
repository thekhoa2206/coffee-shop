import { Box, Grid, Typography } from "@material-ui/core";
import InputChoiceDistrict from "components/InputChoiceDistrict";
import InputChoiceWard from "components/InputChoiceWard";
import Paper from "components/Paper";
import TextField from "components/TextField";
import React, { useState } from "react";
import { Fragment, memo } from "react";
import {
  CityResponse,
  WardResponse,
  DistrictResponse,
} from "services/StoreService";
import { CreateStoreRequest } from "../../CreateStore.types";
import useStyles from "./BoxStoreInfo.styles";
export type BoxStoreInfoProps = {
  store?: CreateStoreRequest;
  setStore: (store?: CreateStoreRequest) => void;
};
const BoxStoreInfo = memo((props: BoxStoreInfoProps) => {
  const classes = useStyles();
  const { store, setStore } = props;
  const [city, setCity] = useState<CityResponse | null | undefined>();
  const [district, setDistrict] = useState<
    DistrictResponse | null | undefined
  >();
  const [ward, setWard] = useState<WardResponse | null | undefined>();
  return (
    <Fragment>
      <Paper
        className={classes.rootPaper}
        borderHeader={false}
        headerProps={{ height: 48 }}
      >
        <Box
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          position={"relative"}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                style={{ fontWeight: 500, fontSize: 16, paddingBottom: 5 }}
              >
                Thông tin cửa hàng
              </Typography>
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
                <Grid
                  xs={12}
                  container
                  style={{ marginTop: "10px" }}
                  spacing={3}
                >
                  <Grid xs={6} item>
                    <TextField
                      label="Tên cửa hàng"
                      value={store?.label}
                      onChange={(e: any) => {
                        setStore({ ...store, label: e.target.value });
                      }}
                      fullWidth
                      required
                      placeholder="Nhập tên cửa hàng"
                    />
                  </Grid>
                  <Grid xs={6} item>
                    <TextField
                      label="Email cửa hàng"
                      value={store?.email}
                      onChange={(e: any) => {
                        setStore({ ...store, email: e.target.value });
                      }}
                      fullWidth
                      required
                      placeholder="Nhập Email cửa hàng"
                    />
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  container
                  style={{ marginTop: "10px" }}
                  spacing={3}
                >
                  <Grid xs={6} item>
                    <TextField
                      label="SĐT cửa hàng"
                      value={store?.phoneNumber}
                      onChange={(e: any) => {
                        setStore({ ...store, phoneNumber: e.target.value });
                      }}
                      fullWidth
                      required
                      placeholder="Nhập SĐT cửa hàng"
                    />
                  </Grid>
                  <Grid xs={6} item></Grid>
                </Grid>
                <Grid
                  xs={12}
                  container
                  style={{ marginTop: "10px" }}
                  spacing={3}
                >
                  <Grid xs={12} item>
                    <TextField
                      label="Địa chỉ cửa hàng"
                      value={store?.address}
                      onChange={(e: any) => {
                        setStore({ ...store, address: e.target.value });
                      }}
                      fullWidth
                      required
                      placeholder="Nhập địa chỉ cửa hàng"
                    />
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  container
                  style={{ marginTop: "10px" }}
                  spacing={3}
                >
                  <Grid xs={6} item>
                    <Box
                      height={"40px"}
                      style={{
                        border: "1px solid #D3D5D7",
                        borderRadius: "3px",
                        padding: "0 12px",
                        background: "#D3D5D7",
                      }}
                    >
                      <Typography style={{ marginTop: "10px" }}>
                        Hà nội
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  container
                  style={{ marginTop: "10px" }}
                  spacing={3}
                >
                  <Grid xs={6} item>
                    <InputChoiceDistrict
                      cityId={1}
                      value={district}
                      onChange={(
                        value: DistrictResponse | null | undefined
                      ) => {
                        setDistrict(value);
                        setStore({ ...store, districtId: value?.id });
                      }}
                    />
                  </Grid>
                  <Grid xs={6} item>
                    <InputChoiceWard
                      value={ward}
                      districtId={district?.id}
                      onChange={(value: WardResponse | null | undefined) => {
                        setWard(value);
                        setStore({ ...store, wardId: value?.id });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Fragment>
  );
});

export default BoxStoreInfo;
