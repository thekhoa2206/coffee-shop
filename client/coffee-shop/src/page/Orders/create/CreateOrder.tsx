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
import React, { useCallback, useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { CategoryResponse } from "services/CategoryService";
import CategoryService from "services/CategoryService/CategoryService";
import { IngredientFilterRequest, IngredientResponse } from "services/IngredientsService";
import IngredientsService from "services/IngredientsService/IngredientsService";
import { IngredientItemRequest, ItemFilterRequest, ItemRequest, ItemResponse, VariantRequest } from "services/ItemsService";
import { AppState } from "store/store";
import styles from "./CreateOrder.styles";
import ItemsService from "services/ItemsService/ItemsService";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { formatMoney, getMessageError } from "utilities";
import { useHistory } from "react-router-dom";
import Select from "components/Select/Index";
import StockUnitService from "services/StockUnitService/StockUnitService";
import { StockUnitResponse } from "services/StockUnitService";
import { CustomerResponse } from "services/CustomerService";
import CustomerService from "services/CustomerService/CustomerService";
import { AccountCircleRounded } from "@material-ui/icons";
import Link from "components/Link";
import { ProductFilterRequest, ProductResponse } from "services/ProductService";
import ProductService from "services/ProductService/ProductService";
import Image from "components/Image";
export interface CreateOrderProps extends WithStyles<typeof styles> {

}
const CreateOrder = (props: CreateOrderProps & PropsFromRedux) => {
    const { classes, authState } = props;
    const [customer, setCustomer] = useState<CustomerResponse | null>();
    const [itemRequest, setItemRequest] = useState<ItemRequest>();
    const history = useHistory();
    const [querySearchCustomer, setQuerySearchCustomer] = useState("");

    const handleCreateItem = async () => {

    }

    const handleChangeCustomer = useCallback((customer: CustomerResponse | null) => {
        setCustomer(customer);
    }, [])

    const handleOpenDialogCustomer = useCallback(() => {

    }, [])
    return (
        <>
            <Box className={classes.container}>
                <Grid container xs={12} spacing={2}>
                    <Grid item xs={8}>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin sản phẩm
                            </Typography>
                            <Box className={classes.boxContentPaper}>
                                <SelectInfinite
                                    getOptionLabel={(item) => item?.name || ""}
                                    fetchDataSource={async (filter: ProductFilterRequest) => {
                                        let res = await ProductService.filter(filter);
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
                                        let dataSourceFilter: ProductFilterRequest = {
                                            limit: 10,
                                            query: filter.query,
                                            page: filter.page || 1,
                                            combo: true,
                                        };
                                        return dataSourceFilter;
                                    }}
                                    renderOption={(option: ProductResponse) => (
                                        <Box>
                                            <Box style={{ width: "100%", lineHeight: "40px", padding: "16px 0px", cursor: "pointer", borderBottom: "1px solid #E8EAEB", display: "flex" }}>
                                                <Box style={{ width: "10%" }}>
                                                    <Box style={{ marginLeft: 10 }}>
                                                        {option.imageUrl ?
                                                            <Image src={option.imageUrl} /> :
                                                            <Box style={{ width: "40px", height: "40px", background: "#E8EAEB", borderRadius: "6px" }}>
                                                            </Box>
                                                        }
                                                    </Box>
                                                </Box>
                                                <Box style={{ width: "55%" }}>
                                                    <Typography>{option.name} - {formatMoney(option.price || 0) + "đ"}</Typography>
                                                </Box>
                                                <Box style={{ width: "30%" }}></Box>
                                            </Box>
                                            {option.variants && option.variants.length > 0 && option.variants.map((variant, index) => (
                                                <Box style={{ width: "100%", lineHeight: "40px", padding: "16px 0px", cursor: "pointer", borderBottom: "1px solid #E8EAEB", display: "flex" }}>
                                                    <Box style={{ width: "10%" }}>
                                                        <Box style={{ marginLeft: 10 }}>
                                                            {option.imageUrl ?
                                                                <Image src={option.imageUrl} /> :
                                                                <Box style={{ width: "40px", height: "40px", background: "#E8EAEB", borderRadius: "6px" }}>
                                                                </Box>
                                                            }
                                                        </Box>
                                                    </Box>
                                                    <Box style={{ width: "55%" }}>
                                                        <Typography>{variant.name} - {formatMoney(variant.price || 0) + "đ"}</Typography>
                                                    </Box>
                                                    <Box style={{ width: "30%" }}></Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                    placeholder="Tìm kiếm nguyên liệu"
                                    onChange={(ingredient: ItemResponse) => {

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

                        </Paper>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin thanh toán
                            </Typography>
                            <Box className={classes.boxContentPaper}>

                            </Box>

                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin khách hàng
                            </Typography>
                            <Box className={classes.boxContentPaper} style={{ padding: "8px 16px" }}>
                                <Grid xs={12} style={{ padding: 0 }}>
                                    {customer ? (
                                        <Box style={{ width: 330 }}>
                                            <Grid xs={12} container>
                                                <Grid xs={5} item>Tên khách hàng</Grid>
                                                <Grid xs={1} item>:</Grid>
                                                <Grid xs={6} item>
                                                    <Link to={`/admin/customers`} target="_blank" style={{ fontWeight: 500 }}>
                                                        {customer.name}
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                            <Grid xs={12} container>
                                                <Grid xs={5} item>Sđt khách hàng</Grid>
                                                <Grid xs={1} item>:</Grid>
                                                <Grid xs={6} item>
                                                    {customer.phoneNumber}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ) : (
                                        <SelectInfinite
                                            placeholder="Tìm kiếm khách hàng"
                                            value={null}
                                            onChange={handleChangeCustomer}
                                            getOptionLabel={(e) => e.name}
                                            fetchDataSource={async (filter: any) => {
                                                let limit = 10;
                                                try {
                                                    filter["statuses.in"] = "active";
                                                    filter.condition_type = "must";
                                                    if (!filter["query.contains"] || filter["query.contains"].length === 0) {
                                                        delete filter["query.contains"];
                                                    }
                                                    let res = await CustomerService.filter(filter);

                                                    let dataSource = {} as DataSource;
                                                    dataSource.data = res.data.data || [];
                                                    dataSource.metaData = {
                                                        totalPage: Math.ceil((res.data.metadata?.total || 0) / limit),
                                                        totalItems: res.data.metadata?.total || 0,
                                                    };
                                                    return Promise.resolve(dataSource);
                                                } catch (error) { }
                                            }}

                                            onQueryChange={(filter) => {
                                                let dataSourceFilter = {} as any;
                                                dataSourceFilter["query.contains"] = filter.query;
                                                setQuerySearchCustomer(filter.query);
                                                dataSourceFilter.page = filter.page ?? 1;
                                                dataSourceFilter.limit = 10;
                                                return dataSourceFilter;
                                            }}
                                            textCreate={"Thêm khách hàng mới"}
                                            createable
                                            onClickCreate={handleOpenDialogCustomer}
                                            renderOption={(option) => (
                                                <MenuItem className={classes.customerLineItem}>
                                                    <AccountCircleRounded className="icon" />
                                                    <Box>
                                                        <Typography noWrap>{option.name}</Typography>
                                                        <Typography variant={"subtitle1"} noWrap>
                                                            {option.phoneNumber}
                                                        </Typography>
                                                    </Box>
                                                </MenuItem>
                                            )}
                                            maxHeight={300}
                                        />
                                    )}
                                </Grid>
                            </Box>
                        </Paper>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin bổ sung
                            </Typography>
                            <Box className={classes.boxContentPaper} style={{ height: "100px", padding: "16px 16px" }}>
                                <Grid xs={12} style={{ padding: 0 }}>
                                    <Box style={{ width: 270 }}>
                                        <TextareaAutosize
                                            label="Ghi chú"
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
                <Button variant="contained" color="primary" style={{ marginLeft: "16px" }} onClick={() => { handleCreateItem(); }}>Lưu</Button>
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
export default connect(mapStateToProps, {})(withStyles(styles)(CreateOrder));

