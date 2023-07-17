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
import React, { useCallback, useEffect, useState } from "react";
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
  ItemFilterRequest,
  ItemRequest,
  ItemResponse,
  ItemResponses,
  VariantRequest,
  VariantResponse,
} from "services/ItemsService";
import { AppState } from "store/store";
import ItemsService from "services/ItemsService/ItemsService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { formatNumberDecimal, getMessageError } from "utilities";
import { useHistory } from "react-router-dom";
import Select from "components/Select/Index";
import StockUnitService from "services/StockUnitService/StockUnitService";
import { StockUnitResponse } from "services/StockUnitService";
import { CreateComboRequest } from "services/ComboService/types";
import ModalStack from "components/Modal/ModalStack";
import { VariantComboRequest } from "services/ComboService/types";
import ComboService from "services/ComboService/ComboService";
import styles from "./CreateReceipt.Styles";
import {
  CreateStocktakingRequest,
  StocktakingIngredientRequest,
} from "services/StocktakingService";
import StocktakingService from "services/StocktakingService/StocktakingService";
import Switch from "components/Switch/Switch.component";
import { check } from "prettier";
import ConfirmDialog from "components/Dialog/ConfirmDialog/ConfirmDialog";
import useModal from "components/Modal/useModal";
import { DialogAddCustomer } from "page/Customer/DialogAddCustomer/DialogAddCustomer";
import CloseSmallIcon from "components/SVG/CloseSmallIcon";
import { CustomerResponse } from "services/CustomerService";
import CustomerService from "services/CustomerService/CustomerService";
import { AccountCircleRounded } from "@material-ui/icons";
import { DialogAddPartner } from "../components/DialogAddPartner";

