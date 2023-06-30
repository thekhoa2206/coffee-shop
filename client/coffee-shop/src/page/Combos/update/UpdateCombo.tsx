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
  ItemResponses,
  VariantRequest,
} from "services/ItemsService";
import { AppState } from "store/store";
import styles from "./UpdateCombo.styles";
import ItemsService from "services/ItemsService/ItemsService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { getMessageError } from "utilities";
import { useHistory, useParams } from "react-router-dom";
import Select from "components/Select/Index";
import StockUnitService from "services/StockUnitService/StockUnitService";
import { StockUnitResponse } from "services/StockUnitService";
import ComboService from "services/ComboService/ComboService";
import {
  CreateComboRequest,
  VariantComboRequest,
} from "services/ComboService/types";
import Image from "components/Image";
import AvatarDefaultIcon from "components/SVG/AvatarDefaultIcon";
import { useDropzone } from "react-dropzone";
export interface UpdateComboProps extends WithStyles<typeof styles> { }
const UpdateCombo = (props: UpdateComboProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const [categories, setCategories] = useState<CategoryResponse[]>();
  const [category, setCategory] = useState<
    CategoryResponse | undefined | null
  >();
  const [comboRequest, setComboRequest] = useState<CreateComboRequest>();
  const [variants, setVariants] = useState<VariantRequest[]>([
    { id: 1, name: "", price: 0 },
  ]);
  const [variantComboRequest, setVariantComboRequest] = useState<VariantComboRequest[]>([]);
  const [stockUnits, setStockUnits] = useState<StockUnitResponse[]>();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileImport, setFileImport] = React.useState<File[] | null>();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (fileImport) {
        if (acceptedFiles.length > 0) {
          acceptedFiles.map((item) => {
            setImageUrl(URL.createObjectURL(item))
            fileImport.push(item);
          })
        }
      } else {
        setFileImport(acceptedFiles);
        acceptedFiles.map((item) => {
          setImageUrl(URL.createObjectURL(item))
        })
      }
    },
  });
  const handleUploadFile = () => {
    if (fileImport) {
      if (fileImport.length === 0) {
        SnackbarUtils.error("File upload không được để trống!");
        return;
      }
      const data = new FormData();
      fileImport?.map((item) => {
        data.append("files", item);

      });
      try {
        ItemsService.uploadImg(data)
          .then((res) => {
            setFileImport(undefined)
            setImageUrl(`http://localhost:8888/api/item/image/view/${res.data.id}`)
          })
          .catch((e) => {
            SnackbarUtils.error(getMessageError(e));
          });
      } catch (error) {
        SnackbarUtils.error(getMessageError(error));
      }
    }
  }
  useEffect(() => {
    initCategory();
  }, []);
  const initCategory = async () => {
    let res = await CategoryService.filter();
    if (res.data) {
      setCategories(res.data.data);
    }
  };
  useEffect(() => {
    initCombo();
  }, []);
  const initCombo = async () => {
    let res = await ComboService.getById(id);
    if (res.data) {
      let combo = res.data;
      let comboRq: CreateComboRequest = {
        name: combo.name,
        imageUrl: combo.imageUrl,
        description: combo.description,
        discountPercentage: combo.discountPercentage,
        price: combo.price,
        categoryId: 0,
        varianIds: [],
      }
      let variantComboRequests: VariantComboRequest[] = [];
      combo.items?.map((v) => {
        v.item?.variants.map((x) => {
          let vq: VariantComboRequest = {
            variantId: x.id,
            quantity: v.quantity ? v.quantity : 0,
            price: x.price,
            name: v.item?.name + "-" + x.name,
            comboitemId: v.comboitemId ? v.comboitemId : 0
          };
          variantComboRequests.push(vq);
        });
      });

      comboRq.varianIds = variantComboRequests;
      setCategory(combo.category);
      setComboRequest(comboRq)
      setVariantComboRequest(variantComboRequests);

    }
  };
  useEffect(() => {
    initUnit();
  }, []);
  const initUnit = async () => {
    let res = await StockUnitService.filter();
    if (res.data) {
      setStockUnits(res.data.data);
    }
  };
  const deleteVarinat = (variant: VariantComboRequest) => {
    let variantsNew = variantComboRequest.filter(
      (v) => v.variantId !== variant.variantId
    );
    setVariantComboRequest(variantsNew);
  };

  const updateVariant = (variant: VariantComboRequest) => {
    let variantNews = variantComboRequest.map((v) => {
      if (v.variantId === variant.variantId) {
        return variant;
      } else return v;
    });
    setVariantComboRequest(variantNews);
  };
  const addVariant = (variant: VariantComboRequest, item: ItemResponses) => {
    if (variantComboRequest.length > 0) {
      let variantOld = variantComboRequest.find(
        (v) => v.variantId === variant.variantId
      );
      if (variantOld) {
        let itemNews = variantComboRequest?.map((v) => {
          if (v.variantId === variant.variantId) {
            return {
              ...v,
              quantity: v.quantity + 1,
              comboitemId: v.comboitemId,
            };
          } else return { ...(v || []), variant };
        });
        setVariantComboRequest(itemNews);
      } else {
        let variantNews = [...variantComboRequest, variant];
        setVariantComboRequest(variantNews);
      }
    } else {
      let oke = [variant];
      setVariantComboRequest(oke);
    }
  };
  const handleUpdateCombo = async () => {
    handleUploadFile()
    let requet: CreateComboRequest = {
      ...comboRequest,
      categoryId: category?.id || 0,
      varianIds: variantComboRequest,
      imageUrl: imageUrl ? imageUrl : comboRequest?.imageUrl,
    };

    try {
      let res = await ComboService.update(requet, id);
      if (res.data) {
        SnackbarUtils.success("Cập nhật combo thành công");
        history.push(`/admin/combos/${res.data.id}`);
      }
    } catch (error) {
      SnackbarUtils.error(getMessageError(error));
    }
  };
  return (
    <>
      <Box className={classes.container}>
        <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
          Thông tin combo
        </Typography>
        <Grid container xs={12} spacing={2}>
          <Grid item xs={8}>
            <Paper className={classes.wrapperBoxInfo}>
              <Box className={classes.boxContentPaper}>
                <Typography style={{ fontWeight: 500 }}>Tên combo</Typography>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={comboRequest?.name}
                    onChange={(e: any) => {
                      setComboRequest({
                        ...comboRequest,
                        name: e.target.value as any,
                      });
                    }}
                    placeholder="Nhập tên combo"
                  />
                </Grid>
              </Box>
            </Paper>
            <Paper className={classes.wrapperBoxInfo}>
              <Box className={classes.boxContentPaper}>
                <Typography style={{ fontWeight: 500, marginBottom: 15 }}>
                  Thiết lập combo
                </Typography>
                <Grid item xs={12}>
                  <NumberInputTextField
                    fullWidth
                    placeholder="0đ"
                    onChange={(e: any) => {
                      setComboRequest({
                        ...comboRequest,
                        price: e.target.value as number,
                      });
                    }}
                    name={""}
                    label={"Giá combo "}
                    value={comboRequest?.price}
                  />
                </Grid>
                <Box
                  style={{
                    paddingTop: "10px",
                    borderBottom: "1px solid #E8EAEB",
                  }}
                >
                  <Typography style={{ marginTop: "16px", fontWeight: 500 }}>
                    Thông tin danh sách mặt hàng
                  </Typography>
                  <Box>
                    <Box style={{ padding: "16px 0px" }}>
                      <Box>
                        <SelectInfinite
                          getOptionLabel={(item) => item?.name || ""}
                          fetchDataSource={async (
                            filter: ItemFilterRequest
                          ) => {
                            let res = await ItemsService.filter(filter);
                            const dataSource = {} as DataSource;
                            if (res.data.data) {
                              dataSource.data = res.data.data.reduce(
                                (aray, obj) => {
                                  const dataVarian = obj.variants.map(
                                    (x: any) => ({
                                      id: obj.id,
                                      name: obj.name,
                                      image: obj.imageUrl,
                                      status: obj.status,
                                      variants: x,
                                      quantity: 1,
                                    })
                                  );
                                  aray = aray.concat(dataVarian as any);
                                  return aray;
                                },
                                []
                              );
                              console.log("test", dataSource.data);
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
                            let dataSourceFilter: ItemFilterRequest = {
                              query: filter.query,
                              page: filter.page || 1,
                            };
                            return dataSourceFilter;
                          }}
                          renderOption={(option: ItemResponses) => (
                            <Box
                              style={{
                                width: "100%",
                                lineHeight: "40px",
                                padding: "16px 0px",
                                cursor: "pointer",
                              }}
                            >
                              <Typography style={{ marginLeft: "16px" }}>
                                {option.name}-{option.variants.name} - giá:{" "}
                                {option.variants.price}
                              </Typography>
                            </Box>
                          )}
                          placeholder="Tìm kiếm mặt hàng"
                          onChange={(item: ItemResponses) => {
                            addVariant(
                              {
                                variantId: item.variants.id,
                                quantity: 1,
                                price: item.variants.price,
                                name: item.name + "-" + item.variants.name,
                                comboitemId: 0
                              },
                              item
                            );
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
                          <TableCell align="center">Giá</TableCell>
                          <TableCell style={{ width: "50px" }}></TableCell>
                        </TableHead>
                        {variantComboRequest &&
                          variantComboRequest.length > 0 &&
                          variantComboRequest.map(
                            (item, index) => (
                              console.log("oke", item),
                              (
                                <TableBody key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>
                                    <Typography>{item.name}</Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <NumberInputTextField
                                      value={item.quantity}
                                      onChange={(value: any) => {
                                        updateVariant({
                                          ...item,
                                          quantity: value.target
                                            .value as number,
                                        });
                                      }}
                                      name={"quantity"}
                                      style={{
                                        marginTop: "-15px",
                                        width: "50%",
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography>{item.price}</Typography>
                                  </TableCell>
                                  <TableCell style={{ width: "50px" }}>
                                    <IconButton
                                      aria-label="close"
                                      style={{ width: "20px" }}
                                      onClick={() => {
                                        deleteVarinat(item);
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
                              )
                            )
                          )}
                      </Table>
                      {!(
                        variantComboRequest && variantComboRequest.length > 0
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
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.wrapperBoxInfo}>
              <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                Tùy chọn Combo
              </Typography>
              <Box
                className={classes.boxContentPaper}
                style={{ height: "350px" }}
              >
                <Grid xs={12}>
                  <NumberInputTextField
                    label="Giảm giá mặt hàng"
                    placeholder="Nhập giá trị giảm giá"
                    style={{ marginTop: "16px" }}
                    onChange={(e) => { }}
                    fullWidth
                    name={"discount"}
                    value={comboRequest?.discountPercentage ?? 0}
                  />
                  <Box style={{ marginTop: "16px", width: "293px" }}>
                    <SearchSuggest
                      label="Nhóm mặt hàng"
                      // getOptionLabel={(item) => item.name}
                      type="select-search"
                      getLabelSelect={() => category?.name || ""}
                      options={categories || []}
                      getOptionLabel={(item) => item.name}
                      value={category}
                      onChange={(value) => {
                        if (value && !_.isArray(value)) {
                          setCategory(value as CategoryResponse);
                        }
                      }}
                      placeholder="Tìm kiếm"
                      placeholderSelect={category ? category.name : "Chọn nhóm mặt hàng"}
                      inputSearchClassRoot={classes.inputCategory}
                    />
                  </Box>
                  <Box style={{ width: 270, height: 60, marginTop: 16 }}>
                    <TextareaAutosize
                      label="Mô tả"
                      height={60}
                      value={comboRequest?.description}
                      onChange={(e: any) => {
                        setComboRequest({
                          ...comboRequest,
                          description: e.target.value,
                        });
                      }}
                    />
                  </Box>
                </Grid>
              </Box>
            </Paper>
            <Paper className={classes.wrapperBoxInfo}>
              <Box style={{ padding: "12px 12px" }}>
                <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                  Hình đại diện
                </Typography>
                <Box className={classes.boxContentPaper} style={{}}>

                  {imageUrl ? (
                    <Image src={imageUrl || ""} style={{ height: 290, width: 308, marginLeft: 0, marginBottom: 10 }} />
                  ) : (
                    <AvatarDefaultIcon style={{ height: 120, width: 120, marginLeft: 100, marginBottom: 40 }} />
                  )}
                </Box>
                <Box>
                  <Button variant="outlined" color="secondary" style={{ marginLeft: 35, width: 250 }}>
                    <Box {...getRootProps({ className: classes.dragDropFile })}>
                      <Typography style={{ marginLeft: 10, color: "#0088FF" }} >
                        Upload file
                      </Typography>
                    </Box>
                    <input {...getInputProps()} multiple={true} type="file" />
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Box
          style={{
            display: "flex",
            marginBottom: "24px",
            marginLeft: "880px",
            marginTop: "16px",
          }}
        >
          <Button variant="outlined" color="primary" onClick={() => history.push(`/admin/combos`)}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "16px" }}
            onClick={() => {
              handleUpdateCombo();
            }}
          >
            Lưu
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
export default connect(mapStateToProps, {})(withStyles(styles)(UpdateCombo));
