import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import BoxNoDataComponent from "components/BoxNoData/BoxNoData.component";
import Button from "components/Button";
import SearchSuggest from "components/Filter/SearchSuggest";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import NumberInputTextField from "components/NumberInput/NumberInputTextField";
import Paper from "components/Paper/Paper";
import { CloseIcon, ContactCardIcon, PlusIcon } from "components/SVG";
import SelectInfinite from "components/Select/SelectInfinite/SelectInfinite";
import { DataSource } from "components/Select/types";
import TextField from "components/TextField";
import TextareaAutosize from "components/TextField/TextareaAutosize/TextareaAutosize";
import _ from "lodash";
import React, { useEffect, useState, useCallback } from "react";
import { ConnectedProps, connect } from "react-redux";
import { CategoryResponse } from "services/CategoryService";
import CategoryService from "services/CategoryService/CategoryService";
import {
  IngredientFilterRequest,
  IngredientResponse,
} from "services/IngredientsService";
import IngredientsService from "services/IngredientsService/IngredientsService";
import {
  IngredientItemRequest,
  ItemRequest,
  VariantRequest,
} from "services/ItemsService";
import { AppState } from "store/store";
import styles from "./UpdateUser.styles";
import ItemsService from "services/ItemsService/ItemsService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { getMessageError } from "utilities";
import { useHistory, useParams } from "react-router-dom";
import Select from "components/Select/Index";
import StockUnitService from "services/StockUnitService/StockUnitService";
import { StockUnitResponse } from "services/StockUnitService";
import { UserRequest, UserResponse } from "services/UsersService";
import { RoleResponse } from "services/types";
import RoleService from "services/RoleService/RoleService";
import CloseSmallIcon from "components/SVG/CloseSmallIcon";
import { AccountCircleRounded } from "@material-ui/icons";
import { RoleItem, RolePermissionGroup } from "../../../utilities/RoleGroup";
import { DialogAddRole } from "../components/DialogAddRole";
import UsersService from "services/UsersService/UsersService";
import useModal from "components/Modal/useModal";
import ConfirmDialog from "components/Dialog/ConfirmDialog/ConfirmDialog";
import { auto } from "@popperjs/core";