export interface CreateReceiptProps extends WithStyles<typeof styles> {}
const CreateReceipt = (props: CreateReceiptProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const [categories, setCategories] = useState<CategoryResponse[]>();
  const [category, setCategory] = useState<
    CategoryResponse | undefined | null
  >();
  const [querySearchCustomer, setQuerySearchCustomer] = useState("");
  const [partner, setPartner] = useState<CustomerResponse | undefined | null>();
  const [itemRequest, setItemRequest] = useState<ItemRequest>();
  const [openDialogEditCustomer, setOpenDialogCustomer] = useState(false);
  const [receiptRequest, setReceiptRequest] =
    useState<CreateStocktakingRequest>();
  const [variants, setVariants] = useState<VariantRequest[]>([
    { id: 1, name: "", price: 0 },
  ]);
  const [stockUnits, setStockUnits] = useState<StockUnitResponse[]>();
  const [toltalMoeny, settoltalMoeny] = useState<number>();
  const [stocktakingIngredientRequest, setStocktakingIngredientRequest] =
    useState<StocktakingIngredientRequest[]>([]);
  const { closeModal, confirm, openModal } = useModal();

  const history = useHistory();
  const updateIngredient = (ingredient: StocktakingIngredientRequest) => {
    let datatNews = stocktakingIngredientRequest.map((v) => {
      if (v.ingredientId === ingredient.ingredientId) {
        let toltalMoeny = ingredient.ingredientMoney * ingredient.quantity;
        return {
          ...ingredient,
          totalMoney: toltalMoeny,
        };
      } else return v;
    });
    setStocktakingIngredientRequest(datatNews);
    sumMoeny();
  };
  const [checked, setChecked] = React.useState(false);
  const [note, setNote] = React.useState<string>();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const handleChangeCustomer = useCallback(
    (customer: CustomerResponse | null) => {
      setPartner(customer);
    },
    []
  );
  const deleteVarinat = (ingredient: StocktakingIngredientRequest) => {
    let datatdelete = stocktakingIngredientRequest.filter(
      (v) => v.ingredientId !== ingredient.ingredientId
    );
    setStocktakingIngredientRequest(datatdelete);
    sumMoeny();
  };
  const addIngredient = (ingredient: StocktakingIngredientRequest) => {
    if (stocktakingIngredientRequest.length > 0) {
      let dataOld = stocktakingIngredientRequest.find(
        (v) => v.ingredientId === ingredient.ingredientId
      );
      if (dataOld) {
        let dataNews = stocktakingIngredientRequest?.map((v) => {
          if (v.ingredientId === ingredient.ingredientId) {
            return {
              ...v,
              quantity: v.quantity + 1,
              totalMoney: v.quantity * v.ingredientMoney,
            };
          } else return { ...(v || []), ingredient };
        });
        setStocktakingIngredientRequest(dataNews);
        sumMoeny();
      } else {
        let ingredientNews = [...stocktakingIngredientRequest, ingredient];
        setStocktakingIngredientRequest(ingredientNews);
        sumMoeny();
      }
    } else {
      let oke = [ingredient];
      setStocktakingIngredientRequest(oke);
      sumMoeny();
    }
  };

  const handleCreateRecpit = async (status: number) => {
    if (!receiptRequest?.name) {
      SnackbarUtils.error(`Tên phiếu không được để trống!`);
      return;
    }
    if (
      !stocktakingIngredientRequest ||
      stocktakingIngredientRequest.length === 0
    ) {
      SnackbarUtils.error(`Chưa chọn phần nguyên liệu `);
      return;
    }
    let requet: CreateStocktakingRequest = {
      ...receiptRequest,
      type: "import",
      totalMoney: sumMoeny(),
      object: stocktakingIngredientRequest,
      status: status,
      payment: checked,
      description: note,
      partner:partner?.name,
      createdBy:authState.user.username,
      modifiedBy:authState.user.username,
    };
    try {
      let res = await StocktakingService.create(requet);
      if (res.data) {
        SnackbarUtils.success("Tạo phiếu nhập kho thành công");
        history.push(`/admin/receipts`);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  };
  const sumMoeny = () => {
    let total = 0;
    if (
      stocktakingIngredientRequest &&
      stocktakingIngredientRequest.length > 0
    ) {
      stocktakingIngredientRequest.map((x) => {
        total += x.totalMoney || 0;
      });
    }
    return total;
  };
  return (
    <>
      <Box className={classes.container}>
        <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
          Tạo phiếu nhập
        </Typography>
        <Grid container xs={12} spacing={2}>
          <Paper className={classes.wrapperBoxInfo}>
            <Box className={classes.boxContentPaper}>
              <Typography style={{ fontWeight: 500 }}>Loại phiếu</Typography>
              <Grid item xs={12}>
                <TextField fullWidth value="Nhập hàng" disabled />
              </Grid>
            </Box>
          </Paper>
          <Box style={{ display: "flex", width: "100%" }}>
            <Paper className={classes.wrapperBoxInfo} style={{ width: "50%" }}>
              <Box className={classes.boxContentPaper}>
                <Typography style={{ fontWeight: 500 }}>Tên phiếu</Typography>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    // value={variant.name}
                    onChange={(e: any) => {
                      setReceiptRequest({
                        ...receiptRequest,
                        name: e.target.value as any,
                      });
                    }}
                    placeholder="Nhập tên phiếu"
                  />
                </Grid>
              </Box>
            </Paper>
            <Paper
              className={classes.wrapperBoxInfo}
              style={{ width: "50%", marginLeft: 20 }}
            >
              <Box className={classes.boxContentPaper}>
                <Typography style={{ fontWeight: 500 }}>Đối tác</Typography>
                <Grid xs={12} style={{ padding: 0 }}>
                  {partner ? (
                    <Box style={{ width: 330 }}>
                      <IconButton
                        style={{
                          width: 20,
                          height: 20,
                          float: "right",
                          marginRight: 10,
                        }}
                        onClick={() => {
                          setPartner(null);
                        }}
                      >
                        <CloseSmallIcon style={{width: 15, height: 15, marginTop:45, marginRight:170 }} />
                      </IconButton>
                      <Grid xs={12} container>
                        <Grid xs={6} item>
                        <Typography style={{fontSize:20, marginLeft:12}} >{partner.name}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <>
                      <SelectInfinite
                        placeholder="Tìm kiếm đối tác"
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
                        textCreate={"Thêm mới đối tác"}
                        createable
                        onClickCreate={() => {
                          setOpenDialogCustomer(true);
                        }}
                        renderOption={(option) => (
                          <Box>
                            {option.type === "partner" ? (
                              <Box>
                                <MenuItem value="" disabled>
                                <em>Đối tác</em>
                              </MenuItem>
                              <MenuItem>
                                <AccountCircleRounded className="icon" />
                                <Box>
                                  <Typography noWrap>{option.name}</Typography>
                                </Box>
                              </MenuItem>
                              </Box>
                            ) : (
                              <Box>
                                <MenuItem value="" disabled>
                                <em>Khách hàng</em>
                              </MenuItem>
                              <MenuItem>
                                <AccountCircleRounded className="icon" />
                                <Box>
                                  <Typography noWrap>{option.name}</Typography>
                                </Box>
                              </MenuItem>
                              </Box>
                            )}
                          </Box>
                        )}
                        maxHeight={300}
                      />
                      <Box style={{ textAlign: "center" }}>
                        <Typography style={{ color: "#A3A8AF", marginTop: 6 }}>
                          Chưa có thông tin đối tác
                        </Typography>
                      </Box>
                    </>
                  )}
                </Grid>
              </Box>
            </Paper>
          </Box>
          <Paper className={classes.wrapperBoxInfo}>
            <Box className={classes.boxContentPaper}>
              <Box
                style={{
                  paddingTop: "10px",
                  borderBottom: "1px solid #E8EAEB",
                }}
              >
                <Typography style={{ marginTop: "16px", fontWeight: 500 }}>
                  Thông tin danh sách nguyên liệu
                </Typography>
                <Box>
                  <Box style={{ padding: "16px 0px" }}>
                    <Box>
                      <SelectInfinite
                        getOptionLabel={(ingredient) => ingredient?.name || ""}
                        fetchDataSource={async (
                          filter: IngredientFilterRequest
                        ) => {
                          let res = await IngredientsService.filter(filter);
                          const dataSource = {} as DataSource;
                          if (res.data.data) {
                            dataSource.data = res.data.data;
                            dataSource.metaData = {
                              totalPage: Math.ceil(
                                (res.data.metadata?.total || 0) /
                                  (filter.limit || 0)
                              ),
                              totalItems: res.data.metadata?.total || 0,
                            };
                          }
                          return Promise.resolve(dataSource);
                        }}
                        onQueryChange={(filter: any) => {
                          let dataSourceFilter: IngredientFilterRequest = {
                            query: filter.query,
                            page: filter.page || 1,
                          };
                          return dataSourceFilter;
                        }}
                        renderOption={(option: IngredientResponse) => (
                          <Box
                            style={{
                              width: "100%",
                              lineHeight: "40px",
                              padding: "16px 0px",
                              cursor: "pointer",
                            }}
                          >
                            <Typography style={{ marginLeft: "16px" }}>
                              {option.name}-- số lượng còn: {option.quantity}
                            </Typography>
                          </Box>
                        )}
                        placeholder="Tìm kiếm nguyên liệu "
                        onChange={(ingredient: IngredientResponse) => {
                          addIngredient({
                            ingredientId: ingredient.id,
                            name: ingredient.name ? ingredient.name : "",
                            quantity: 1,
                            ingredientMoney: 1000,
                            totalMoney: 1000,
                          });
                        }}
                        value={null}
                        className={classes.infiniteList}
                        NoResultsComponent={() => (
                          <NoResultsComponent
                            nameObject="nguyên liệu"
                            helpText={
                              "Thử thay đổi từ khóa tìm kiếm hoặc thêm mới"
                            }
                            style={{ padding: "48px 0 84px" }}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Table stickyHeader>
                      <TableHead>
                        <TableCell>STT</TableCell>
                        <TableCell>Tên mặt hàng </TableCell>
                        <TableCell align="center">Số lượng</TableCell>
                        <TableCell align="center">Đơn Giá(VND)</TableCell>
                        <TableCell align="center">Thành tiền</TableCell>
                        <TableCell style={{ width: "50px" }}></TableCell>
                      </TableHead>
                      {stocktakingIngredientRequest &&
                        stocktakingIngredientRequest.length > 0 &&
                        stocktakingIngredientRequest.map((data, index) => (
                          <TableBody key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Typography>{data.name}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <NumberInputTextField
                                value={data.quantity}
                                onChange={(value: any) => {
                                  updateIngredient({
                                    ...data,
                                    quantity: value.target.value as number,
                                  });
                                }}
                                name={"quantity"}
                                style={{
                                  marginTop: "-15px",
                                  width: "50%",
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <NumberInputTextField
                                value={data.ingredientMoney}
                                onChange={(value: any) => {
                                  updateIngredient({
                                    ...data,
                                    ingredientMoney: value.target
                                      .value as number,
                                  });
                                }}
                                name={"ingredientMoney"}
                                style={{
                                  marginTop: "-15px",
                                  width: "50%",
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                value={data.ingredientMoney * data.quantity}
                                name={"total"}
                                disabled
                                style={{
                                  marginTop: "-15px",
                                  width: "50%",
                                }}
                              />
                            </TableCell>
                            <TableCell style={{ width: "50px" }}>
                              <IconButton
                                aria-label="close"
                                style={{ width: "20px" }}
                                onClick={() => {
                                  deleteVarinat(data);
                                }}
                              >
                                <CloseIcon
                                  style={{
                                    width: "20px",
                                    color: "rgb(149 149 149)",
                                  }}
                                />
                              </IconButton>
                            </TableCell>
                          </TableBody>
                        ))}
                    </Table>
                    <Box
                      style={{
                        margin: "auto",
                        padding: "24px",
                        marginLeft: "680px",
                        display: "flex",
                      }}
                    >
                      <Typography style={{ fontWeight: 500 }}>
                        Tổng tiền:
                      </Typography>
                      <Typography style={{ fontWeight: 500 }}>
                        {formatNumberDecimal(sumMoeny())}
                      </Typography>
                      <Typography style={{ fontWeight: 500 }}>đ</Typography>
                    </Box>
                    {!(
                      stocktakingIngredientRequest &&
                      stocktakingIngredientRequest.length > 0
                    ) && (
                      <Box style={{ margin: "auto", padding: "24px" }}>
                        <BoxNoDataComponent width="150px" />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper className={classes.wrapperBoxInfo} style={{ display: "flex" }}>
            <Grid item xs={8}>
              <Box className={classes.boxContentPaper}>
                <Typography style={{ fontWeight: 500 }}>Ghi chú</Typography>
                <Grid item xs={2}>
                  <Box style={{ width: 600 }}>
                    <TextareaAutosize
                      height={60}
                      onChange={(e: any) => {
                        setNote(e.target.value as any);
                      }}
                      value={note}
                    />
                  </Box>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                className={classes.boxContentPaper}
                style={{ display: "flex", marginLeft: 120 }}
              >
                <Typography style={{ fontWeight: 500 }}>Thanh toán</Typography>
                <Grid item xs={2}>
                  <Switch checked={checked} onChange={handleChange}></Switch>
                </Grid>
              </Box>
            </Grid>
          </Paper>
        </Grid>
        <Box>
          <Box
            style={{
              display: "flex",
              marginBottom: "100px",
              marginLeft: "657px",
              marginTop: "30px",
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => history.push(`/admin/receipts`)}
            >
              Hủy
            </Button>
            <Button
              variant="outlined"
              color="primary"
              style={{ marginLeft: "16px" }}
              onClick={() => {
                handleCreateRecpit(1);
              }}
            >
              Đặt hàng
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "16px" }}
              onClick={() => {
                if (!checked) {
                  openModal(ConfirmDialog, {
                    confirmButtonText: "Xác nhận",
                    message:
                      "Bạn chưa thanh toán phiếu,bạn có muốn tiếp tục đặt hàng và nhập kho không?",
                    title: "Thanh toán phiếu nhập kho",
                    cancelButtonText: "Thoát",
                  }).result.then((res) => {
                    if (res) {
                      handleCreateRecpit(2);
                    }
                  });
                } else {
                  handleCreateRecpit(2);
                }
              }}
            >
              Đặt hàng và Nhập kho
            </Button>
          </Box>
        </Box>
      </Box>
      <DialogAddPartner
        open={openDialogEditCustomer}
        onClose={() => setOpenDialogCustomer(false)}
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
export default connect(mapStateToProps, {})(withStyles(styles)(CreateReceipt));
