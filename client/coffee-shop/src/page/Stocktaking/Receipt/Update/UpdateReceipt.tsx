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
import { CloseIcon, PlusIcon } from "components/SVG";
import SelectInfinite from "components/Select/SelectInfinite/SelectInfinite";
import { DataSource } from "components/Select/types";
import TextField from "components/TextField";
import TextareaAutosize from "components/TextField/TextareaAutosize/TextareaAutosize";
import _ from "lodash";
import React, { useEffect, useState } from "react";
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
import { useHistory, useParams } from "react-router-dom";
import Select from "components/Select/Index";
import StockUnitService from "services/StockUnitService/StockUnitService";
import { StockUnitResponse } from "services/StockUnitService";
import { CreateComboRequest } from "services/ComboService/types";
import ModalStack from "components/Modal/ModalStack";
import { VariantComboRequest } from "services/ComboService/types";
import ComboService from "services/ComboService/ComboService";
import styles from "./UpdateReceipt.Styles";
import {
  CreateStocktakingRequest,
  StocktakingIngredientRequest,
  StocktakingReponse,
} from "services/StocktakingService";
import StocktakingService from "services/StocktakingService/StocktakingService";
import { log } from "console";
import { render } from "react-dom";
import Switch from "components/Switch/Switch.component";
import { check } from "prettier";
import ConfirmDialog from "components/Dialog/ConfirmDialog/ConfirmDialog";
import useModal from "components/Modal/useModal";
import { receiveMessageOnPort } from "worker_threads";
import { type } from "os";
import { StockingType } from "page/Stocktaking/utils/StocktakingContants";
import BoxStep from "../components/BoxStep";

