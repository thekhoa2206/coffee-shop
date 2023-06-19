import { Box, Grid, MenuItem, Typography } from "@material-ui/core";
import Dialog from "components/Dialog";
import NumberInputTextField from "components/NumberInput/NumberInputTextField";
import Select from "components/Select/Index";
import TextField from "components/TextField";
import React, { Fragment, useEffect, useState } from "react";
import { IngredientRequest, IngredientResponse } from "services/IngredientsService";
import IngredientsService from "services/IngredientsService/IngredientsService";
import { StockUnitResponse } from "services/StockUnitService";
import StockUnitService from "services/StockUnitService/StockUnitService";
import { formatDateTime, getMessageError } from "utilities";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
export interface DialogAddIngredientProps {
    id?: string;
    open: boolean;
    onClose: () => void;
    ingredient?: IngredientResponse;
    initData?: (ingredient?: IngredientResponse) => void;
}
export const DialogEditIngredient = (props: DialogAddIngredientProps) => {
    const { open, onClose, initData } = props;
    const [ingredient, setIngredient] = useState<IngredientRequest>();
    const [stockUnits, setStockUnits] = useState<StockUnitResponse[]>();
    useEffect(() => {
        if (props.ingredient) {
            setIngredient({
                name: props.ingredient?.name,
                exportPrice: props.ingredient.exportPrice,
                quantity: props.ingredient.quantity,
                stockUnitId: props.ingredient.stockUnitResponse?.id,
            })
        }
    }, [props.ingredient])

    useEffect(() => {
        initUnit();
    }, [])
    const initUnit = async () => {
        let res = await StockUnitService.filter();
        if (res.data) {
            setStockUnits(res.data.data)
        }
    }
    const handleAddCustomer = () => {
        let ingredientAdd: IngredientRequest = {
            ...ingredient,
        };
        if (ingredient) {
            if (props.ingredient?.id) {
                IngredientsService.update(ingredientAdd, props.ingredient?.id)
                    .then(async (res) => {
                        if (res) {
                            onClose();
                            if (res.data) {
                                if (initData) initData(res.data);https://apic-ptl-portal-web-cp4i.apps.daffy-3b46i1z1.cloud.techzone.ibm.com/retail/dev/product/11/api/10#/term_plans_100/definitions
                                SnackbarUtils.success("Cập nhật nguyên liệu thành công!");
                            }
                        }
                    })
                    .catch((err) => {
                        SnackbarUtils.error(getMessageError(err));
                    });
            } else {
                IngredientsService.create(ingredientAdd)
                    .then(async (res) => {
                        if (res) {
                            onClose();
                            if (res.data) {
                                if (initData) initData(res.data);
                                SnackbarUtils.success("Tạo mới nguyên liệu thành công!");
                            }
                        }
                    })
                    .catch((err) => {
                        SnackbarUtils.error(getMessageError(err));
                    });
            }
        }
    };
    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                title={!!props.ingredient ? "Sửa nguyên liệu": "Thêm mới nguyên liệu"}
                onOk={handleAddCustomer}
                textOk={"Lưu"}
                minWidthPaper="790px"
                DialogTitleProps={{
                    dividerBottom: true
                }}
                children={
                    <Box padding={"16px"}>
                        {!!props.ingredient && <Grid container xs={12} spacing={2}>
                            <Grid item xs={6}>
                                <Typography>Ngày tạo: {props.ingredient.createdOn ? formatDateTime(props.ingredient.createdOn, "DD-MM-YYYY HH:mm") : "---"}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Ngày cập nhật: {props.ingredient.modifiedOn ? formatDateTime(props.ingredient.modifiedOn, "DD-MM-YYYY HH:mm") : "---"}</Typography>
                            </Grid>
                        </Grid>
                        }
                        <Grid container xs={12} spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Tên nguyên liệu"
                                    placeholder="Nhập tên nguyên liệu..."
                                    fullWidth
                                    required
                                    value={ingredient?.name}
                                    onChange={(e: any) => { setIngredient({ ...ingredient, name: e.target.value }) }} />
                            </Grid>
                            <Grid item xs={6}>
                                <NumberInputTextField
                                    placeholder="Nhập số lượng tồn kho ban đầu..."
                                    fullWidth
                                    required
                                    value={ingredient?.quantity}
                                    onChange={(e: any) => { setIngredient({ ...ingredient, quantity: e.target.value }); }} label="Số lượng tồn kho"
                                    disabled={!!props?.ingredient} name={"quantity"} />
                            </Grid>
                        </Grid>
                        <Grid container xs={12} spacing={2}>
                            <Grid item xs={6}>
                                <NumberInputTextField
                                    placeholder="Nhập giá nguyên liệu..."
                                    label="Giá nguyên liệu"
                                    fullWidth
                                    required
                                    value={ingredient?.exportPrice}
                                    onChange={(e: any) => { setIngredient({ ...ingredient, exportPrice: e.target.value }); }} name={"exportPrice"} />
                            </Grid>
                            <Grid item xs={6}>
                                <Select value={ingredient?.stockUnitId}
                                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                        setIngredient({ ...ingredient, stockUnitId: event.target.value as number });
                                    }}
                                    label="Đơn vị"
                                    placeholder="Chọn đơn vị">
                                    {stockUnits?.map((item, index) => {
                                        return (
                                            <MenuItem key={index} value={item.id}>
                                                <Typography >{item.name}</Typography>
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </Grid>
                        </Grid>
                    </Box>
                }
            />
        </Fragment>
    );
};
