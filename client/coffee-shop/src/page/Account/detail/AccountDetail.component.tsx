import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  withStyles,
} from "@material-ui/core";
import { PaymentOutlined } from "@material-ui/icons";
import Button from "components/Button";
import Chip from "components/Chip";
import DatePickerComponent from "components/DatePicker/DatePicker.component";
import Dialog from "components/Dialog";
import HeaderAction from "components/HeaderAction";
import CircularProgress from "components/Loading/CircularProgress";
import LoadingAuth from "components/Loading/LoadingAuth";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { GridDrillDown } from "components/SapoGrid/DrillDown/GridDrillDown";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import { SapoGridToolbarProps } from "components/SapoGrid/Header/SapoGridHeader.type";
import SapoGrid from "components/SapoGrid/SapoGrid";
import {
  CellTemplateDrillDownProps,
  CellTemplateProps,
  DataResult,
  GridPageChangeEvent,
  GridSelectionChangeEvent,
} from "components/SapoGrid/SapoGrid.type";
import { GridToolbar } from "components/SapoGrid/Toolbar/GridToolbar";
import Select from "components/Select/Index";
import SearchSuggestInfinite from "components/Select/SearchSuggestInfinite";
import SelectInfinite from "components/Select/SelectInfinite";
import { OrderWaitPaymentIcon } from "components/SVG";
import EyeIcon from "components/SVG/EyeIcon";
import EyeSlashIcon from "components/SVG/EyeSlashIcon";
import TextField from "components/TextField";
import Tooltip from "components/Tooltip";
import useQueryParams from "hocs/useQueryParams";
import { isNil } from "lodash";
import moment from "moment";
import { useSnackbar } from "notistack";
import {
  getOrderQuickFilterLabel,
  getOrderShipStatusName,
  OrderQuickFilterOptions,
  OrderShipStatus,
} from "page/Order/list/OrdersFilter/OrdersQuickFilter.consant";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import AccountService from "services/AccountService";
import OrdersService, {
  OrdersFilter,
  OrdersFilterRequest,
  OrdersResponse,
} from "services/OrdersService";
import {
  AccountChangePassword,
  AccountRequest,
  AccountResponse,
  AccountUpdateRequest,
  RoleResponse,
} from "services/types";
import { MenuState } from "store/Menu/types";
import { AppState } from "store/store";
import {
  formatDate,
  formatDateUTCToLocalDateString,
  formatMoney,
  getMessageError,
} from "utilities";
import { getOrderStatusName, OrderStatus } from "utilities/OrderStatus";
import { OrderStatusHelper } from "utilities/OrderStatusHelper";
import { PaymentStatus } from "utilities/PaymentStatus";
import QueryUtils from "utilities/QueryUtils";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import {
  AccountStatus,
  getAccountStatusName,
} from "../AccountFilter/AccountQuickFilter.consant";
import styles from "./AccountDetail.styles";
import {
  AccountRole,
  AccountDetailProps,
  LocationResponse,
  DialogUpdatePaymentOrdersProps,
  DialogDeleteAccountProps,
  DialogUpdateAccountProps,
  DialogChangePasswordProps,
} from "./AccountDetail.types";
import RevenueCODShipperComponent from "./RevenueCODShipper/RevenueCODShipper.component";
import RevenueProportionSaleComponent from "./RevenueProportionSale/RevenueProportionSale.component";

