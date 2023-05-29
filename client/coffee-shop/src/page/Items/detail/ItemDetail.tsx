import { Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, Typography, WithStyles, withStyles } from "@material-ui/core";
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
import { IngredientItemRequest, ItemRequest, ItemResponse, VariantRequest, VariantResponse } from "services/ItemsService";
import { AppState } from "store/store";
import styles from "./ItemDetail.styles";
import ItemsService from "services/ItemsService/ItemsService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { formatDate, formatDateUTCToLocalDateString, formatMoney, getMessageError } from "utilities";
import { useParams } from "react-router-dom";
export interface CreateItemProps extends WithStyles<typeof styles> {

}
const ItemDetail = (props: CreateItemProps & PropsFromRedux) => {
    const { classes, authState } = props;
    const [categories, setCategories] = useState<CategoryResponse[]>();
    const [category, setCategory] = useState<CategoryResponse | undefined | null>();
    const [itemResponse, setItemResponse] = useState<ItemResponse>();
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        initCategory();
        initItemIngredient();
    }, [])
    const initCategory = async () => {
        let res = await CategoryService.filter();
        if (res.data) {
            setCategories(res.data.data)
        }
    }
    const initItemIngredient = async () => {
        let res = await ItemsService.getById(id);
        if (res.data) {
            setItemResponse(res.data)
            
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
                            <Box>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Tên nguyên liệu</TableCell>
                                        <TableCell align="center">Số lượng</TableCell>
                                    </TableHead>
                                    {(itemResponse && itemResponse.ingredients && itemResponse.ingredients.length > 0) && itemResponse.ingredients.map((item, index) => (
                                        <TableBody key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell><Typography >{item.name}</Typography></TableCell>
                                            <TableCell align="center">
                                                {item.amountConsume}
                                            </TableCell>
                                        </TableBody>))}
                                </Table>
                                {!(itemResponse && itemResponse.ingredients && itemResponse.ingredients.length > 0) &&
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
                            <Box style={{ borderTop: "1px solid #E8EAEB", paddingTop: 16 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Tên phiên bản</TableCell>
                                        <TableCell align="center">Giá</TableCell>
                                    </TableHead>
                                    {itemResponse && itemResponse.variants && itemResponse.variants.length > 0 && itemResponse.variants.map((variant, index) => (
                                        <TableBody key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell><Typography >{variant.name}</Typography></TableCell>
                                            <TableCell align="center">
                                                {formatMoney(variant.price)} đ
                                            </TableCell>
                                        </TableBody>))}
                                </Table>
                                {!(itemResponse && itemResponse.ingredients && itemResponse.ingredients.length > 0) &&
                                    <Box style={{ margin: "auto", padding: "24px" }}>
                                        <BoxNoDataComponent />
                                    </Box>
                                }
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin mặt hàng
                            </Typography>
                            <Box className={classes.boxContentPaper} style={{ height: "200px" }}>
                                <Grid xs={12}>
                                    <Grid container xs={12}>
                                        <Grid item xs={5}>Tên mặt hàng</Grid>
                                        <Grid item xs={1}>:</Grid>
                                        <Grid item xs={6}>{itemResponse?.name}</Grid>
                                    </Grid>
                                    <Grid container xs={12} style={{marginTop: 16}}>
                                        <Grid item xs={5}>Ngày tạo</Grid>
                                        <Grid item xs={1}>:</Grid>
                                        <Grid item xs={6}>{itemResponse?.createdOn ? formatDateUTCToLocalDateString(itemResponse.createdOn) : "---"}</Grid>
                                    </Grid>
                                    <Grid container xs={12} style={{marginTop: 16}}>
                                        <Grid item xs={5}>Ngày sửa</Grid>
                                        <Grid item xs={1}>:</Grid>
                                        <Grid item xs={6}>{itemResponse?.modifiedOn ? formatDateUTCToLocalDateString(itemResponse.modifiedOn) : "---"}</Grid>
                                    </Grid>
                                    <Grid container xs={12} style={{marginTop: 16}}>
                                        <Grid item xs={5}>Giảm giá</Grid>
                                        <Grid item xs={1}>:</Grid>
                                        <Grid item xs={6}>{itemResponse?.discountPercentage ? itemResponse?.discountPercentage : "---"}</Grid>
                                    </Grid>
                                    <Grid container xs={12} style={{marginTop: 16}}>
                                        <Grid item xs={5}>Nhóm mặt hàng</Grid>
                                        <Grid item xs={1}>:</Grid>
                                        <Grid item xs={6}>{category?.name ? category?.name : "---"}</Grid>
                                    </Grid>
                                    <Grid container xs={12} style={{marginTop: 16}}>
                                        <Grid item xs={5}>Mô tả</Grid>
                                        <Grid item xs={1}>:</Grid>
                                        <Grid item xs={6}>{itemResponse?.description ? itemResponse?.description : "---"}</Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
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
export default connect(mapStateToProps, {})(withStyles(styles)(ItemDetail));

