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
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { CategoryResponse } from "services/CategoryService";
import CategoryService from "services/CategoryService/CategoryService";
import { IngredientFilterRequest, IngredientResponse } from "services/IngredientsService";
import IngredientsService from "services/IngredientsService/IngredientsService";
import { IngredientItemRequest, ItemFilterRequest, ItemRequest, ItemResponse, ItemResponses, VariantRequest, VariantResponse } from "services/ItemsService";
import { AppState } from "store/store";
import styles from "./CreateCombo.styles";
import ItemsService from "services/ItemsService/ItemsService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { getMessageError } from "utilities";
import { useHistory } from "react-router-dom";
import Select from "components/Select/Index";
import StockUnitService from "services/StockUnitService/StockUnitService";
import { StockUnitResponse } from "services/StockUnitService";
import { CreateComboRequest } from "services/ComboService/types";
import ModalStack from "components/Modal/ModalStack";
import { VariantComboRequest } from "services/ComboService/types";
import ComboService from "services/ComboService/ComboService";
export interface CreateConboProps extends WithStyles<typeof styles> {

}
const CreateCombo = (props: CreateConboProps & PropsFromRedux) => {
    const { classes, authState } = props;
    const [categories, setCategories] = useState<CategoryResponse[]>();
    const [category, setCategory] = useState<CategoryResponse | undefined | null>();
    const [itemRequest, setItemRequest] = useState<ItemRequest>();
    const [comboRequest, setComboRequest] = useState<CreateComboRequest>();
    const [variants, setVariants] = useState<VariantRequest[]>([{ id: 1, name: "", price: 0 }]);
    const [stockUnits, setStockUnits] = useState<StockUnitResponse[]>();
    const [variantComboRequest, setVariantComboRequest] = useState<VariantComboRequest[]>([])
    const history = useHistory();
    useEffect(() => {
        initCategory();
        initItme();
    }, [])
    const initCategory = async () => {
        let res = await CategoryService.filter();
        if (res.data) {
            setCategories(res.data.data)
        }
    }
    const initItme = async () => {
        let res = await ItemsService.filter();
        if (res.data) {
            console.log("oo", res.data);
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
    const updateVariant = (variant: VariantComboRequest) => {
        let variantNews = variantComboRequest.map((v) => {
            if (v.variantId === variant.variantId) {
                return variant
            }
            else return v;
        })
        setVariantComboRequest(variantNews);
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


    const deleteVarinat = (variant: VariantComboRequest) => {
        let variantsNew = variantComboRequest.filter((v) => v.variantId !== variant.variantId)
        setVariantComboRequest(variantsNew);
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
    const addVariant = (variant: VariantComboRequest, item: ItemResponses) => {
        debugger
        if (variantComboRequest.length>0) {
            let variantOld = variantComboRequest.find((v) => v.variantId === variant.variantId);
            if(variantOld){
                let itemNews = variantComboRequest?.map((v) => {
                    if (v.variantId === variant.variantId) {
                        return {
                            ...v,
                            quantity: (v.quantity + 1)
                        }
                    }
                    else return { ...v || [], variant };
                })
                setVariantComboRequest(itemNews);
            }else {
                let variantNews = [...variantComboRequest, variant]
            setVariantComboRequest(variantNews);
            }
            
        }
        else {
            let oke = [variant]
            setVariantComboRequest(oke);
        }
    }
    console.log("789", variantComboRequest);
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
    const handleCreateCombo = async () => {
        
            if (!comboRequest?.name) {
                SnackbarUtils.error(`Tên combo không được để trống!`);
                return;
            }
     
        let requet: CreateComboRequest = {
            ...comboRequest,
            categoryId: category?.id || 0,
            varianIds: variantComboRequest,
        }
        try {
            let res = await ComboService.create(requet);
            if (res.data) {
                SnackbarUtils.success("Tạo combo thành công");
                history.push(`/admin/combos`)
            }
        } catch (error) {
            SnackbarUtils.error(getMessageError(error));
        }
    }
    return (<>

        <Box className={classes.container}>
            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                Thêm mới combo
            </Typography>
            <Grid container xs={12} spacing={2}>
                <Grid item xs={8}>
                    <Paper className={classes.wrapperBoxInfo}>
                        <Box className={classes.boxContentPaper}>
                            <Typography style={{ fontWeight: 500 }}>Tên combo</Typography>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    // value={variant.name}
                                    onChange={(e: any) => { setComboRequest({ ...comboRequest, name: e.target.value as any }) }}
                                    placeholder="Nhập tên combo"
                                />
                            </Grid>
                        </Box>
                    </Paper>
                    <Paper className={classes.wrapperBoxInfo}>
                        <Box className={classes.boxContentPaper}>
                            <Typography style={{ fontWeight: 500, marginBottom: 15 }}>Thiết lập combo</Typography>
                            <Grid item xs={12}>
                                <NumberInputTextField
                                    fullWidth
                                    placeholder="0đ"
                                    onChange={(e: any) => { setComboRequest({ ...comboRequest, price: e.target.value as number }) }}

                                    name={""}
                                    label={"Giá combo "} />
                            </Grid>

                            <Box style={{ paddingTop: "10px", borderBottom: "1px solid #E8EAEB" }}>

                                <Typography style={{ marginTop: "16px", fontWeight: 500 }}>Thông tin danh sách mặt hàng</Typography>
                                <Box>
                                    <Box style={{ padding: "16px 0px" }}>

                                        <Box>
                                            <SelectInfinite
                                                getOptionLabel={(item) => item?.name || ""}
                                                fetchDataSource={async (filter: ItemFilterRequest) => {
                                                    let res = await ItemsService.filter(filter);
                                                    const dataSource = {} as DataSource;
                                                    if (res.data.data) {

                                                        dataSource.data = res.data.data.reduce((aray, obj) => {
                                                            const dataVarian = obj.variants.map((x: any) => ({
                                                                id: obj.id,
                                                                name: obj.name,
                                                                image: obj.imageUrl,
                                                                status: obj.status,
                                                                variants: x,
                                                                quantity: 1,

                                                            }));
                                                            aray = aray.concat(dataVarian as any);
                                                            return aray;
                                                        }, []);
                                                        console.log("test", dataSource.data);
                                                        dataSource.metaData = {
                                                            totalPage: Math.ceil((res.data.metadata?.total || 0) / (filter.limit || 0)),
                                                            totalItems: (res.data.metadata?.total || 0),
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
                                                    <Box style={{ width: "100%", lineHeight: "40px", padding: "16px 0px", cursor: "pointer" }}>
                                                        <Typography style={{ marginLeft: "16px" }}>{option.name}-{option.variants.name} - giá: {option.variants.price}</Typography>
                                                    </Box>
                                                )}
                                                placeholder="Tìm kiếm mặt hàng"
                                                onChange={(item: ItemResponses) => {
                                                    debugger
                                                    addVariant({
                                                        variantId: item.variants.id,
                                                        quantity: 1,
                                                        price: item.variants.price,
                                                        name: item.name + "-" + item.variants.name
                                                    }, item)
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
                                                <TableCell>Tên mặt hàng </TableCell>
                                                <TableCell align="center">Số lượng</TableCell>
                                                <TableCell style={{ width: "50px" }}></TableCell>
                                            </TableHead>
                                            {(variantComboRequest && variantComboRequest.length > 0) && variantComboRequest.map((item, index) => (
                                                console.log("oke", item),

                                                <TableBody key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell><Typography >{item.name}</Typography></TableCell>
                                                    <TableCell align="center">
                                                        <NumberInputTextField
                                                            value={item.quantity}
                                                            onChange={(value: any) => {
                                                                updateVariant({ ...item, quantity: value.target.value as number });
                                                            }
                                                            }
                                                            name={"quantity"} style={{ marginTop: "-15px" }} />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Select value={item.price}
                                                            disabled
                                                            style={{ marginTop: "10px" }}
                                                            placeholder="Chọn đơn vị">

                                                        </Select>
                                                    </TableCell>
                                                    <TableCell style={{ width: "50px" }}>
                                                        <IconButton
                                                            aria-label="close" style={{ width: "20px" }} onClick={() => { deleteVarinat(item) }} >
                                                            <CloseIcon style={{ width: "20px", color: "rgb(149 149 149)" }} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableBody>))}
                                        </Table>
                                        {!(variantComboRequest && variantComboRequest.length > 0) &&
                                            <Box style={{ margin: "auto", padding: "24px" }}>
                                                <BoxNoDataComponent width="150px" />
                                            </Box>
                                        }
                                    </Box>
                                </Box>
                            </Box>

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
                </Grid>
            </Grid>
        </Box>
        <Box style={{ display: "flex", marginBottom: "100px", marginLeft: "1150px", marginTop: "16px" }}>
            <Button variant="outlined" color="primary">Hủy</Button>
            <Button variant="contained" color="primary" style={{ marginLeft: "16px" }} onClick={() => { handleCreateCombo(); }}>Lưu</Button>
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
export default connect(mapStateToProps, {})(withStyles(styles)(CreateCombo));