export interface UpdateReceiptProps extends WithStyles<typeof styles> { }
const UpdateReceipt = (props: UpdateReceiptProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const [categories, setCategories] = useState<CategoryResponse[]>();
  const [receipt, setReceipt] = useState<StocktakingReponse>();
  const [itemRequest, setItemRequest] = useState<ItemRequest>();
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
  const { id } = useParams<{ id: string }>();
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
  useEffect(() => {
    initReceipt();
  }, []);
  const initReceipt = async () => {
    let res = await StocktakingService.getById(id);
    if (res.data) {
      let receipt = res.data;
      let receiptRq: CreateStocktakingRequest = {
        name: receipt.name,
        type: receipt.type,
        totalMoney: receipt.totalMoney,
        description: receipt.description,
        object: [],
        status: receipt.status,
        payment: checked,
        partner:receipt.partner
      };
      let stocktakingIngredientRequests: StocktakingIngredientRequest[] = [];
      let ojject = receipt.object.map((v) => {
        let vq: StocktakingIngredientRequest = {
          ingredientId: v.ingredientResponse.id,
          quantity: v.quantity,
          ingredientMoney: v.ingredientMoney,
          name: v.ingredientResponse.name,
          totalMoney: v.quantity * v.ingredientMoney,
          id: v.id,
        };
        stocktakingIngredientRequests.push(vq);
      });
      receiptRq.object = stocktakingIngredientRequests;
      setStocktakingIngredientRequest(stocktakingIngredientRequests);
      setReceiptRequest(receiptRq);
      setReceipt(receipt);
      {
        receipt.payment === 2 ? setChecked(true) : setChecked(false);

      }
    }
  };
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
              id: v.id
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
  const handleUpdateRecpit = async (status: number) => {
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
    let request: CreateStocktakingRequest = {
      ...receiptRequest,
      type: receipt?.type,
      totalMoney: sumMoeny(),
      object: stocktakingIngredientRequest,
      status: status,
      payment: checked,
      description: note,
    };
    try {
      let res = await StocktakingService.update(request, id);
      if (res.data) {
        SnackbarUtils.success("cập nhập phiếu thành công");
        history.push(`/admin/receipts`);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  };
  const handleDeleteReceipt = async () => {
    try {
      let res = await StocktakingService.delete(id);
      if (res) {
        SnackbarUtils.success("Xoá phiếu nhập kho thành công");
        {receipt?.type.includes("import")?history.push(`/admin/receipts`)
        :history.push(`/admin/exports`)
      }
        
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  }
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
  const renderReceipttype = (type?: string) => {
    switch (type) {
      case StockingType.IMPORT:
        return (
          StockingType.getName(type)
        );
      case StockingType.EXPORT:
        return (
          StockingType.getName(type)
        );
      default:
        return "";
    }
  };
  return (


    <>
      <Box className={classes.container}>
        {receipt?.type.includes("import") ?
          <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography variant="h6" style={{ padding: "12px 4px 26px", fontSize: 25, marginRight: 290 }}>
              Thông tin phiếu {renderReceipttype(receipt?.type)} - {receipt?.code}
            </Typography>

            <BoxStep stock={receipt} />
          </Grid>
          : <Grid item xs={12} style={{ justifyContent: "flex-end" }}>
            <Typography variant="h6" style={{ padding: "12px 4px 26px", fontSize: 25 }}>
              Thông tin phiếu {renderReceipttype(receipt?.type)} - {receipt?.code}
            </Typography>
          </Grid>
        }

        {receipt?.status && receipt.status === 1 ?
          (
            <Grid container xs={12} spacing={2}>
              <Paper className={classes.wrapperBoxInfo}>
                <Box className={classes.boxContentPaper}>
                  <Typography style={{ fontWeight: 500 }}>Loại phiếu</Typography>
                  <Grid item xs={12}>
                    <TextField fullWidth value={renderReceipttype(receipt?.type)} disabled />
                  </Grid>
                </Box>
              </Paper>
              <Paper className={classes.wrapperBoxInfo}>
                <Box className={classes.boxContentPaper}>
                  <Typography style={{ fontWeight: 500 }}>Tên phiếu</Typography>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      value={receipt.name}
                      placeholder="Nhập tên phiếu"
                      disabled
                    />
                  </Grid>
                </Box>
              </Paper>
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
                            getOptionLabel={(ingredient) =>
                              ingredient?.name || ""
                            }
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
                                id: 0,
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
                            <TableCell align="center">Giá nhập</TableCell>
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

              <Paper
                className={classes.wrapperBoxInfo}
                style={{ display: "flex" }}
              >
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
                          value={receipt.description}
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
                    <Typography style={{ fontWeight: 500 }}>
                      Thanh toán
                    </Typography>

                    <Grid item xs={2}>
                      {checked ? (
                        <Switch checked={checked} disabled></Switch>
                      ) : (
                        <Switch
                          checked={checked}
                          onChange={handleChange}
                        ></Switch>
                      )}
                    </Grid>
                  </Box>
                </Grid>
              </Paper>
            </Grid>
          ) : (
            <Grid container xs={12} spacing={2}>
              <Paper className={classes.wrapperBoxInfo}>
                <Box className={classes.boxContentPaper}>
                  <Typography style={{ fontWeight: 500 }}>Loại phiếu</Typography>
                  <Grid item xs={12}>
                    <TextField fullWidth value={renderReceipttype(receipt?.type)} disabled />
                  </Grid>
                </Box>
              </Paper>
              <Paper className={classes.wrapperBoxInfo}>
                <Box className={classes.boxContentPaper}>
                  <Typography style={{ fontWeight: 500 }}>Tên phiếu</Typography>
                  <Grid item xs={12}>
                    <TextField fullWidth value={receipt?.name} disabled />
                  </Grid>
                </Box>
              </Paper>
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
                      <Box>
                        <Table stickyHeader>
                          <TableHead>
                            <TableCell>STT</TableCell>
                            <TableCell>Tên mặt hàng </TableCell>
                            <TableCell align="center">Số lượng</TableCell>
                            <TableCell align="center">Giá nhập</TableCell>
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
                                    disabled
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
                                    disabled
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
                                    disabled
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

              <Paper
                className={classes.wrapperBoxInfo}
                style={{ display: "flex" }}
              >
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
                          value={receipt?.description}
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
                    <Typography style={{ fontWeight: 500 }}>
                      Thanh toán
                    </Typography>
                    <Grid item xs={2}>


                      <Switch checked={checked} onChange={handleChange}></Switch>
                    </Grid>
                  </Box>
                </Grid>
              </Paper>
            </Grid>
          )}
                {receipt?.type.includes("import") ?
        (
          // phiếu nhập kho 
          <Box>
            {receipt.status && receipt.status === 3 ? ("") :
              (
                <Box>
                  {receipt.status === 1 ?
                    //trường hợp phiếu nhập hàng đang đặt hàng
                    (
                      <Box
                        style={{
                          display: "flex",
                          marginBottom: "100px",
                          marginLeft: "740px",
                          marginTop: "30px",
                        }}
                      >
                        <Button variant="outlined" style={{
                          background: "linear-gradient(180deg,#ff4d4d,#ff4d4d)",
                          borderColor: "#ff4d4d",
                          boxShadow: "inset 0 1px 0 0 #ff4d4",
                          color: "#fff"
                        }}
                          onClick={() => {
                            openModal(ConfirmDialog, {
                              confirmButtonText: "Huỷ phiếu",
                              message:
                                "Bạn có muốn huỷ phiếu không? Thao tác này không thể hoàn tác",
                              title: "Huỷ phiếu nhập kho",
                              cancelButtonText: "Thoát",
                            }).result.then((res) => {
                              if (res) {
                                handleDeleteReceipt();
                              }
                            });
                          }}
                        >
                          Hủy phiếu
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          style={{ marginLeft: "16px" }}
                          onClick={() => handleUpdateRecpit(1)
                          }
                        >
                          Lưu
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
                                  "Bạn chưa thanh toán phiếu,bạn có muốn tiếp tục nhập kho không?",
                                title: "Thanh toán phiếu nhập kho",
                                cancelButtonText: "Thoát",
                              }).result.then((res) => {
                                if (res) {
                                  handleUpdateRecpit(2);
                                }
                              });
                            } else {
                              handleUpdateRecpit(2);
                            }
                          }}
                        >
                          Nhập kho
                        </Button>
                      </Box>
                    ) : (
                      //trường hợp là phiếu nhập hàng đã Nhập kho 
                      <Box
                        style={{
                          display: "flex",
                          marginBottom: "100px",
                          // marginLeft: "160px",
                          marginTop: "30px",
                          float: "right",
                          marginRight: 8
                        }}
                      >
                        <Button variant="outlined" color="secondary"
                          style={{
                            background: "linear-gradient(180deg,#ff4d4d,#ff4d4d)",
                            borderColor: "#ff4d4d",
                            boxShadow: "inset 0 1px 0 0 #ff4d4",
                            color: "#fff",
                            float: "left"
                           }}
                          onClick={() => {

                            openModal(ConfirmDialog, {
                              confirmButtonText: "Huỷ phiếu",
                              message:
                                "Bạn có muốn huỷ phiếu không? Thao tác này không thể hoàn tác",
                              title: "Huỷ phiếu nhập kho",
                              cancelButtonText: "Thoát",
                            }).result.then((res) => {
                              if (res) {
                                handleDeleteReceipt();
                              }
                            });
                          }}
                        >
                          Hủy phiếu
                        </Button>
                      </Box>
                    )}
                </Box>)}

          </Box>
        ) : (
          // Phiếu xuất
          <Box>
            
            {//Huỷ phiếu
            receipt?.status===3 ? "": 
            //Phiếu xuất kho
            <Box
            style={{
              display: "flex",
              marginBottom: "100px",
              // marginLeft: "160px",
              marginTop: "30px",
              float: "right",
              marginRight: 8
            }}
          >
            <Button variant="outlined" color="secondary" style={{
              background: "linear-gradient(180deg,#ff4d4d,#ff4d4d)",
              borderColor: "#ff4d4d",
              boxShadow: "inset 0 1px 0 0 #ff4d4",
              color: "#fff",
            }}
              onClick={() => {
                openModal(ConfirmDialog, {
                  confirmButtonText: "Huỷ phiếu",
                  message:
                    "Bạn có muốn huỷ phiếu không? Thao tác này không thể hoàn tác",
                  title: "Huỷ phiếu",
                  cancelButtonText: "Thoát",
                }).result.then((res) => {
                  if (res) {
                    handleDeleteReceipt();
                  }
                });
              }}
            >
              Hủy phiếu
            </Button>
          </Box>}
          </Box>
         
        )}
      </Box>


    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(UpdateReceipt));
 