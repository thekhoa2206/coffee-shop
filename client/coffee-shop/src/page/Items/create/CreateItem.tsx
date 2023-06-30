import { Box, Grid, IconButton, MenuItem, Table, TableBody, TableCell, TableHead, Typography, WithStyles, withStyles } from "@material-ui/core";
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
import React, { useEffect, useRef, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { CategoryResponse } from "services/CategoryService";
import CategoryService from "services/CategoryService/CategoryService";
import { IngredientFilterRequest, IngredientResponse } from "services/IngredientsService";
import IngredientsService from "services/IngredientsService/IngredientsService";
import { IngredientItemRequest, ItemRequest, VariantRequest } from "services/ItemsService";
import { AppState } from "store/store";
import styles from "./CreateItem.styles";
import ItemsService from "services/ItemsService/ItemsService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { getMessageError } from "utilities";
import { useHistory } from "react-router-dom";
import Select from "components/Select/Index";
import StockUnitService from "services/StockUnitService/StockUnitService";
import { StockUnitResponse } from "services/StockUnitService";
import AvatarDefaultIcon from "components/SVG/AvatarDefaultIcon";
import Image from "components/Image";
import { useDropzone } from "react-dropzone";
export interface CreateItemProps extends WithStyles<typeof styles> {

}
const CreateItem = (props: CreateItemProps & PropsFromRedux) => {
    const { classes, authState } = props;
    const [categories, setCategories] = useState<CategoryResponse[]>();
    const [category, setCategory] = useState<CategoryResponse | undefined | null>();
    const [itemRequest, setItemRequest] = useState<ItemRequest>();
    const [variants, setVariants] = useState<VariantRequest[]>([{ id: 1, name: "", price: 0 }]);
    const [stockUnits, setStockUnits] = useState<StockUnitResponse[]>();
    const [imageUrl, setImageUrl] = useState<string>();
    const [fileImport, setFileImport] = React.useState<File[] | null>();
    const history = useHistory();
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
                        console.log("oke", res);

                        SnackbarUtils.success("tạo ảnh thành công");
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
    }, [])
    const initCategory = async () => {
        let res = await CategoryService.filter();
        if (res.data) {
            setCategories(res.data.data)
        }
    }

    const updateIngredients = (item: IngredientItemRequest, variant: VariantRequest) => {
        let variantNews = variants.map((v) => {
            if (v.id === variant.id) {
                let ingredient = v.ingredients?.find((ig) => (ig.ingredientId === item.ingredientId));
                if (ingredient) {
                    return {

                        ...v,
                        ingredients: v.ingredients?.map((ig) => {
                            if (ig.ingredientId === item.ingredientId) {
                                return item
                            } else return ig
                        })
                    }
                } else return v;
            } else return v;
        })
        setVariants(variantNews);
    }

    const deleteIngredients = (item: IngredientItemRequest, variant: VariantRequest) => {
        let variantsNew = variants.map((v) => {
            if (v.id === variant.id) {
                return {
                    ...v,
                    ingredients: v.ingredients?.filter((i) => i.ingredientId !== item.ingredientId)
                };
            } else return v;
        })
        setVariants(variantsNew);
    }


    const addIngredients = (item: IngredientItemRequest, variant: VariantRequest) => {
        let variantNews = variants.map((v) => {
            if (v.id === variant.id) {
                let ingredient = v.ingredients?.find((ig) => (ig.ingredientId === item.ingredientId));
                if (ingredient) {
                    return {
                        ...v,
                        ingredients: v.ingredients?.map((ig) => {
                            if (ig.ingredientId === item.ingredientId) {
                                return { ...ig, amountConsume: (ig.amountConsume + 1) }
                            } else return ig
                        })
                    }
                } else return {
                    ...v,
                    ingredients: [...v.ingredients || [], item]
                }
            } else return v
        })
        setVariants(variantNews);
    }

    const addVariants = () => {
        let idMax = Math.max.apply(null, variants.map((item) => item.id));
        setVariants([...variants, { id: idMax + 1, name: "", price: 0 }])
    }

    const deleVariants = (variant: VariantRequest) => {
        setVariants([...variants.filter((v) => v.id !== variant.id)])
    }
    const updateVariants = (variant: VariantRequest) => {

        setVariants([...variants.map((v) => {
            if (v.id !== variant.id) {
                return v;
            } else {
                return variant;
            }
        })])
    }

    useEffect(() => {
        initUnit();
    }, [])
    const initUnit = async () => {
        let res = await StockUnitService.filter();
        if (res.data) {
            setStockUnits(res.data.data)
        }
    }
    const handleCreateItem = async () => {
        debugger
        handleUploadFile()
        variants.forEach((item) => {
            if (!item.name) {
                SnackbarUtils.error(`Tên phiên bản ${item.id} không được để trống!`);
                return;
            }
        })
        let requet: ItemRequest = {
            ...itemRequest,
            categoryId: category?.id || 0,
            stockUnitId: 1,
            variantRequest: variants,
        }

        try {
            let res = await ItemsService.create(requet);
            if (res.data) {
                SnackbarUtils.success("Tạo mặt hàng thành công");
                history.push(`/admin/items/${res.data.id}`)
            }
        } catch (error) {
            SnackbarUtils.error(getMessageError(error));
        }
    }
    return (
        <>
            <Box className={classes.container}>
                <Grid container xs={12} spacing={2}>
                    <Grid item xs={8}>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin nguyên liệu
                            </Typography>
                            <Box className={classes.boxContentPaper}>
                                <Typography style={{ fontWeight: 500 }}>Phiên bản</Typography>
                                <Box style={{ width: "100%", borderTop: "1px solid #E8EAEB" }}></Box>
                                {variants && variants.length > 0 && variants.map((variant, index) => (
                                    <Box key={index} style={{ paddingTop: "10px", borderBottom: "1px solid #E8EAEB" }}>
                                        <Box style={{ float: "right", height: "10px" }}>
                                            <IconButton
                                                aria-label="close" style={{ width: "26px", height: "26px", padding: "5px", borderRadius: "100%" }} onClick={() => { deleVariants(variant) }} >
                                                <CloseIcon style={{ width: "20px", color: "rgb(149 149 149)" }} />
                                            </IconButton>
                                        </Box>
                                        <Grid container xs={12} spacing={2} >
                                            <Grid item xs={5}>
                                                <TextField
                                                    fullWidth
                                                    value={variant.name}
                                                    onChange={(e: any) => { updateVariants({ ...variant, name: e.target.value }) }}
                                                    placeholder="Nhập tên phiên bản"
                                                    label={"Tên phiên bản " + (index + 1)} />
                                            </Grid>
                                            <Grid item xs={7}>
                                                <NumberInputTextField
                                                    fullWidth
                                                    placeholder="Giá phiên bản"
                                                    onChange={(e: any) => { updateVariants({ ...variant, price: e.target.value as number }) }}
                                                    value={variant.price}
                                                    name={""}
                                                    label={"Giá phiên bản " + (index + 1)} />
                                            </Grid>
                                        </Grid>
                                        <Typography style={{ marginTop: "16px", fontWeight: 500 }}>Thông tin danh sách nguyên liệu</Typography>
                                        <Box>
                                            <Box style={{ padding: "16px 0px" }}>
                                                <Box>
                                                    <SelectInfinite
                                                        getOptionLabel={(item) => item?.name || ""}
                                                        fetchDataSource={async (filter: IngredientFilterRequest) => {
                                                            let res = await IngredientsService.filter(filter);
                                                            const dataSource = {} as DataSource;
                                                            if (res.data.data) {
                                                                dataSource.data = res.data.data;
                                                                dataSource.metaData = {
                                                                    totalPage: Math.ceil((res.data.metadata?.total || 0) / (filter.limit || 10)),
                                                                    totalItems: (res.data.metadata?.total || 0),
                                                                };
                                                            }
                                                            return Promise.resolve(dataSource);
                                                        }}
                                                        onQueryChange={(filter: any) => {
                                                            let dataSourceFilter: IngredientFilterRequest = {
                                                                limit: 10,
                                                                query: filter.query,
                                                                page: filter.page || 1,
                                                            };
                                                            return dataSourceFilter;
                                                        }}
                                                        renderOption={(option: IngredientResponse) => (
                                                            <Box style={{ width: "100%", lineHeight: "40px", padding: "16px 0px", cursor: "pointer" }}>
                                                                <Typography style={{ marginLeft: "16px" }}>{option.name} - Tồn kho: {option.quantity}</Typography>
                                                            </Box>
                                                        )}
                                                        placeholder="Tìm kiếm nguyên liệu"
                                                        onChange={(ingredient: IngredientResponse) => {
                                                            addIngredients({
                                                                amountConsume: 1,
                                                                name: ingredient.name,
                                                                ingredientId: ingredient.id,
                                                                stockUnitId: ingredient.stockUnitResponse?.id || 0
                                                            }, variant)
                                                        }}
                                                        value={null}
                                                        className={classes.infiniteList}
                                                        NoResultsComponent={() => (
                                                            <NoResultsComponent
                                                                nameObject="nguyên liệu"
                                                                helpText={"Thử thay đổi từ khóa tìm kiếm hoặc thêm mới"}
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
                                                        <TableCell>Tên nguyên liệu</TableCell>
                                                        <TableCell align="center">Số lượng</TableCell>
                                                        <TableCell align="center">Đơn vị</TableCell>
                                                        <TableCell style={{ width: "50px" }}></TableCell>
                                                    </TableHead>
                                                    {(variant.ingredients && variant.ingredients.length > 0) && variant.ingredients.map((item, index) => (
                                                        <TableBody key={index}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell><Typography >{item.name}</Typography></TableCell>
                                                            <TableCell align="center">
                                                                <NumberInputTextField
                                                                    value={item.amountConsume}
                                                                    onChange={(value: any) => {
                                                                        updateIngredients({ ...item, amountConsume: value.target.value as number }, variant);
                                                                    }}
                                                                    name={"quantity"} style={{ marginTop: "-15px" }} />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Select value={item?.stockUnitId}
                                                                    disabled
                                                                    style={{ marginTop: "10px" }}
                                                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                                                        updateIngredients({ ...item, stockUnitId: event.target.value as number }, variant);
                                                                    }}
                                                                    placeholder="Chọn đơn vị">
                                                                    {stockUnits?.map((item, index) => {
                                                                        return (
                                                                            <MenuItem key={index} value={item.id}>
                                                                                <Typography >{item.name}</Typography>
                                                                            </MenuItem>
                                                                        )
                                                                    })}
                                                                </Select></TableCell>
                                                            <TableCell style={{ width: "50px" }}>
                                                                <IconButton
                                                                    aria-label="close" style={{ width: "20px" }} onClick={() => { deleteIngredients(item, variant) }} >
                                                                    <CloseIcon style={{ width: "20px", color: "rgb(149 149 149)" }} />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableBody>))}
                                                </Table>
                                                {!(variant.ingredients && variant.ingredients.length > 0) &&
                                                    <Box style={{ margin: "auto", padding: "24px" }}>
                                                        <BoxNoDataComponent width="150px" />
                                                    </Box>
                                                }
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                                <Button onClick={() => { addVariants() }} style={{ marginTop: "10px" }} startIcon={<PlusIcon color="primary" />} variant="text" color="primary">
                                    Thêm phiên bản
                                </Button>
                            </Box>

                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin mặt hàng
                            </Typography>
                            <Box className={classes.boxContentPaper} style={{ height: "350px" }}>
                                <Grid xs={12}>
                                    <TextField
                                        label="Tên mặt hàng"
                                        placeholder="Nhập tên mặt hàng"
                                        required
                                        fullWidth
                                        value={itemRequest?.name}
                                        onChange={(e: any) => { setItemRequest({ ...itemRequest, name: e.target.value }) }} />
                                    <NumberInputTextField
                                        label="Giảm giá mặt hàng"
                                        placeholder="Nhập giá trị giảm giá"
                                        style={{ marginTop: "16px" }}
                                        onChange={(e) => {

                                        }}
                                        fullWidth
                                        name={"discount"} />
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
                                            placeholderSelect="Chọn nhóm mặt hàng"
                                            inputSearchClassRoot={classes.inputCategory}
                                        />
                                    </Box>
                                    <Box style={{ width: 270, height: 60, marginTop: 16 }}>
                                        <TextareaAutosize
                                            label="Mô tả"
                                            height={60}
                                            value={itemRequest?.description}
                                            onChange={(e: any) => {
                                                setItemRequest({
                                                    ...itemRequest,
                                                    description: e.target.value,
                                                })
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
                <Box style={{ display: "flex", marginBottom: "24px", marginLeft: "830px", marginTop: "16px" }}>
                    <Button variant="outlined" color="primary">Hủy</Button>
                    <Button variant="contained" color="primary" style={{ marginLeft: "16px" }} onClick={() => { handleCreateItem(); }}>Tạo mặt hàng</Button>
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
export default connect(mapStateToProps, {})(withStyles(styles)(CreateItem));

