import { Box, Grid, IconButton, InputAdornment, Link, Typography, withStyles } from "@material-ui/core";
import Button from "components/Button";
import Chip from "components/Chip";
import DatePickerComponent from "components/DatePicker/DatePicker.component";
import HeaderAction from "components/HeaderAction";
import Select from "components/Select/Index";
import SearchSuggestInfinite from "components/Select/SearchSuggestInfinite";
import SelectInfinite from "components/Select/SelectInfinite";
import EyeIcon from "components/SVG/EyeIcon";
import EyeSlashIcon from "components/SVG/EyeSlashIcon";
import TextField from "components/TextField";
import moment from "moment";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import AccountService from "services/AccountService";
import { AccountRequest, RoleResponse } from "services/types";
import { MenuState } from "store/Menu/types";
import { AppState } from "store/store";
import { getMessageError } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import styles from "./CreateAccount.styles";
import { AccountRole, CreateAccountProps, LocationResponse } from "./CreateAccount.types";


const CreateAccount = (props: CreateAccountProps) => {
  const { authState, classes } = props;

  const history = useHistory();
  const [accountNew, setAccountNew] = useState<AccountRequest>();
  const [passwordType, setPasswordType] = useState<boolean>(true);
  const [freeLocations, setFreeLocations] = useState<LocationResponse[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [accountRoles, setAccountRoles] = useState<AccountRole[]>(
    [{
      id: 1,
      locationIds: [],
      roleId: 0,
    }])

    const onAddMoreTenantRole = () => {
      setAccountRoles((prevState) => {
        const minValue = Math.min(...prevState.map((p) => p.id));
  
        prevState.push({
          id: minValue > 0 ? 0 : minValue - 1,
          roleId: 0
        });
        return [...prevState];
      });
    };
  useEffect(() => {
    document.title = "Thêm mới nhân viên";
  }, []);
  const onExitAccountDetailPage = () => {
    history.push("/admin/settings/accounts/");
  };
  const createAccount = async () => {
    try {
      if (accountNew) {
        if (!accountNew.fullName) {
          SnackbarUtils.error("Họ và tên nhân viên không được để trống!");
        }
        if (!accountNew.email) {
          SnackbarUtils.error("Email không được để trống!");
        }
        if (!accountNew.phoneNo) {
          SnackbarUtils.error("Số điện thoại không được để trống!");
        }
        if (!accountNew.password) {
          SnackbarUtils.error("Mật khẩu không được để trống!");
        }
        let id = accountRoles.map((item) => {
          if(item.id !== 0) return item.id;
          else return 0;
        })
        let account: AccountRequest = {
          ...accountNew,
          username: accountNew.email,
          roleIds: id.filter((item) => item !== 0) || undefined
        }
        if (account) {
          const res = await AccountService.create(account);
          if (res.data) {
            history.push("/admin/accounts");
            SnackbarUtils.success("Tạo người dùng thành công");
          }
        }
      }
    } catch (e) {
      SnackbarUtils.error(getMessageError(e));
    }
  }
  const fetchDataLocation = async () => {
    let res = await AccountService.filterLocations();
    setLocations(res.data.list_locations.locations);
  }
  useEffect(() => {
    fetchDataLocation();
  }, [])


  return <>
    <HeaderAction
      title={"Thêm mới nhân viên"}
      linkTo={"/admin/accounts"}
      groupAction={
        <Fragment>
          <Button
            variant="outlined"
            color="primary"
            btnType="default"
            style={{ marginLeft: 16 }}
            onClick={onExitAccountDetailPage}
            size="small"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            btnType="default"
            style={{ marginLeft: 16 }}
            onClick={() => { createAccount() }}
            size="small"
          >
            Lưu
          </Button>
        </Fragment>
      }
    />
    <Box className={classes.container}>
      <Box className={classes.accountInformationBox}>
        <Box className={classes.headerInformationBox}>
          <Typography style={{ fontWeight: 500 }}>
            Thông tin nhân viên
          </Typography>
        </Box>
        <Box className={classes.detailInformationBox}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <TextField
                name="fullName"
                type="text"
                label="Họ và tên nhân viên"
                required
                fullWidth
                value={accountNew?.fullName || ""}
                onChange={(event: any) => {
                  setAccountNew({ ...accountNew, fullName: event.target.value });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="phonenumber"
                type="text"
                label="Số điện thoại"
                required
                fullWidth
                value={accountNew?.phoneNo || ""}
                onChange={(event: any) => {
                  const re = /^[0-9\b]+$/;
                  if (event.target.value === "" || re.test(event.target.value)) {
                    setAccountNew({ ...accountNew, phoneNo: event.target.value });
                  }
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <DatePickerComponent
                appendDefaultOnClick
                textFieldProps={{
                  fullWidth: true,
                  placeholder: "",
                  name: "dob",
                }}
                label="Ngày sinh"
                value={accountNew?.dob}
                autoComplete={"off"}
                onChange={(date) => {
                  setAccountNew({ ...accountNew, dob: date && moment(date).add(7, "hours").toDate() });
                }}
                selectMonth
                defaultValue={new Date()}
                maxDate={new Date()}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="email"
                type="text"
                label="Email đăng nhập"
                required
                fullWidth
                value={accountNew?.email}
                onChange={(event: any) => {
                  setAccountNew({ ...accountNew, email: event.target.value });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="password"
                // trigger change type
                label="Mật khẩu đăng nhập"
                required
                fullWidth
                type={passwordType ? "password" : "text"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        tabIndex={-1}
                        onClick={() => {
                          setPasswordType(!passwordType);
                        }}
                      >
                        {passwordType ? <EyeSlashIcon /> : <EyeIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                value={accountNew?.password || ""}
                onChange={(event: any) => {
                  setAccountNew({ ...accountNew, password: event.target.value });
                }}
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="address"
                type="text"
                label="Địa chỉ"
                fullWidth
                value={accountNew?.address || ""}
                onChange={(event: any) => {
                  setAccountNew({ ...accountNew, address: event.target.value });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="description"
                type="text"
                label="Ghi chú"
                fullWidth
                value={accountNew?.description || ""}
                onChange={(event: any) => {
                  setAccountNew({ ...accountNew, description: event.target.value });
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box className={classes.roleInformationBox}>
        <Box className={classes.headerInformationBox}>
          <Typography style={{ fontWeight: 500 }}>{"Vai trò nhân viên"}</Typography>
        </Box>
        <Box className={classes.detailInformationBox}>
          <Grid container spacing={3}>
            {accountRoles.map((accountTenantRole, index) => {
              const onDeleteAccountTenantRole = () => {
                setAccountRoles((prev) => {
                  return prev.filter((atl) => atl.id !== accountTenantRole.id);
                });
              };

              const onSelectTenantRole = (data: any) => {
                setAccountRoles((prevState) => {
                  const thisAccountTenantRole = prevState.find(
                    (atr) => atr.roleId === accountTenantRole.roleId
                  );
                  if (thisAccountTenantRole) {
                    thisAccountTenantRole.roleId = data.id;
                  }
                  return [...prevState];
                });
              };
              return (
                <Fragment key={"accountTenantRole" + index}>
                  <Grid key={accountTenantRole.roleId + "role"} item xs={5}>
                    <SearchSuggestInfinite
                      type="select-search"
                      label={index === 0 ? "Vai trò" : undefined}
                      value={{ id: accountTenantRole.roleId } || { id: null }}
                      getOptionLabel={(option) => option?.name}
                      uniqKey="id"
                      placement="bottom"
                      //disabled={account?.account_owner}
                      limit={100}
                      handleClickCreatable={() => {
                        const win = window.open("/admin/settings/tenant_roles/create", "_blank");
                        if (win) {
                          win.focus();
                        }
                      }}
                      renderValueElement={
                        (optionsSelected: any) => {
                          if (!optionsSelected || !optionsSelected.id || optionsSelected.id <= 0) {
                            return (
                              <Typography style={{ color: "#A6AAAE" }}>
                                Chọn vai trò
                              </Typography>
                            );
                          }
                          const roleSelected = roles?.find((tr) => tr.id === optionsSelected.id);
                          return (
                            <>
                              <Typography>{roleSelected?.name}</Typography>
                            </>
                          );
                        }
                      }
                      placeholder="Tìm kiếm vai trò"
                      onChange={onSelectTenantRole}
                      fetchDataSource={async (filter: any) => {
                        const res = await AccountService.filterRoles();
                        setRoles(res.data.list_roles.roles);
                        return Promise.resolve({
                          data: [...res.data.list_roles.roles].splice((1 - 1) * 10, 10),
                          metaData: {
                            totalPage: Math.ceil(res.data.list_roles.roles.length / 10),
                            totalItems: res.data.list_roles.roles.length,
                          },
                        });
                      }}
                      width="100%"
                      debounce={300}
                    />
                  </Grid>
                  <Grid key={accountTenantRole.id + "location"} item xs={5}>
                    <Box className={classes.locationRoleBox}>
                      <Box className={classes.tenantRoleAction} style={{ paddingTop: index === 0 ? "20px" : "", marginTop: 20}}>
                        <Typography
                          color="textPrimary"
                          className={classes.textLink}
                          style={{ paddingLeft: accountTenantRole?.id > 0 ? "16px" : 0 }}
                          onClick={onDeleteAccountTenantRole}
                        >
                          Xóa
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Fragment>
              );
              
            })}
            <Grid item xs={6}>
                <Button variant="contained" onClick={onAddMoreTenantRole}>
                  Thêm quyền
                </Button>
              </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  </>
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
export default connect(mapStateToProps, {})(withStyles(styles)(CreateAccount));