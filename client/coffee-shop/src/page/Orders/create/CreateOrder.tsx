import {
  Box,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  MenuItem,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { AccountCircleRounded } from "@material-ui/icons";
import Button from "components/Button";
import Image from "components/Image";
import InputQuantity from "components/InputQuantity/InputQuantity";
import Link from "components/Link";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import Paper from "components/Paper/Paper";
import { ContactCardIcon } from "components/SVG";
import CloseSmallIcon from "components/SVG/CloseSmallIcon";
import SelectInfinite from "components/Select/SelectInfinite/SelectInfinite";
import { DataSource } from "components/Select/types";
import TextField from "components/TextField";
import TextareaAutosize from "components/TextField/TextareaAutosize/TextareaAutosize";
import { DialogAddCustomer } from "page/Customer/DialogAddCustomer/DialogAddCustomer";
import React, { useCallback, useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { CustomerResponse } from "services/CustomerService";
import CustomerService from "services/CustomerService/CustomerService";
import { OrderItemRequest, OrderRequest } from "services/OrderService";
import OrderService from "services/OrderService/OrderService";
import { ProductFilterRequest, ProductResponse } from "services/ProductService";
import ProductService from "services/ProductService/ProductService";
import { AppState } from "store/store";
import { formatMoney, formatNumberDecimal, getMessageError } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { useOrderStore } from "../store/store";
import styles from "./CreateOrder.styles";
import { TableLineItem } from "./components/TableLineItem";
import Avatar from "react-avatar";
export interface CreateOrderProps extends WithStyles<typeof styles> {}
const CreateOrder = (props: CreateOrderProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const {
    addLineItem,
    updateLineItem,
    deleteLineItem,
    lineItems,
    code,
    note,
    set,
    customer,
    total,
    discountTotal,
    reset,
  } = useOrderStore();
  const [querySearchCustomer, setQuerySearchCustomer] = useState("");
  const [openDialogAddCustomer, setOpenDialogAddCustomer] = useState(false);
  const history = useHistory();

  const handleChangeCustomer = useCallback(
    (customer: CustomerResponse | null) => {
      set((prev) => ({ ...prev, customer: customer }));
    },
    []
  );
    useEffect(() => {
      reset();
      set((prev) => ({ ...prev, context: "create" }));
    }, [])
  const totalLineAmount = () => {
    let total = 0;
    if (lineItems && lineItems.length > 0) {
      lineItems.map((item) => {
        total += item.lineAmount || 0;
      });
    }
    return total;
  };
  useEffect(() => {
    set((prev) => ({
      ...prev,
      total: totalLineAmount() - (discountTotal || 0),
    }));
  }, [totalLineAmount, discountTotal]);

  const createOrder = async () => {
    if (!lineItems || lineItems.length === 0) {
      SnackbarUtils.error("Sản phẩm không được để trống");
      return;
    }
    if (!customer) {
      SnackbarUtils.error("Thông tin khách hàng không được để trống");
      return;
    }
    let orderLineItems: OrderItemRequest[] = [];
    let error = null;
    lineItems.forEach((i) => {
      if (i.quantity > (i.available || 0)) {
        error = "Số lượng có thể bán nhỏ hơn số lượng bán!";
      }
    });
    if (error) {
      SnackbarUtils.error(error);
      return;
    }
    lineItems.map((item) => {
      let lineItemRequest: OrderItemRequest = {
        productId: item.productId,
        combo: item.combo,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      };
      orderLineItems.push(lineItemRequest);
    });
    let requestOrder: OrderRequest = {
      customerId: customer.id || 0,
      note: note,
      discountTotal: discountTotal || 0,
      orderItemRequest: orderLineItems,
      code: code,
      total: total || 0,
    };
    try {
      let res = await OrderService.create(requestOrder);
      if (res.data) {
        SnackbarUtils.success("Tạo đơn hàng thành công!");
        history.push(`/admin/orders/${res.data.id}`);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  };
  return (
    <>
      <Box className={classes.container}>
        <Grid container xs={12} spacing={2}>
          <Grid item xs={8}>
            <Paper className={classes.wrapperBoxInfo}>
              <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                Thông tin sản phẩm
              </Typography>
              <Box className={classes.boxContentPaper}>
                <SelectInfinite
                  inputProps={{
                    id: "buttonF3",
                  }}
                  getOptionLabel={(item) => item?.name || ""}
                  fetchDataSource={async (filter: ProductFilterRequest) => {
                    let res = await ProductService.filter(filter);
                    const dataSource = {} as DataSource;
                    if (res.data.data) {
                      let products: ProductResponse[] = [];
                      res.data.data.map((item) => {
                        if (!item.combo) {
                          if (
                            item.variants != null &&
                            item.variants.length > 0
                          ) {
                            item.variants?.map((v) => {
                              let product: ProductResponse = {
                                ...item,
                                variants: [v],
                                name: `${item.name} - ${v.name}`,
                                available: v.available,
                              };
                              products.push(product);
                            });
                          }
                        } else {
                          let availables = item.variants.map(
                            (v) => v.available || 0
                          );
                          products.push({
                            ...item,
                            available: Math.min(...availables),
                          });
                        }
                      });
                      dataSource.data = products;
                      dataSource.metaData = {
                        totalPage: Math.ceil(
                          (res.data.metadata?.total || 0) / (filter.limit || 10)
                        ),
                        totalItems: res.data.metadata?.total || 0,
                      };
                    }
                    return Promise.resolve(dataSource);
                  }}
                  onQueryChange={(filter: any) => {
                    let dataSourceFilter: ProductFilterRequest = {
                      limit: 10,
                      query: filter.query,
                      page: filter.page || 1,
                      combo: true,
                    };
                    return dataSourceFilter;
                  }}
                  renderOption={(option: ProductResponse) => (
                    <Box
                      style={{
                        width: "100%",
                        lineHeight: "40px",
                        padding: "16px 0px",
                        cursor: "pointer",
                        borderBottom: "1px solid #E8EAEB",
                        display: "flex",
                      }}
                    >
                      <Box style={{ width: "10%" }}>
                        <Box style={{ marginLeft: 10 }}>
                          {option.imageUrl ? (
                            <Image src={option.imageUrl}  style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "6px"
                            }} />
                          ) : (
                            <Box
                              style={{
                                width: "40px",
                                height: "40px",
                                background: "#E8EAEB",
                                borderRadius: "6px",
                              }}
                            > <Avatar size="40" color="#B1AFAF" round="6px"  name={option.name}  maxInitials={2} /></Box>
                          )}
                        </Box>
                      </Box>
                      <Box style={{ width: "55%" }}>
                        <Typography>
                          {option.name} - {formatMoney(option.price || 0) + "đ"}
                        </Typography>
                        <Typography>
                          Tồn kho: {option.variants ? option?.available : 0}
                        </Typography>
                      </Box>
                      <Box style={{ width: "30%" }}></Box>
                    </Box>
                  )}
                  placeholder="Tìm kiếm mặt hàng"
                  onChange={(product: ProductResponse) => {
                    addLineItem(product);
                  }}
                  value={null}
                  className={classes.infiniteList}
                  NoResultsComponent={() => (
                    <NoResultsComponent
                      nameObject="mặt hàng"
                      helpText={"Thử thay đổi từ khóa tìm kiếm hoặc thêm mới"}
                      style={{ padding: "48px 0 84px" }}
                    />
                  )}
                />
              </Box>
              <TableLineItem />
            </Paper>
            <Paper className={classes.wrapperBoxInfo}>
              <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                Thông tin thanh toán
              </Typography>
              <Box className={classes.boxContentPaper}>
                <Grid container xs={12}>
                  <Grid item xs={6}>
                    <Box style={{ width: 270 }}>
                      <TextareaAutosize
                        label="Ghi chú"
                        height={60}
                        value={note || ""}
                        onChange={(e: any) => {
                          set((prev) => ({
                            ...prev,
                            note: e.target.value,
                          }));
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <ListItem className={classes.listItemRoot}>
                      <ListItemText
                        primary={
                          "Tổng tiền (" +
                          (lineItems?.length || 0) +
                          " sản phẩm)"
                        }
                      />
                      <ListItemText
                        primary={formatNumberDecimal(totalLineAmount())}
                        primaryTypographyProps={{ align: "right" }}
                      />
                    </ListItem>
                    <ListItem className={classes.listItemRoot}>
                      <ListItemText primary={"Chiết khấu"} />
                      <ListItemText
                        primary={
                          <InputQuantity
                            value={discountTotal || 0}
                            onChange={(value: any) => {
                              set((prev) => ({
                                ...prev,
                                discountTotal: value,
                              }));
                            }}
                            name={"discount"}
                            max={99999999}
                            autoHidden
                            className="input-price"
                            styleInput={{
                              textAlign: "right",
                            }}
                          />
                        }
                        style={{ marginLeft: "180px" }}
                        primaryTypographyProps={{ align: "right" }}
                      />
                    </ListItem>
                    <ListItem className={classes.listItemRoot}>
                      <ListItemText primary={"Tiền khách phải trả"} />
                      <ListItemText
                        primary={formatNumberDecimal(total)}
                        primaryTypographyProps={{ align: "right" }}
                      />
                    </ListItem>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.wrapperBoxInfo}>
              <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                Thông tin khách hàng
              </Typography>
              <Box
                className={classes.boxContentPaper}
                style={{ padding: "8px 16px", height: 170 }}
              >
                <Grid xs={12} style={{ padding: 0 }}>
                  {customer ? (
                    <Box style={{ width: 330 }}>
                      <IconButton
                        style={{
                          width: 20,
                          height: 20,
                          float: "right",
                          marginRight: 10,
                        }}
                        onClick={() => {
                          set((prev) => ({ ...prev, customer: null }));
                        }}
                      >
                        <CloseSmallIcon style={{ width: 10, height: 10 }} />
                      </IconButton>
                      <Grid xs={12} container>
                        <Grid xs={5} item>
                          Tên khách hàng
                        </Grid>
                        <Grid xs={1} item>
                          :
                        </Grid>
                        <Grid xs={6} item>
                          <Link
                            to={`/admin/customers`}
                            target="_blank"
                            style={{ fontWeight: 500 }}
                          >
                            {customer.name}
                          </Link>
                        </Grid>
                      </Grid>
                      <Grid xs={12} container>
                        <Grid xs={5} item>
                          Sđt khách hàng
                        </Grid>
                        <Grid xs={1} item>
                          :
                        </Grid>
                        <Grid xs={6} item>
                          {customer.phoneNumber}
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <>
                      <SelectInfinite
                        placeholder="Tìm kiếm khách hàng"
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
                            let res = await CustomerService.filter(filter);

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
                        textCreate={"Thêm khách hàng mới"}
                        createable
                        onClickCreate={() => {
                          setOpenDialogAddCustomer(true);
                        }}
                        renderOption={(option) => (
                          <MenuItem className={classes.customerLineItem}>
                            <AccountCircleRounded className="icon" />
                            <Box>
                              <Typography noWrap>{option.name}</Typography>
                              <Typography variant={"subtitle1"} noWrap>
                                {option.phoneNumber}
                              </Typography>
                            </Box>
                          </MenuItem>
                        )}
                        maxHeight={300}
                      />
                      <Box style={{ textAlign: "center" }}>
                        <ContactCardIcon
                          style={{ color: "#E8EAEB", fontSize: 87 }}
                        />
                        <Typography style={{ color: "#A3A8AF", marginTop: 6 }}>
                          Chưa có thông tin khách hàng
                        </Typography>
                      </Box>
                    </>
                  )}
                </Grid>
              </Box>
            </Paper>
            <Paper className={classes.wrapperBoxInfo}>
              <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                Thông tin bổ sung
              </Typography>
              <Box
                className={classes.boxContentPaper}
                style={{ padding: "16px 16px" }}
              >
                <Grid xs={12} style={{ padding: 0 }}>
                  <TextField
                    label="Mã đơn hàng"
                    placeholder="Nhập mã đơn hàng"
                    value={code}
                    fullWidth
                    onChange={(e: any) => {
                      set((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid xs={12} style={{ padding: 0 }}></Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box
        style={{
          display: "flex",
          marginBottom: "100px",
          marginLeft: "1150px",
          marginTop: "16px",
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
            createOrder();
          }}
        >
          Lưu
        </Button>
      </Box>
      <DialogAddCustomer
        open={openDialogAddCustomer}
        onClose={() => setOpenDialogAddCustomer(false)}
        initData={(customer) => {
          set((prev) => ({ ...prev, customer: customer }));
        }}
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
export default connect(mapStateToProps, {})(withStyles(styles)(CreateOrder));