const AccountDetail = (props: AccountDetailProps) => {
  const { authState, classes, menuState } = props;
  const [account, setAccount] = useState<AccountResponse>();
  const [order, setOrder] = useState<OrdersResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openPaymentConfirm, setOpenPaymentConfirm] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openChangePassWord, setOpenChangePassWord] = useState<boolean>(false);
  const [data, setData] = useState<DataResult>({
    data: [],
    total: 0,
  });
  const queryParams = useQueryParams();
  const getDefaultQuery = () => {
    // Không hiểu tại sao useQueryParams không dùng đk
    const currentFilter = props.history.location.search as string;
    const dataFromQuery: any = {};
    for (let searchFilter of currentFilter.slice(1).split("&")) {
      const data = searchFilter.split("=");
      dataFromQuery[data[0]] = decodeURIComponent(data[1]);
    }
    const initFilter: OrdersFilterRequest = {
      page: Number(dataFromQuery["page"]) || 1,
      limit: Number(dataFromQuery["limit"]) || 20,
      status: dataFromQuery["status"] || undefined,
      created_on_predefined:
        dataFromQuery["created_on_predefined"] || undefined,
      created_on_min: dataFromQuery["created_on_min"] || undefined,
      created_on_max: dataFromQuery["created_on_max"] || undefined,
    };
    return initFilter;
  };
  const [filters, setFilters] = useState<OrdersFilterRequest>({
    ...getDefaultQuery(),
  });

  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    document.title = "Chi tiết nhân viên";
  }, []);
  const onExitAccountDetailPage = () => {
    history.push("/admin/settings/accounts/");
  };

  const fetchData = async () => {
    let res = await AccountService.getById(id);
    if (res) {
      setAccount(res.data.account_response);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  const getAccountStatus = (account: any) => {
    if (!account) {
      return undefined;
    }
    let name = getAccountStatusName(account.status);
    let color = 0;
    switch (account.status) {
      case AccountStatus.INACTIVE:
        color = 2;
        break;
      case AccountStatus.ACTIVE:
        color = 1;
        break;
    }
    return { name, color };
  };
  const genStatusAccount = () => {
    const orderStatus = getAccountStatus(account);
    return orderStatus ? (
      orderStatus.color === 1 ? (
        <Chip
          variant="outlined"
          size="small"
          label={orderStatus.name}
          className="success"
        />
      ) : orderStatus.color === 2 ? (
        <Chip
          variant="outlined"
          size="small"
          label={orderStatus.name}
          className="danger"
        />
      ) : (
        <Chip size="small" label={orderStatus.name} color="default" />
      )
    ) : null;
  };
  useEffect(() => {
    initData();
    changeQueryString(filters);
  }, [filters]);
  const initData = async () => {
    const orderFilter: OrdersFilter = {
      limit: filters.limit || 20,
      page: filters.page || 1,
    };
    orderFilter.shipperId = Number(id);
    try {
      let res = await OrdersService.filter(orderFilter);
      if (res) {
        setData({
          data: res.data.list_orders.orders,
          total: res.data.list_orders.metadata?.total || 0,
        });
        setLoading(false);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  };
  const getOrderStatus = (order: any) => {
    if (!order) {
      return undefined;
    }
    let name = getOrderStatusName(order.status);
    let color = 0;
    switch (order.status) {
      case OrderStatus.CANCEL:
      case OrderStatus.PICKING_FAILED:
      case OrderStatus.DELIVERING_FAILED:
        color = 4;
        break;
      case OrderStatus.FINISH:
      case OrderStatus.FINISH:
        color = 2;
        break;
      case OrderStatus.DRAFT:
      case OrderStatus.READY_TO_PICK:
        color = 1;
        break;
      case OrderStatus.DELIVERING:
      case OrderStatus.PICKING:
        color = 3;
        break;
    }
    return { name, color };
  };
  const changeQueryString = useCallback(
    (filters: Record<string, any>) => {
      const queryString = QueryUtils.buildQueryString(filters);
      history.replace({
        search: queryString,
      });
    },
    [filters]
  );
  const handlePageChange = (e: GridPageChangeEvent) => {
    const page = e.page;
    const newParams: Record<string, any> = {
      ...Object.fromEntries(queryParams),
      page: page.page,
      limit: page.pageSize,
    };
    setFilters((prev) => ({
      ...prev,
      limit: page.pageSize || 20,
      page: page.page,
    }));
    changeQueryString(newParams);
  };

  const initAccount = (account: AccountResponse) => {
    setAccount(account);
  };
  return (
    <>
      <HeaderAction
        title={"Danh sách nhân viên"}
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
              variant="outlined"
              color="primary"
              btnType="destruction"
              style={{ marginLeft: 16 }}
              onClick={() => setOpenDelete(true)}
              size="small"
            >
              Xóa nhân viên
            </Button>
            <Button
              variant="contained"
              color="primary"
              btnType="default"
              style={{ marginLeft: 16 }}
              onClick={() => { setOpenUpdate(true) }}
              size="small"
            >
              Sửa
            </Button>
          </Fragment>
        }
      />
      <Box className={classes.container}>
        <Grid container xs={12}>
          <Grid item xs={10}></Grid>
          <Grid item xs={2}>
            <Button
              variant="text"
              color="primary"
              btnType="default"
              style={{ marginLeft: 90 }}
              onClick={() => { setOpenChangePassWord(true) }}
              size="small"
            >
              Thay đổi mật khẩu
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Box className={classes.accountInformationBox}>
                <Box className={classes.headerInformationBox}>
                  <Typography style={{ fontWeight: 500 }}>
                    Thông tin cá nhân
                  </Typography>
                  <Box height={"20px"}>{genStatusAccount()}</Box>
                </Box>
                {account ? (
                  <Box className={classes.detailInformationBox}>
                    <table style={{ width: "100%" }}>
                      <tr>
                        <td>Họ và tên: </td>
                        <td>{account.fullName}</td>
                      </tr>
                      <tr>
                        <td>Số điện thoại: </td>
                        <td>{account.phoneNo}</td>
                      </tr>
                      <tr>
                        <td>Email: </td>
                        <td>{account.email}</td>
                      </tr>
                      <tr>
                        <td>Loại nhân viên: </td>
                        <td>
                          {account.typeAccount === "ship"
                            ? "Nhân viên giao hàng"
                            : account.typeAccount === "staff"
                              ? "Nhân viên"
                              : "Đối tác"}
                        </td>
                      </tr>
                      <tr>
                        <td>Địa chỉ: </td>
                        <td>{account.address}</td>
                      </tr>
                    </table>
                  </Box>
                ) : (
                  <Box>
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Box className={classes.accountInformationBox}>
                <Box
                  className={classes.headerInformationBox}
                  style={{ display: "flex" }}
                >
                  <Typography style={{ fontWeight: 500 }}>
                    Thông tin khác
                  </Typography>
                  <Typography style={{ fontWeight: 500 }}>
                    Công nợ : {formatMoney(account?.totalDebt || 0)}
                  </Typography>
                </Box>
                {account ? (
                  <Box className={classes.detailInformationBox}>
                    <table style={{ width: "100%" }}>
                      <tr>
                        <td>Ngày sinh: </td>
                        <td>{formatDate(account.dob || new Date())}</td>
                      </tr>
                      <tr>
                        <td>Giới tính: </td>
                        <td>{account.sex === "male" ? "Nam" : "Nữ"}</td>
                      </tr>
                      <tr>
                        <td>Ghi chú: </td>
                        <td>
                          {account.description ? account.description : "---"}
                        </td>
                      </tr>
                      <tr>
                        <td>Ngày tạo: </td>
                        <td>{formatDate(account.createdOn || new Date())}</td>
                      </tr>
                      <tr>
                        <td>Ngày cập nhật mới nhất: </td>
                        <td>{formatDate(account.modifiedOn || new Date())}</td>
                      </tr>
                    </table>
                  </Box>
                ) : (
                  <Box>
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} style={{ marginTop: 20 }}>
          <Box className={classes.root} display="flex" flexWrap="wrap">
            <RevenueProportionSaleComponent account={account} id={id}/>
          </Box>
        </Grid>
        <Grid xs={12} style={{ marginTop: 20 }}>
          <Box className={classes.root} display="flex" flexWrap="wrap">
            <RevenueCODShipperComponent account={account} />
          </Box>
        </Grid>
        <Grid xs={12} style={{ marginTop: 50 }}>
          {loading ? (
            <LoadingAuth />
          ) : (
            <React.Fragment>
              {data.total > 0 ? (
                <SapoGrid
                  data={data}
                  page={filters?.page}
                  pageSize={filters?.limit}
                  onPageChange={handlePageChange}
                  stickyHeader
                  stickyHeaderTop={52}
                  onRowClick={() => { }}
                  disablePaging={false}
                  selectBy={"id"}
                  isMenuCollapse={menuState.collapse}
                >
                  <GridDrillDown>
                    {({
                      dataItem,
                      ...remainProps
                    }: CellTemplateDrillDownProps) => <></>}
                  </GridDrillDown>
                  <GridColumn
                    field="code"
                    title={getOrderQuickFilterLabel(
                      OrderQuickFilterOptions.CODE
                    )}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Link
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              history.push(`/admin/orders/${dataItem.id}`);
                            }}
                          >
                            {dataItem.code}
                          </Link>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="fee"
                    title={getOrderQuickFilterLabel(
                      OrderQuickFilterOptions.FEE
                    )}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>{formatMoney(dataItem.fee)}</Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="cod"
                    title={getOrderQuickFilterLabel(
                      OrderQuickFilterOptions.COD
                    )}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>{formatMoney(dataItem.cod)}</Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="total"
                    title={getOrderQuickFilterLabel(
                      OrderQuickFilterOptions.TOTAL
                    )}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>{formatMoney(dataItem.total)}</Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="status"
                    title={getOrderQuickFilterLabel(
                      OrderQuickFilterOptions.STATUS
                    )}
                    width={150}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      const orderStatus = getOrderStatus(dataItem);
                      return orderStatus ? (
                        orderStatus.color === 1 ? (
                          <Chip
                            variant="outlined"
                            size="small"
                            label={orderStatus.name}
                            className="info"
                          />
                        ) : orderStatus.color === 2 ? (
                          <Chip
                            variant="outlined"
                            size="small"
                            label={orderStatus.name}
                            className="success"
                          />
                        ) : orderStatus.color === 3 ? (
                          <Chip
                            variant="outlined"
                            size="small"
                            label={orderStatus.name}
                            className="warning"
                          />
                        ) : orderStatus.color === 4 ? (
                          <Chip
                            variant="outlined"
                            size="small"
                            label={orderStatus.name}
                            className="danger"
                          />
                        ) : (
                          <Chip
                            size="small"
                            label={orderStatus.name}
                            color="default"
                          />
                        )
                      ) : null;
                    }}
                  </GridColumn>
                  <GridColumn
                    field="paymentStatus"
                    align="center"
                    title={"Thanh toán"}
                    width={167}
                  >
                    {({ dataItem }: CellTemplateProps) => (
                      <Tooltip
                        arrow
                        title={PaymentStatus.getName(dataItem.paymentStatus)}
                      >
                        <Typography>
                          {OrderStatusHelper.renderStatusOrderIcon(
                            dataItem.paymentStatus
                          )}
                        </Typography>
                      </Tooltip>
                    )}
                  </GridColumn>
                  <GridColumn
                    field="createdOn"
                    title={getOrderQuickFilterLabel(
                      OrderQuickFilterOptions.CREATED_ON
                    )}
                    width={100}
                    align="center"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {dataItem.createdOn
                              ? formatDateUTCToLocalDateString(
                                dataItem.createdOn,
                                false,
                                "DD/MM/YYYY"
                              )
                              : "---"}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn field="payment" width={100} align="center">
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <IconButton
                            onClick={() => {
                              setOrder(dataItem);
                              setOpenPaymentConfirm(true);
                            }}
                          >
                            <OrderWaitPaymentIcon color="primary" />
                          </IconButton>
                        </>
                      );
                    }}
                  </GridColumn>
                </SapoGrid>
              ) : (
                <NoResultsComponent
                  message={"Không tìm thấy kết quả"}
                  helpText={"Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm"}
                />
              )}
            </React.Fragment>
          )}
        </Grid>
      </Box>
      <DialogUpdatePaymentOrders
        authState={authState}
        id={order?.id}
        initOrder={() => {
          initData();
        }}
        onClose={() => {
          setOpenPaymentConfirm(false);
        }}
        open={openPaymentConfirm}
        order={order}
      />
      <DialogDeleteAccount
        id={id}
        onClose={() => {
          setOpenDelete(false);
        }}
        open={openDelete}
      />
      <DialogUpdateAccount
        id={id}
        onClose={() => {
          setOpenUpdate(false);
        }}
        open={openUpdate}
        account={account}
        initAccount={initAccount}
      />
      <DialogChangePassword
        id={id}
        onClose={() => {
          setOpenChangePassWord(false);
        }}
        open={openChangePassWord}
        account={account}
      />
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
export default connect(mapStateToProps, {})(withStyles(styles)(AccountDetail));