export interface UpdateItemProps extends WithStyles<typeof styles> {}
const UpdateUser = (props: UpdateItemProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const [roleName, setRoleName] = useState<String>();
  const [users, setUsers] = useState<UserResponse | undefined | null>();
  const [querySearchCustomer, setQuerySearchCustomer] = useState("");
  const [role, setRole] = useState<RoleResponse | undefined | null>();
  const [userRequest, setUserRequest] = useState<UserRequest>();
  const [variants, setVariants] = useState<VariantRequest[]>([
    { id: 1, name: "", price: 0 },
  ]);
  const { closeModal, confirm, openModal } = useModal();
  const [openDialogAddRole, setOpenDialogAddRole] = useState(false);
  const [openPassWord, setOpenPassWord] = useState(false);
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const handleChangeCustomer = useCallback((role: RoleResponse | null) => {
    setRole(role);
    setRoleName(role?.name);
  }, []);

  useEffect(() => {
    initUsser();
  }, []);
  const initUsser = async () => {
    let res = await UsersService.getById(id);
    if (res.data) {
      let user = res.data;
      let userRequest: UserRequest = {
        name: user.name,
        username: user.username,
        phoneNumber: user.phoneNumber,
        email: user.email,
        password: user.passWord,
      };
      setRoleName(user.role);
      setUserRequest(userRequest);
      setUsers(user);
    }
  };
  const handleCreateItem = async () => {
    if (!role?.name) {
      SnackbarUtils.error(`Tên không được để trống `);
      return;
    }

    let requet: UserRequest = {
      ...userRequest,
      roleId: role.id,
    };
    try {
      let res = await UsersService.update(requet, id);
      if (res.data) {
        SnackbarUtils.success("Cập nhập nhân viên thành công");
        history.push(`/admin/users/${res.data.id}/edit`);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  };
  const handleDeleteUser = async () => {
    try {
      let res = await UsersService.delete(id);
      if (res) {
        SnackbarUtils.success("Xoá nhân viên thành công");
        history.push(`/admin/users`);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  };

  const getDetailRoles = () => {
    if(users && users.scopes){
      let scopes = users.scopes.split(",");
      if(scopes.find((i) => i === "full")){
        return "Tất cả quyền"
      }else {
        let roles: string[] = [];
        scopes.map((sc) => {
          if(RolePermissionGroup.getName(sc) && RolePermissionGroup.getName(sc).length > 0){
            roles.push(RolePermissionGroup.getName(sc));
          }
        })
        return roles.join(" , ")
        
      }
    }
  }
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
                      value={users?.name}
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
                      value={users?.username}
                      onChange={(e: any) => {
                        setUserRequest({
                          ...userRequest,
                          username: e.target.value,
                        });
                      }}
                    />
                  </Box>
                  {openPassWord ? (
                    <Box style={{ display: "flex", marginTop: 24 }}>
                      <TextField
                        style={{ marginLeft: 12, width: 320 }}
                        label="Mật khẩu"
                        placeholder="Nhập Mật khẩu"
                        required
                        fullWidth
                        type="password"
                        value={users?.passWord}
                        onChange={(e: any) => {
                          setUserRequest({
                            ...userRequest,
                            password: e.target.value,
                          });
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
                      />
                    </Box>
                  ) : (
                    <Box style={{ marginTop: 24, marginLeft: 12 }}>
                      <Typography variant="h6" style={{ marginBottom: 12 }}>
                        Đổi mật khẩu
                      </Typography>
                      <Typography style={{ marginBottom: 12 }}>
                        Đổi mật khẩu để đăng nhập vào tài khoản {users?.name}
                      </Typography>
                      <Button
                        color="default"
                        variant="outlined"
                        onClick={() => setOpenPassWord(true)}
                      >
                        Đổi mật khẩu
                      </Button>
                    </Box>
                  )}

                  <Box style={{ display: "flex", marginTop: 24 }}>
                    <TextField
                      style={{ marginLeft: 12, width: 320 }}
                      label="Email"
                      placeholder="Nhập email"
                      required
                      fullWidth
                      type="email"
                      value={users?.email}
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
                      value={users?.phoneNumber}
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
                  style={{ padding: "8px 16px", height: roleName ? "" : 170 }}
                >
                  <Grid xs={12} style={{ padding: 0 }}>
                    {roleName ? (
                      <Box style={{ width: 330, display: "flex" }}>
                        <Grid xs={12} container>
                          <Grid xs={5} item>
                            Tên quyền
                          </Grid>
                          <Grid xs={1} item>
                            :
                          </Grid>
                          <Grid xs={6} item>
                            {roleName ? roleName : role?.name}
                          </Grid>
                          <Grid xs={5} item>
                            Chi tiết
                          </Grid>
                          <Grid xs={1} item>
                            :
                          </Grid>
                          <Grid xs={6} item>
                            {getDetailRoles()}
                          </Grid>
                        </Grid>
                        
                        <IconButton
                          style={{
                            width: 20,
                            height: 20,
                            float: "right",
                            marginRight: 10,
                            marginTop: -5,
                          }}
                          onClick={() => {
                            setRoleName("");
                            setRole(null);
                          }}
                        >
                          <CloseSmallIcon style={{ width: 10, height: 10 }} />
                        </IconButton>
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
            marginLeft: "900px",
          }}
        >
          <Button
            btnType="destruction"
            color="primary"
            variant="outlined"
            size="small"
            onClick={() => {
              openModal(ConfirmDialog, {
                confirmButtonText: "Xét nghỉ việc",
                message:
                  "Bạn có muốn Xét nghỉ việc nhân viên không? Thao tác này không thể hoàn tác",
                title: "Huỷ phiếu",
                cancelButtonText: "Thoát",
              }).result.then((res) => {
                if (res) {
                  handleDeleteUser();
                }
              });
            }}
          >
            Xét nghỉ
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
export default connect(mapStateToProps, {})(withStyles(styles)(UpdateUser));
