import { Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, Typography, WithStyles, withStyles } from "@material-ui/core";
import BoxNoDataComponent from "components/BoxNoData/BoxNoData.component";
import Button from "components/Button";
import SearchSuggest from "components/Filter/SearchSuggest";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import NumberInputTextField from "components/NumberInput/NumberInputTextField";
import Paper from "components/Paper/Paper";
import { BillPlusIcon, CloseIcon, PlusIcon } from "components/SVG";
import SelectInfinite from "components/Select/SelectInfinite/SelectInfinite";
import { DataSource } from "components/Select/types";
import TextField from "components/TextField";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { CategoryResponse } from "services/CategoryService";
import CategoryService from "services/CategoryService/CategoryService";
import { IngredientFilterRequest, IngredientResponse } from "services/IngredientsService";
import IngredientsService from "services/IngredientsService/IngredientsService";
import { IngredientItemRequest, ItemRequest, VariantRequest } from "services/ItemsService";
import { AppState } from "store/store";
import styles from "./CreateItem.styles";
import _ from "lodash";
import TextareaAutosize from "components/TextField/TextareaAutosize/TextareaAutosize";
export interface CreateItemProps extends WithStyles<typeof styles> {

}
const CreateItem = (props: CreateItemProps & PropsFromRedux) => {
    const { classes, authState } = props;
    const [categories, setCategories] = useState<CategoryResponse[]>();
    const [category, setCategory] = useState<CategoryResponse | undefined | null>();
    const [itemRequest, setItemRequest] = useState<ItemRequest>();
    const [ingredients, setIngredients] = useState<IngredientItemRequest[]>([]);
    const [variants, setVariants] = useState<VariantRequest[]>([{ id: 1, name: "", price: 0, type: "add" }]);

    useEffect(() => {
        initCategory();
    }, [])
    const initCategory = async () => {
        let res = await CategoryService.filter();
        if (res.data) {
            setCategories(res.data.data)
        }
    }

    const updateIngredients = (item: IngredientItemRequest) => {
        let ingredient = ingredients.find((i) => i.ingredientId === item.ingredientId);
        if (ingredient) {
            let ingredientsNew: IngredientItemRequest[] = ingredients.map((ig) => {
                if (ig.ingredientId !== ingredient?.ingredientId) {
                    return ig;
                } else {
                    return item;
                }
            });
            setIngredients([...ingredientsNew])

        }
    }

    const deleteIngredients = (item: IngredientItemRequest) => {
        setIngredients([...ingredients.filter((i) => i.ingredientId !== item.ingredientId)]);
    }


    const addIngredients = (item: IngredientItemRequest) => {
        let ingredient = ingredients.find((i) => i.ingredientId === item.ingredientId);
        if (ingredient) {
            let ingredientsNew: IngredientItemRequest[] = ingredients.map((ig) => {
                if (ig.ingredientId !== ingredient?.ingredientId) {
                    return ig;
                } else {
                    console.log(ig.amountConsume + item.amountConsume);
                    return { ...item, amountConsume: ig.amountConsume + item.amountConsume };
                }
            });
            setIngredients(ingredientsNew)
        } else {
            setIngredients([...ingredients, item])
        }
    }

    const addVariants = () => {
        let idMax = Math.max.apply(null, variants.map((item) => item.id));
        setVariants([...variants, { id: idMax + 1, name: "", price: 0, type: "add" }])
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
                                                type: "add",
                                                name: ingredient.name,
                                                ingredientId: ingredient.id,
                                            })
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
                                        <TableCell style={{ width: "50px" }}></TableCell>
                                    </TableHead>
                                    {(ingredients && ingredients.length > 0) && ingredients.map((item, index) => (
                                        <TableBody key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell><Typography >{item.name}</Typography></TableCell>
                                            <TableCell align="center">
                                                <NumberInputTextField
                                                    value={item.amountConsume}
                                                    onChange={(value: any) => {
                                                        updateIngredients({ ...item, amountConsume: value.target.value as number });
                                                    }
                                                    }
                                                    name={"quantity"} style={{ marginTop: "-15px" }} />
                                            </TableCell>
                                            <TableCell style={{ width: "50px" }}>
                                                <IconButton
                                                    aria-label="close" style={{ width: "20px" }} onClick={() => { deleteIngredients(item) }} >
                                                    <CloseIcon style={{ width: "20px", color: "rgb(149 149 149)" }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableBody>))}
                                </Table>
                                {!(ingredients && ingredients.length > 0) &&
                                    <Box style={{ margin: "auto", padding: "24px" }}>
                                        <BoxNoDataComponent />
                                    </Box>
                                }
                            </Box>
                        </Paper>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin phiên bản
                            </Typography>
                            <Box className={classes.boxContentPaper}>
                                <Typography>Phiên bản</Typography>
                                {variants && variants.length > 0 && variants.map((variant, index) => (
                                    <Grid container xs={12} spacing={2} key={index} >
                                        <Grid item xs={5}>
                                            <TextField
                                                fullWidth
                                                value={variant.name}
                                                onChange={(e: any) => { updateVariants({ ...variant, name: e.target.value }) }}
                                                placeholder="Tên phiên bản" />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <NumberInputTextField
                                                fullWidth
                                                placeholder="Giá phiên bản"
                                                onChange={(e: any) => { updateVariants({ ...variant, price: e.target.value as number }) }}
                                                value={variant.price}
                                                name={""} />
                                        </Grid>
                                        <Grid item xs={1}>
                                            <IconButton
                                                aria-label="close" style={{ width: "20px", marginTop: "20px" }} onClick={() => { deleVariants(variant) }} >
                                                <CloseIcon style={{ width: "20px", color: "rgb(149 149 149)" }} />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
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
                            <Box className={classes.boxContentPaper} style={{height: "350px"}}>
                                <Grid xs={12}>
                                    <TextField label="Tên mặt hàng" placeholder="Nhập tên mặt hàng" required fullWidth />
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
                                    <Box style={{width: 270, height: 60, marginTop: 16}}>
                                        <TextareaAutosize
                                            label="Mô tả"
                                            height={60}
                                            value={itemRequest?.description}
                                            onChange={(e) =>{
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
                <Button variant="contained" color="primary" style={{ marginLeft: "16px" }}>Lưu</Button>
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

