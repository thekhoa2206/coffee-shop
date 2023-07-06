import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import Button from "components/Button";
import NumberInputTextField from "components/NumberInput/NumberInputTextField";
import Paper from "components/Paper/Paper";
import { CloseIcon, ContactCardIcon, PlusIcon } from "components/SVG";
import SelectInfinite from "components/Select/SelectInfinite/SelectInfinite";
import { DataSource } from "components/Select/types";
import TextField from "components/TextField";
import _ from "lodash";
import React, { useEffect, useState, useCallback } from "react";
import { ConnectedProps, connect } from "react-redux";

import {
  VariantRequest,
} from "services/ItemsService";
import { AppState } from "store/store";
import styles from "./CreateUser.styles";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { getMessageError } from "utilities";
import { useHistory } from "react-router-dom";
import StockUnitService from "services/StockUnitService/StockUnitService";
import { StockUnitResponse } from "services/StockUnitService";
import { UserRequest } from "services/UsersService";
import { RoleResponse } from "services/types";
import RoleService from "services/RoleService/RoleService";
import CloseSmallIcon from "components/SVG/CloseSmallIcon";
import { AccountCircleRounded } from "@material-ui/icons";
import { DialogAddRole } from "../components/DialogAddRole";
import UsersService from "services/UsersService/UsersService";
import EyeIcon from "components/SVG/EyeIcon";
import EyeSlashIcon from "components/SVG/EyeSlashIcon";
import { colorPaper } from "theme/palette";
export interface CreateItemProps extends WithStyles<typeof styles> {}
const CreateUser = (props: CreateItemProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const [roles, setRoles] = useState<RoleResponse[]>();
  const [querySearchCustomer, setQuerySearchCustomer] = useState("");
  const [role, setRole] = useState<RoleResponse | undefined | null>();
  const [userRequest, setUserRequest] = useState<UserRequest>();
  const [isShow, setIsShow] = useState<boolean>(false);
  const [variants, setVariants] = useState<VariantRequest[]>([
    { id: 1, name: "", price: 0 },
  ]);
  const [openDialogAddRole, setOpenDialogAddRole] = useState(false);
  const [stockUnits, setStockUnits] = useState<StockUnitResponse[]>();
  const history = useHistory();
  useEffect(() => {
    initCategory();
  }, []);
  const initCategory = async () => {
    let res = await RoleService.filter();
    if (res.data) {
      setRoles(res.data.data);
    }
  };
  const handleChangeCustomer = useCallback((role: RoleResponse | null) => {
    setRole(role);
  }, []);

  useEffect(() => {
    initUnit();
  }, []);
  const initUnit = async () => {
    let res = await StockUnitService.filter();
    if (res.data) {
      setStockUnits(res.data.data);
    }
  };
  const handleCreateItem = async () => {

      if (!userRequest?.name) {
        SnackbarUtils.error(`Tên không được để trống `);
        return;
      }
      if (!userRequest?.username) {
        SnackbarUtils.error(`Tên đăng nhập được để trống `);
        return;
      }
      if (userRequest?.password != userRequest?.confimPassWord) {
        SnackbarUtils.error(`Mật khẩu và xác nhận mật khẩu phải nhập trùng `);
        return;
      }
      if(role?.id){
        SnackbarUtils.error(`Quyền không được để trống`);
        return;
      }

    let requet: UserRequest = {
      ...userRequest,
      roleId:role?.id
    };

    try {
      let res = await UsersService.create(requet);
      if (res.data) {
        SnackbarUtils.success("Tạo nhân viên thành công");
        history.push(`/admin/users`);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  };
  return (
    <>
      <Box className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Paper className={classes.wrapperBoxInfo}>
              <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                Thông tin Nhân viên
              </Typography>
              <Box className={classes.boxContentPaper}>
                <Grid container spacing={2}>
                  <Box style={{ display: "flex" }}>
                    <TextField
                      label="Tên nhân viên"
                      placeholder="Nhập tên nhân viên"
                      required
                      fullWidth
                      style={{ width: 320, marginLeft: 12 }}
                      value={userRequest?.name}
                      onChange={(e: any) => {
                        setUserRequest({
                          ...userRequest,
                          name: e.target.value,
                        });
                      }}
                    />
                    <TextField
                      style={{ marginLeft: 30, width: 320 }}
                      label="Tên đăng nhập"
                      placeholder="Nhập tên đăng nhập"
                      required
                      fullWidth
                      value={userRequest?.username}
                      onChange={(e: any) => {
                        setUserRequest({
                          ...userRequest,
                          username: e.target.value,
                        });
                      }}
                    />
                  </Box>
                  <Box style={{ display: "flex", marginTop: 24 }}>
                    <TextField
                      style={{ marginLeft: 12, width: 320 }}
                      label="Mật khẩu"
                      placeholder="Nhập Mật khẩu"
                      required
                      fullWidth
                      type="password"
                      value={userRequest?.password}
                      onChange={(e: any) => {
                        setUserRequest({
                          ...userRequest,
                          password: e.target.value,
                        });
                      }}
                      InputProps={{
                        endAdornment: <IconButton style={{background: colorPaper.main}} onClick={() => {setIsShow(!isShow)}}>
                          {isShow ? <EyeIcon /> : <EyeSlashIcon/>}
                        </IconButton>,
                      }}
                    />
                    <TextField
                      style={{ marginLeft: 30, width: 320 }}
                      label=" Xác nhận Mật khẩu"
                      placeholder="Nhập lại Mật khẩu"
                      required
                      fullWidth
                      type="password"
                      value={userRequest?.confimPassWord}
                      onChange={(e: any) => {
                        setUserRequest({
                          ...userRequest,
                          confimPassWord: e.target.value,
                        });
                      }}
                      InputProps={{
                        endAdornment: <IconButton style={{background: colorPaper.main}} onClick={() => {setIsShow(!isShow)}}>
                          {isShow ? <EyeIcon /> : <EyeSlashIcon/>}
                        </IconButton>,
                      }}
                    />
                  </Box>
                  <Box style={{ display: "flex", marginTop: 24 }}>
                    <TextField
                      style={{ marginLeft: 12, width: 320 }}
                      label="Email"
                      placeholder="Nhập email"
                      required
                      fullWidth
                      type="email"
                      value={userRequest?.email}
                      onChange={(e: any) => {
                        setUserRequest({
                          ...userRequest,
                          email: e.target.value,
                        });
                      }}
                    />
                    <TextField
                      style={{ marginLeft: 30, width: 320 }}
                      name={"quantity"}
                      label=" Số điện thoại "
                      placeholder="Nhập số điện thoại"
                      required
                      fullWidth
                      value={userRequest?.phoneNumber}
                      onChange={(e: any) => {
                        setUserRequest({
                          ...userRequest,
                          phoneNumber: e.target.value,
                        });
                      }}
                    />
                  </Box>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.wrapperBoxInfo}>
              <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                Quyền nhân viên
              </Typography>
              <Paper className={classes.wrapperBoxInfo}>
                <Box
                  className={classes.boxContentPaper}
                  style={{ padding: "8px 16px", height: 170 }}
                >
                  <Grid xs={12} style={{ padding: 0 }}>
                    {role ? (
                      <Box style={{ width: 330 }}>
                        <IconButton
                          style={{
                            width: 20,
                            height: 20,
                            float: "right",
                            marginRight: 10,
                          }}
                          onClick={() => {
                            setRole(null);
                          }}
                        >
                          <CloseSmallIcon style={{ width: 10, height: 10 }} />
                        </IconButton>
                        <Grid xs={12} container>
                          <Grid xs={5} item>
                            Tên quyền
                          </Grid>
                          <Grid xs={1} item>
                            :
                          </Grid>
                          <Grid xs={6} item>
                            {role?.name}
                          </Grid>
                        </Grid>
                      </Box>
                    ) : (
                      <>
                        <SelectInfinite
                          placeholder="Tìm kiếm quyền"
                          value={null}
                          onChange={handleChangeCustomer}
                          getOptionLabel={(e) => e.name}
                          fetchDataSource={async (filter: any) => {
                            let limit = 10;
                            try {
                              filter["statuses.in"] = "active";
                              filter.condition_type = "must";
                              if (
                                !filter["query.contains"] ||
                                filter["query.contains"].length === 0
                              ) {
                                delete filter["query.contains"];
                              }
                              let res = await RoleService.filter(filter);

                              let dataSource = {} as DataSource;
                              dataSource.data = res.data.data || [];
                              dataSource.metaData = {
                                totalPage: Math.ceil(
                                  (res.data.metadata?.total || 0) / limit
                                ),
                                totalItems: res.data.metadata?.total || 0,
                              };
                              return Promise.resolve(dataSource);
                            } catch (error) {}
                          }}
                          onQueryChange={(filter) => {
                            let dataSourceFilter = {} as any;
                            dataSourceFilter["query.contains"] = filter.query;
                            setQuerySearchCustomer(filter.query);
                            dataSourceFilter.page = filter.page ?? 1;
                            dataSourceFilter.limit = 10;
                            return dataSourceFilter;
                          }}
                          textCreate={"Thêm mới vai trò"}
                          createable
                          onClickCreate={() => {
                            setOpenDialogAddRole(true);
                          }}
                          renderOption={(option) => (
                            <MenuItem>
                              <AccountCircleRounded className="icon" />
                              <Box>
                                <Typography noWrap>{option.name}</Typography>
                              </Box>
                            </MenuItem>
                          )}
                          maxHeight={300}
                        />
                        <Box style={{ textAlign: "center" }}>
                          <ContactCardIcon
                            style={{ color: "#E8EAEB", fontSize: 87 }}
                          />
                          <Typography
                            style={{ color: "#A3A8AF", marginTop: 6 }}
                          >
                            Chưa có thông tin vai trò
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Grid>
                </Box>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
        <Box
        style={{
          display: "flex",
          marginLeft: "900px"
        }}
      >
        <Button variant="outlined" color="primary">
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "16px" }}
          onClick={() => {
            handleCreateItem();
          }}
        >
          Lưu
        </Button>
      </Box>
      </Box>

      <DialogAddRole
        open={openDialogAddRole}
        onClose={() => setOpenDialogAddRole(false)}
      />
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(CreateUser));
