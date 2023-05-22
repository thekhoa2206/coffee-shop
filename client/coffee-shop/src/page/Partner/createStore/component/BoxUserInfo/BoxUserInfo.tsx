import { Box, Grid, Typography } from "@material-ui/core";
import Paper from "components/Paper";
import TextField from "components/TextField";
import React from "react";
import { Fragment, memo } from "react";
import { CreateStoreRequest } from "../../CreateStore.types";
import useStyles from "./BoxUserInfo.styles";
export type BoxUserInfoProps = {
  store?: CreateStoreRequest;
  setStore: (store?: CreateStoreRequest) => void;
};
const BoxUserInfo = memo((props: BoxUserInfoProps) => {
  const classes = useStyles();
  const { store, setStore } = props;
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
                Thông tin đăng nhập
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
                  style={{ marginTop: "20px" }}
                >
                  <Grid xs={12} item>
                    <TextField
                      label="Tên chủ cửa hàng"
                      value={store ? store.account?.name : null}
                      onChange={(e: any) => {
                        setStore({ ...store, account: {...store?.account, name: e.target.value} });
                      }}
                      fullWidth
                      required
                      placeholder="Nhập tên chủ cửa hàng"
                    />
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  style={{ marginTop: "20px" }}
                >
                  <Grid xs={12} item>
                    <TextField
                      label="Email chủ cửa hàng"
                      value={store ? store.account?.email : null}
                      onChange={(e: any) => {
                        setStore({ ...store, account: {...store?.account, email: e.target.value} });
                      }}
                      fullWidth
                      required
                      placeholder="Nhập Email chủ cửa hàng"
                    />
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  style={{ marginTop: "20px" }}
                >
                  <Grid xs={12} item>
                    <TextField
                      label="SĐT chủ cửa hàng"
                      value={store ? store.account?.phoneNumber : null}
                      onChange={(e: any) => {
                        setStore({ ...store, account: {...store?.account, phoneNumber: e.target.value} });
                      }}
                      fullWidth
                      required
                      placeholder="Nhập SĐT chủ cửa hàng"
                    />
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  style={{ marginTop: "20px" }}
                >
                  <Grid xs={12} item>
                    <TextField
                      label="Mật khẩu"
                      value={store ? store.account?.password : null}
                      onChange={(e: any) => {
                        setStore({ ...store, account: {...store?.account, password: e.target.value} });
                      }}
                      fullWidth
                      required
                      type="password"
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

export default BoxUserInfo;
