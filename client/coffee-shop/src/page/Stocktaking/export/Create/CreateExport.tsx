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
import { useHistory } from "react-router-dom";
import Select from "components/Select/Index";
import StockUnitService from "services/StockUnitService/StockUnitService";
import { StockUnitResponse } from "services/StockUnitService";
import { CreateComboRequest } from "services/ComboService/types";
import ModalStack from "components/Modal/ModalStack";
import { VariantComboRequest } from "services/ComboService/types";
import ComboService from "services/ComboService/ComboService";
import styles from "./CreateExport.Styles";
import {
  CreateStocktakingRequest,
  StocktakingIngredientRequest,
} from "services/StocktakingService";
import StocktakingService from "services/StocktakingService/StocktakingService";
import { log } from "console";
import { render } from "react-dom";
import Switch from "components/Switch/Switch.component";
import { check } from "prettier";
import ConfirmDialog from "components/Dialog/ConfirmDialog/ConfirmDialog";
import useModal from "components/Modal/useModal";

export interface CreateReceiptProps extends WithStyles<typeof styles> {}
const CreateReceipt = (props: CreateReceiptProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const [categories, setCategories] = useState<CategoryResponse[]>();
  const [category, setCategory] = useState<
    CategoryResponse | undefined | null
  >();
  const [itemRequest, setItemRequest] = useState<ItemRequest>();
  const [receiptRequest, setReceiptRequest] =
    useState<CreateStocktakingRequest>();
  const [variants, setVariants] = useState<VariantRequest[]>([
    { id: 1, name: "", price: 0 },
  ]);
  const [ingredient, setIngredient] = useState<IngredientResponse[]>();
  const [stockUnits, setStockUnits] = useState<StockUnitResponse[]>();
  const [toltalMoeny, settoltalMoeny] = useState<number>();
  const [stocktakingIngredientRequest, setStocktakingIngredientRequest] =
    useState<StocktakingIngredientRequest[]>([]);
    const { closeModal, confirm, openModal } = useModal();

  const history = useHistory();
  const updateIngredient = (ingredient: StocktakingIngredientRequest) => {
    let datatNews = stocktakingIngredientRequest.map((v) => {
      if (v.ingredientId === ingredient.ingredientId) {
       let toltalMoeny = ingredient.ingredientMoney * ingredient.quantity
        return {
          ...ingredient,
          totalMoney:toltalMoeny,
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
              totalMoney: v.quantity*v.ingredientMoney,
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

  const handleCreateRecpit = async (status:number) => {
    if (!receiptRequest?.name) {
      SnackbarUtils.error(`Tên phiếu không được để trống!`);
      return;
    }
    if (!stocktakingIngredientRequest || stocktakingIngredientRequest.length ===0) {
      SnackbarUtils.error(`Chưa chọn phần nguyên liệu `);
      return;
    }
    let requet: CreateStocktakingRequest = {
      ...receiptRequest,
      type: "export",
      totalMoney: sumMoeny(),
      object: stocktakingIngredientRequest,
      status:status,
      payment:checked,
      description:note
    };
    try {
      let res = await StocktakingService.create(requet);
      if (res.data) {
        SnackbarUtils.success("Tạo phiếu nhập kho thành công");
        history.push(`/admin/exports`);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  };
  const sumMoeny = () => {
    let total = 0;
    if (stocktakingIngredientRequest && stocktakingIngredientRequest.length > 0) {
      stocktakingIngredientRequest.map((x) => {
        total += x.totalMoney || 0;
      });
    }
    return total;
  };
  const handleWarring = ( quantity: number,id?:number)=>{
    let ingredients=  ingredient?.filter((x)=>x.id===id);
    const data = ingredients?.reduce((t, v) => {
   const {...rest } = v;
   t = rest;
   return t;
 }, {});
 let test = data?.quantity ||0;
 let ingredientMoneys =data?.exportPrice ||0;
   if(test < quantity) {
    updateIngredient({
    ingredientId: data?.id,
     name: data?.name,
     quantity: test,
    ingredientMoney: ingredientMoneys,
    totalMoney: test*ingredientMoneys,
    })
   }
   else{
    updateIngredient({
      ingredientId: data?.id,
       name: data?.name,
       quantity:quantity ,
      ingredientMoney: ingredientMoneys,
      totalMoney: test*ingredientMoneys,
      })
   }
  }

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
                <TextField fullWidth value="Xuất hàng" disabled />
              </Grid>
            </Box>
          </Paper>
          <Paper className={classes.wrapperBoxInfo}>
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
                            setIngredient(res.data.data);
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
                            totalMoney:1000,
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
                                  handleWarring(value.target.value as number,data?.ingredientId)
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
                    <Box style={{ margin: "auto", padding: "24px",marginLeft:"680px",display:"flex" }}>
                    <Typography style={{fontWeight: 500}}>Tổng tiền:</Typography>
                    <Typography style={{fontWeight: 500}}>{formatNumberDecimal(sumMoeny())}</Typography>
                    <Typography style={{fontWeight: 500}}>đ</Typography>
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
          
          <Paper className={classes.wrapperBoxInfo} style={{display:"flex"}}>
          <Grid  item xs={8}>
            <Box className={classes.boxContentPaper}>
              <Typography style={{ fontWeight: 500 }}>Ghi chú</Typography>
              <Grid item xs={2}>
              <Box style={{ width: 600 }}>
              <TextareaAutosize
                        height={60}
                        onChange={(e: any) => {
                          setNote( e.target.value as any,
                          );
                        }}
                        value={note}
                      />
                      </Box>
              </Grid>
            </Box>
            </Grid>
          <Grid  item xs={4}>
          <Box className={classes.boxContentPaper} style={{display:"flex",marginLeft:120}}>
              <Typography style={{ fontWeight: 500 }}>Thanh toán</Typography>
              <Grid item xs={2}>
                <Switch
                checked={checked}
                onChange={handleChange}
                ></Switch>
              </Grid>
            </Box>
          </Grid>
          </Paper>
        
        </Grid>
        <Box
        style={{
          display: "flex",
          marginBottom: "100px",
          marginLeft: "871px",
          marginTop: "30px",
        }}
      >
 
        <Button variant="outlined" color="secondary"
          onClick={()=>history.push(`/admin/exports`)}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "16px" }}
          onClick={() => {
            if(!checked){
              openModal(ConfirmDialog, {
                confirmButtonText: "Xác nhận",
                message: "Bạn chưa thanh toán phiếu,bạn có muốn tiếp tục xuất kho không?",
                title: "Thanh toán phiếu xuất kho",
                cancelButtonText: "Thoát",
            }).result.then((res) => {
                if (res) {
                  handleCreateRecpit(2);;
                }
            })
          }else{
            handleCreateRecpit(2)
          }
        
        }}
        >
         Xuất kho
        </Button>
      </Box>
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
export default connect(mapStateToProps, {})(withStyles(styles)(CreateReceipt));
