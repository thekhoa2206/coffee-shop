import { Box, Grid, Table, TableBody, TableCell, TableHead, Typography, WithStyles, withStyles } from "@material-ui/core";
import BoxNoDataComponent from "components/BoxNoData/BoxNoData.component";
import Paper from "components/Paper/Paper";
import React, { Fragment, useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { CategoryResponse } from "services/CategoryService";
import CategoryService from "services/CategoryService/CategoryService";
import { ItemResponse } from "services/ItemsService";
import ItemsService from "services/ItemsService/ItemsService";
import { AppState } from "store/store";
import { formatDateUTCToLocalDateString, formatMoney, getMessageError } from "utilities";
import styles from "./ItemDetail.styles";
import HeaderAction from "components/HeaderAction/HeaderAction";
import Button from "components/Button";
import Image from "components/Image";
import AvatarDefaultIcon from "components/SVG/AvatarDefaultIcon";
import useModal from "components/Modal/useModal";
import ConfirmDialog from "components/Dialog/ConfirmDialog/ConfirmDialog";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
export interface CreateItemProps extends WithStyles<typeof styles> {

}
const ItemDetail = (props: CreateItemProps & PropsFromRedux) => {
    const { classes, authState } = props;
    const history = useHistory();
    const [categories, setCategories] = useState<CategoryResponse[]>();
    const [category, setCategory] = useState<CategoryResponse | undefined | null>();
    const [itemResponse, setItemResponse] = useState<ItemResponse>();
    const { closeModal, confirm, openModal } = useModal();

    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        initItemIngredient();
    }, [])
    const initItemIngredient = async () => {
        let res = await ItemsService.getById(id);
        if (res.data) {
            setItemResponse(res.data)
            setCategory(res.data.category);
        }
    }

    const handleDelete = async () => {
        try {
          let res = await ItemsService.delete(id);
          SnackbarUtils.success("Xoá mặt hàng thành công");
        } catch (error) {
          SnackbarUtils.error(getMessageError(error));
        }
    
      }
    
    return (
        <>
            <Box style={{ width: "1072px", margin: "auto", height: 40, marginBottom: 10, marginTop: 16 }}>
                <Grid container xs={12} spacing={2}>
                    <Grid item xs={6}>
                        <Button variant="outlined" btnType="destruction" color="primary" onClick={() => {
                            openModal(ConfirmDialog, {
                                confirmButtonText: "Xoá",
                                message:
                                    "Bạn có muốn xoá mặt hàng không? Thao tác này không thể hoàn tác",
                                title: "Xoá mặt hàng",
                                cancelButtonText: "Thoát",
                            }).result.then((res) => {
                                if (res) {
                                    handleDelete();
                                }
                            });
                        }}>
                            Xoá
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" style={{ float: "right" }} onClick={() => { history.push(`/admin/items/${id}/edit`) }}>Sửa</Button>
                    </Grid>
                </Grid>
            </Box>
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
                                {itemResponse?.variants && itemResponse?.variants.length > 0 && itemResponse?.variants.map((variant, index) => (
                                    <Box key={index} style={{ paddingTop: "10px", borderBottom: "1px solid #E8EAEB" }}>
                                        <Grid container xs={12} spacing={2} >
                                            <Grid item xs={5}>
                                                <Grid container xs={12} style={{ marginTop: 16 }}>
                                                    <Grid item xs={5}>Tên phiên bản</Grid>
                                                    <Grid item xs={1}>:</Grid>
                                                    <Grid item xs={6}>{variant?.name ? variant?.name : "---"}</Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={7}>
                                                <Grid container xs={12} style={{ marginTop: 16 }}>
                                                    <Grid item xs={5}>Giá phiên bản</Grid>
                                                    <Grid item xs={1}>:</Grid>
                                                    <Grid item xs={6}>{variant?.price ? formatMoney(variant?.price) : "---"}</Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Typography style={{ marginTop: "16px", fontWeight: 500 }}>Thông tin danh sách nguyên liệu</Typography>
                                        <Box>
                                            <Box style={{ padding: "16px 0px" }}>
                                            </Box>
                                            <Box>
                                                <Table stickyHeader>
                                                    <TableHead>
                                                        <TableCell>STT</TableCell>
                                                        <TableCell>Tên nguyên liệu</TableCell>
                                                        <TableCell align="center">Số lượng</TableCell>
                                                        <TableCell align="center">Đơn vị</TableCell>
                                                    </TableHead>
                                                    {(variant.ingredients && variant.ingredients.length > 0) && variant.ingredients.map((item, index) => (
                                                        <TableBody key={index}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell><Typography >{item.name}</Typography></TableCell>
                                                            <TableCell align="center">
                                                                {item.amountConsume ? formatMoney(item.amountConsume) : 0}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {item.stockUnitResponse?.name || "---"}
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
                                    <Grid container xs={12} style={{ marginTop: 16 }}>
                                        <Grid item xs={5}>Ngày tạo</Grid>
                                        <Grid item xs={1}>:</Grid>
                                        <Grid item xs={6}>{itemResponse?.createdOn ? formatDateUTCToLocalDateString(itemResponse.createdOn) : "---"}</Grid>
                                    </Grid>
                                    <Grid container xs={12} style={{ marginTop: 16 }}>
                                        <Grid item xs={5}>Ngày sửa</Grid>
                                        <Grid item xs={1}>:</Grid>
                                        <Grid item xs={6}>{itemResponse?.modifiedOn ? formatDateUTCToLocalDateString(itemResponse.modifiedOn) : "---"}</Grid>
                                    </Grid>
                                    <Grid container xs={12} style={{ marginTop: 16 }}>
                                        <Grid item xs={5}>Giảm giá</Grid>
                                        <Grid item xs={1}>:</Grid>
                                        <Grid item xs={6}>{itemResponse?.discountPercentage ? itemResponse?.discountPercentage : "---"}</Grid>
                                    </Grid>
                                    <Grid container xs={12} style={{ marginTop: 16 }}>
                                        <Grid item xs={5}>Nhóm mặt hàng</Grid>
                                        <Grid item xs={1}>:</Grid>
                                        <Grid item xs={6}>{category?.name ? category?.name : "---"}</Grid>
                                    </Grid>
                                    <Grid container xs={12} style={{ marginTop: 16 }}>
                                        <Grid item xs={5}>Mô tả</Grid>
                                        <Grid item xs={1}>:</Grid>
                                        <Grid item xs={6}>{itemResponse?.description ? itemResponse?.description : "---"}</Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Hình đại diện
                            </Typography>
                            <Box className={classes.boxContentPaper} style={{}}>

                                {itemResponse?.imageUrl ? (
                                    <Image src={itemResponse.imageUrl || ""} style={{ height: 255, width: 290, }} />
                                ) : (
                                    <AvatarDefaultIcon style={{ height: 120, width: 120, marginLeft: 100, marginBottom: 40 }} />
                                )}
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