export const DialogUpdatePaymentOrders = (
  props: DialogUpdatePaymentOrdersProps
) => {
  const { open, onClose, authState, id, initOrder, order } = props;
  const handleCancelOrder = () => {
    OrdersService.updatePayment(String(id))
      .then(async (res) => {
        if (res) {
          onClose();
          SnackbarUtils.success("Thanh toán đơn hàng thành công!");
          if (res) {
            initOrder();
          }
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
        title={"Thanh toán đơn hàng"}
        onOk={handleCancelOrder}
        textOk={"Xác nhận"}
        children={
          <>
            <Box width="500px">
              <Typography>
                Bạn có chắc muốn quyết toán đơn này không.
              </Typography>
            </Box>
          </>
        }
      />
    </Fragment>
  );
};

export const DialogDeleteAccount = (props: DialogDeleteAccountProps) => {
  const { open, onClose, id } = props;
  const history = useHistory();
  const handleCancelOrder = () => {
    AccountService.delete(id)
      .then(async (res) => {
        if (res) {
          onClose();
          SnackbarUtils.success("Xóa nhân viên thành công!");
          history.push(`/admin/accounts`);
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
        title={"Xóa nhân viên"}
        onOk={handleCancelOrder}
        textOk={"Xác nhận"}
        children={
          <>
            <Box width="500px">
              <Typography>
                Bạn có chắc muốn xóa nhân viên này không?.
              </Typography>
            </Box>
          </>
        }
      />
    </Fragment>
  );
};

export const DialogUpdateAccount = (props: DialogUpdateAccountProps) => {
  const { open, onClose, id, account, initAccount } = props;
  const history = useHistory();

  const [accountUpdate, setAccountUpdate] = useState<AccountUpdateRequest>();
  useEffect(() => {
    setAccountUpdate({
      address: account?.address,
      description: account?.description,
      dob: account?.dob,
      email: account?.email,
      fullName: account?.fullName,
      phoneNo: account?.phoneNo,
      sex: account?.sex,
      username: account?.username,
    })
  }, [account]);

  const handleUpdate = () => {
    if (accountUpdate) {
      accountUpdate.username = accountUpdate.email;
      AccountService.update(id, accountUpdate)
        .then(async (res) => {
          if (res) {
            onClose();
            if (res.data.account_response) {
              initAccount(res.data.account_response);
            }
            SnackbarUtils.success("Cập nhật thông tin nhân viên thành công!");
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
        title={"Cập nhật nhân viên"}
        onOk={handleUpdate}
        textOk={"Lưu"}
        minWidthPaper="700px"
        children={
          <>
            <Box>
              <Grid container xs={12} spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="fullName"
                    type="text"
                    label="Họ và tên nhân viên"
                    required
                    fullWidth
                    value={accountUpdate?.fullName}
                    onChange={(event: any) => {
                      setAccountUpdate({
                        ...accountUpdate,
                        fullName: event.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="email"
                    type="text"
                    label="Email đăng nhập"
                    required
                    fullWidth
                    value={accountUpdate?.email}
                    onChange={(event: any) => {
                      setAccountUpdate({
                        ...accountUpdate,
                        email: event.target.value,
                      });
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container xs={12} spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="phonenumber"
                    type="text"
                    label="Số điện thoại"
                    required
                    fullWidth
                    value={accountUpdate?.phoneNo}
                    onChange={(event: any) => {
                      const re = /^[0-9\b]+$/;
                      if (
                        event.target.value === "" ||
                        re.test(event.target.value)
                      ) {
                        setAccountUpdate({
                          ...accountUpdate,
                          phoneNo: event.target.value,
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="address"
                    type="text"
                    label="Địa chỉ"
                    fullWidth
                    value={accountUpdate?.address}
                    onChange={(event: any) => {
                      setAccountUpdate({
                        ...accountUpdate,
                        address: event.target.value,
                      });
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container xs={12} spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="description"
                    type="text"
                    label="Ghi chú"
                    fullWidth
                    value={accountUpdate?.description}
                    onChange={(event: any) => {
                      setAccountUpdate({
                        ...accountUpdate,
                        description: event.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePickerComponent
                    appendDefaultOnClick
                    textFieldProps={{
                      fullWidth: true,
                      placeholder: "",
                      name: "dob",
                    }}
                    label="Ngày sinh"
                    value={accountUpdate?.dob}
                    autoComplete={"off"}
                    onChange={(date) => {
                      setAccountUpdate({
                        ...accountUpdate,
                        dob: date && moment(date).add(7, "hours").toDate(),
                      });
                    }}
                    selectMonth
                    defaultValue={new Date()}
                    maxDate={new Date()}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        }
      />
    </Fragment>
  );
};

export const DialogChangePassword = (props: DialogChangePasswordProps) => {
  const { open, onClose, id, account } = props;
  const history = useHistory();
  const [password, setPassword] = useState<string>();
  const [passwordType, setPasswordType] = useState<boolean>(true);
  const handleUpdate = () => {
    if (isNil(password)) {
      SnackbarUtils.error("Mật khẩu không được để trống!");
      return;
    }
    if (password) {
      let account: AccountChangePassword = {
        password: password,
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
        title={"Thay đổi mật khẩu cho nhân viên " + account?.fullName}
        onOk={handleUpdate}
        textOk={"Lưu"}
        minWidthPaper="600px"
        children={
          <>
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
