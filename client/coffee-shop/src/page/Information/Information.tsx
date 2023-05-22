import { Box, Grid, IconButton, InputAdornment, Typography, withStyles } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { MenuState } from "store/Menu/types";
import store, { AppState } from "store/store";
import { InformationProps } from "./Information.types";
import styles from "./Information.styles";
import HeaderAction from "components/HeaderAction";
import { formatDate, formatDateTime, formatMoney, getMessageError } from "utilities";
import Button from "components/Button";
import Paper from "components/Paper";
import CircularProgress from "components/Loading/CircularProgress";
import { DialogChangePasswordProps } from "page/Account/detail/AccountDetail.types";
import { useHistory } from "react-router-dom";
import { isNil } from "lodash";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { AccountChangePassword } from "services/types";
import AccountService from "services/AccountService";
import Dialog from "components/Dialog";
import TextField from "components/TextField";
import EyeSlashIcon from "components/SVG/EyeSlashIcon";
import EyeIcon from "components/SVG/EyeIcon";


const Information = (props: InformationProps) => {
  const { menuState, classes, authState  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [openChangePassWord, setOpenChangePassWord] = useState<boolean>(false);
  const GroupAction = (isBottom = false) => (
    <Fragment>
    </Fragment>
  );
  return (
    <>
      <Fragment>
        <HeaderAction
          maxWidthContent={"1366px"}
          title={"Tổng quan"}
          linkTo={"/admin/dashboard"}
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
                                <Box style={{ display: "flex"}}>
                                  <Typography style={{ fontWeight: 500, fontSize: 16, paddingBottom: 5 }}>Thông tin cá nhân</Typography>
                                  <Button
                                  variant="text"
                                  color="primary"
                                  btnType="default"
                                  style={{ marginLeft: 550, marginTop: -10 }}
                                  onClick={() => { setOpenChangePassWord(true) }}
                                  size="small"
                                >
                                  Thay đổi mật khẩu
                                </Button>
                                </Box>
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
                                      {authState.user.fullName}
                                    </Grid>
                                    <Grid xs={1} item></Grid>
                                    <Grid xs={2} item>
                                      <Typography style={{ fontWeight: 400 }}>Ngày tạo</Typography>
                                    </Grid>
                                    <Grid xs={1} item>
                                      <Typography style={{ fontWeight: 400 }}>:</Typography>
                                    </Grid>
                                    <Grid xs={2} item>
                                      {authState.user.createdOn && formatDateTime(authState.user.createdOn)}
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
                                      {authState.user.email}
                                    </Grid>
                                    <Grid xs={1} item></Grid>
                                    <Grid xs={2} item>
                                      <Typography style={{ fontWeight: 400 }}>Ngày cập nhật</Typography>
                                    </Grid>
                                    <Grid xs={1} item>
                                      <Typography style={{ fontWeight: 400 }}>:</Typography>
                                    </Grid>
                                    <Grid xs={2} item>
                                      {authState.user.modifiedOn && formatDateTime(authState.user.modifiedOn)}
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
                                      {authState.user.phoneNo}
                                    </Grid>
                                    <Grid xs={1} item></Grid>
                                    <Grid xs={2} item>
                                      <Typography style={{ fontWeight: 400 }}>Số máy khác</Typography>
                                    </Grid>
                                    <Grid xs={1} item>
                                      <Typography style={{ fontWeight: 400 }}>:</Typography>
                                    </Grid>
                                    <Grid xs={2} item>
                                      {authState.user.mobile ? authState.user.mobile : "---"}
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
                                      {authState.user.address}
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
                                      <Typography style={{ fontWeight: 400 }}>Ngày sinh</Typography>
                                    </Grid>
                                    <Grid xs={2} item>
                                      <Typography style={{ fontWeight: 400 }}>:</Typography>
                                    </Grid>
                                    <Grid xs={6} item>
                                      {authState.user.dob ? formatDate(authState.user.dob) : "---"}
                                    </Grid>
                                  </Grid>
                                  <Grid xs={12} container style={{ marginTop: "10px" }}>
                                    <Grid xs={4} item>
                                      <Typography style={{ fontWeight: 400 }}>Giới tính</Typography>
                                    </Grid>
                                    <Grid xs={2} item>
                                      <Typography style={{ fontWeight: 400 }}>:</Typography>
                                    </Grid>
                                    <Grid xs={6} item>
                                      {authState.user.sex === "male" ? "Nam" : authState.user.sex === "female" ? "Nữ" : "---"}
                                    </Grid>
                                  </Grid>
                                  <Grid xs={12} container style={{ marginTop: "10px" }}>
                                    <Grid xs={4} item>
                                      <Typography style={{ fontWeight: 400 }}>Website</Typography>
                                    </Grid>
                                    <Grid xs={2} item>
                                      <Typography style={{ fontWeight: 400 }}>:</Typography>
                                    </Grid>
                                    <Grid xs={6} item>
                                      {authState.user.website ? authState.user.website : "---"}
                                    </Grid>
                                  </Grid>
                                  <Grid xs={12} container style={{ marginTop: "10px" }}>
                                    <Grid xs={4} item>
                                      <Typography style={{ fontWeight: 400 }}>Mô tả</Typography>
                                    </Grid>
                                    <Grid xs={2} item>
                                      <Typography style={{ fontWeight: 400 }}>:</Typography>
                                    </Grid>
                                    <Grid xs={6} item>
                                      {authState.user.description ? authState.user.description : "---"}
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
          <Box style={{ margin: "auto" }}>
            <CircularProgress />
          </Box>
        )}
      </Fragment>
      <DialogChangePassword
        id={authState.user ? String(authState.user?.id) : undefined}
        onClose={() => {
          setOpenChangePassWord(false);
        }}
        open={openChangePassWord}
        account={authState.user}
      />
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
export default connect(mapStateToProps, {})(withStyles(styles)(Information));

export const DialogChangePassword = (props: DialogChangePasswordProps) => {
  const { open, onClose, id, account } = props;
  const history = useHistory();
  const [password, setPassword] = useState<string>();
  const [passwordOld, setPasswordOld] = useState<string>();
  const [passwordType1, setPasswordType1] = useState<boolean>(true);
  const [passwordType2, setPasswordType2] = useState<boolean>(true);
  const handleUpdate = () => {
    if (isNil(password)) {
      SnackbarUtils.error("Mật khẩu không mới được để trống!");
      return;
    }
    if (isNil(passwordOld)) {
      SnackbarUtils.error("Mật khẩu không mới được để trống!");
      return;
    }
    if (password) {
      let account: AccountChangePassword = {
        password: password,
        passwordOld: passwordOld,
      };
      AccountService.changePassword(id, account)
        .then(async (res) => {
          if (res) {
            onClose();
            SnackbarUtils.success("Thay đổi mật khẩu thành công!");
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
        title={"Thay đổi mật khẩu" }
        onOk={handleUpdate}
        textOk={"Lưu"}
        minWidthPaper="600px"
        children={
          <>
          <TextField
              name="passwordOld"
              // trigger change type
              label="Mật khẩu cũ"
              required
              fullWidth
              type={passwordType1 ? "password" : "text"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={-1}
                      onClick={() => {
                        setPasswordType1(!passwordType1);
                      }}
                    >
                      {passwordType1 ? <EyeSlashIcon /> : <EyeIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              value={passwordOld || ""}
              onChange={(event: any) => {
                setPasswordOld(event.target.value);
              }}
            />
            <TextField
              style={{marginTop: 10}}
              name="passwordNew"
              // trigger change type
              label="Mật khẩu mới"
              required
              fullWidth
              type={passwordType2 ? "password" : "text"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      tabIndex={-1}
                      onClick={() => {
                        setPasswordType2(!passwordType2);
                      }}
                    >
                      {passwordType2 ? <EyeSlashIcon /> : <EyeIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              value={password || ""}
              onChange={(event: any) => {
                setPassword(event.target.value);
              }}
            />
          </>
        }
      />
    </Fragment>
  );
};