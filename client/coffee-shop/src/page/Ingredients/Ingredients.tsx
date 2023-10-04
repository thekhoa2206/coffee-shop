import { Box, Typography, withStyles } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import Button from "components/Button";
import LoadingAuth from "components/Loading/LoadingAuth";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { DataResult, GridPageChangeEvent } from "components/SapoGrid/SapoGrid.type";
import { CellTemplateProps } from "components/SapoGridSticky";
import SearchBox from "components/SearchBox/SearchBox";
import useQueryParams from "hocs/useQueryParams";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { IngredientFilterRequest, IngredientResponse } from "services/IngredientsService";
import IngredientsService from "services/IngredientsService/IngredientsService";
import { AppState } from "store/store";
import {
    formatDateUTCToLocalDateString, formatMoney
} from "utilities";
import QueryUtils from "utilities/QueryUtils";
import { IngredientsQuickFilterOptions, getIngredientsQuickFilterLabel } from "./Filter/IngredientsFilter.constant";
import styles from "./Ingredients.styles";
import {
    IngredientProps
} from "./Ingredients.type";
import { DialogAddIngredient } from "./component/DialogAddIngredient";
import { DialogEditIngredient } from "./component/DialogEditIngredient";
import { IngredientsStatus } from "./utils/IngredientContants";
import Chip from "components/Chip/Chip.component";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";

const Ingredients = (props: IngredientProps & PropsFromRedux) => {
    const { classes, authState } = props;
    const location = useLocation();
    const queryParams = useQueryParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [openDialogIngredient, setOpenDialogIngredient] = useState<boolean>(false);
    const [openDialogEditIngredient, setOpenDialogEditIngredient] = useState<boolean>(false);
    const [selected, setSelected] = useState<IngredientResponse>();
    const [data, setData] = useState<DataResult>({
        data: [],
        total: 0,
    });
    const history = useHistory();
    const getDefaultQuery = () => {
        // Không hiểu tại sao useQueryParams không dùng đk
        const currentFilter = props.history.location.search as string;
        const dataFromQuery: any = {};
        for (let searchFilter of currentFilter.slice(1).split("&")) {
            const data = searchFilter.split("=");
            dataFromQuery[data[0]] = decodeURIComponent(data[1]);
        }
        const initFilter: IngredientFilterRequest = {
            page: Number(dataFromQuery["page"]) || 1,
            limit: Number(dataFromQuery["limit"]) || undefined,
            query: dataFromQuery["query"] || undefined,
        };
        return initFilter;
    };
    const [filters, setFilters] = useState<IngredientFilterRequest>({
        ...getDefaultQuery(),
    });
    useEffect(() => {
        let filters = getDefaultQuery();
        initData(filters);
    }, [location.search]);
    const changeQueryString = (filters: Record<string, any>) => {
        const queryString = QueryUtils.buildQueryString(filters);
        history.replace({
            search: queryString,
        });
    };
    useEffect(() => {
        document.title = "Danh sách nguyên liệu";
    }, []);

    const initData = async (filters: IngredientFilterRequest) => {
        let res = await IngredientsService.filter(filters);
        if (res.data) setData({
            data: res.data.data?.map((item, index) => {
                return {
                    stt: index + 1,
                    createdBy: item.createdBy,
                    createdOn: item.createdOn,
                    exportPrice: item.exportPrice,
                    id: item.id,
                    modifiedBy: item.modifiedBy,
                    modifiedOn: item.modifiedOn,
                    name: item.name,
                    quantity: item.quantity,
                    status: item.status,
                    stockUnitResponse: item.stockUnitResponse,
                }
            }) || [], total: res.data.metadata?.total || 0
        })
        let data1 =data.data.filter((x)=>x.quantity <10)
        if(data1 && data1.length>0)
        {
            SnackbarUtils.error(`Có nguyên liệu sắp hết hoặc đã hết!`);
        }
        setLoading(false)
    };


    const handlePageChange = (e: GridPageChangeEvent) => {
        setLoading(true)
        const page = e.page;
        const newParams: Record<string, any> = {
            ...Object.fromEntries(queryParams),
            page: page.page,
            limit: page.pageSize,
        };
        setFilters((prev) => ({ ...prev, limit: page.pageSize, page: page.page }))
        changeQueryString(newParams);
    };
    const handleSearch = (value: any) => {
        if (!value || !value?.trim()) {
        }
        const newFilters: IngredientFilterRequest = {
            ...filters,
            page: 1,
            query: value?.trim(),
        };
        setFilters((prev) => ({ ...prev, query: value?.trim() }))
        changeQueryString(newFilters);
    };
    
  const renderStatus = (quantity: number) => {
    let test = 0;
    if(quantity >=10) {
         test = 1
    }
    if(quantity <=10 && quantity >0) {
         test = 2
    }
    if(quantity <=0 ) {
         test = 3
    }

    switch (test) {
      case IngredientsStatus.STOCKING:
        return (
          <Chip
            className="info"
            variant="outlined"
            color="primary"
            size="medium"
            label={IngredientsStatus.getName(test)}
          />
        );
      case IngredientsStatus.OUT_OF_STOCK:
        return (
          <Chip
            className="warning"
            variant="outlined"
            size="medium"
            
            label={IngredientsStatus.getName(test)}
          />
        );
      case IngredientsStatus.DELETED:
        return (
          <Chip
            className="danger"
            size="medium"
            style={{
                background: "linear-gradient(180deg,#ff4d4d,#ff4d4d)",
                borderColor: "#ff4d4d",
                boxShadow: "inset 0 1px 0 0 #ff4d4",
                color: "#fff",
                marginRight: "10px",

              }}
            label={IngredientsStatus.getName(test)}
          />
        );
      default:
        return "";
    }
  };
    return (
        <>
            <Box className={classes.container}>
                <Box className={classes.header}>
                    <Box className={classes.headerItem} display="flex">
                        {""}
                    </Box>
                    <Box className={classes.headerItem}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutline />}
                            onClick={() => {
                                setOpenDialogIngredient(true)
                            }}
                        >
                            {"Thêm nguyên liệu khác"}
                        </Button>
                    </Box>
                </Box>
                <Box className={classes.listBox}>
                    <Box className={classes.utilities}>
                        <Box className={classes.filterAndSearchBox}>
                            <SearchBox
                                placeholder={"Tìm kiếm nguyên liệu ..."}
                                onSubmit={(e, value) => { handleSearch(value) }}
                                value={null}
                                onBlur={(value: any) => {
                                    if (value !== filters.query) handleSearch(value);
                                }}
                                className={classes.searchbox}
                            />
                        </Box>
                    </Box>
                    {loading ? (
                        <LoadingAuth />
                    ) : (
                        <React.Fragment>
                            {data.total > 0 ? (
                                <SapoGrid
                                    data={data}
                                    page={filters?.page}
                                    pageSize={filters?.limit}
                                    onPageChange={handlePageChange}
                                    stickyHeader
                                    tableDrillDown
                                    stickyHeaderTop={52}
                                    onRowClick={(e, data) => { setSelected(data); setOpenDialogEditIngredient(true)}}
                                    disablePaging={false}
                                >
                                    <GridColumn
                                        field="stt"
                                        title={"STT"}
                                        width={80}
                                        align="center"
                                    />
                                    <GridColumn
                                        field="code"
                                        title={getIngredientsQuickFilterLabel(
                                            IngredientsQuickFilterOptions.CODE
                                        )}
                                        width={150}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {"IG" + dataItem.stt}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="name"
                                        title={getIngredientsQuickFilterLabel(
                                            IngredientsQuickFilterOptions.NAME
                                        )}
                                        width={150}
                                        align="left"
                                    />

                                    <GridColumn
                                        field="quantity"
                                        title={getIngredientsQuickFilterLabel(
                                            IngredientsQuickFilterOptions.QUANTITY
                                        )}
                                        width={100}
                                        align="left"
                                    > 
                                    {({ dataItem }: CellTemplateProps) => {
                                        return (
                                            <>
                                                <Typography>
                                                    {dataItem.quantity || 0}
                                                </Typography>
                                            </>
                                        );
                                    }}</GridColumn>
                                    <GridColumn
                                        field="unit"
                                        title={getIngredientsQuickFilterLabel(
                                            IngredientsQuickFilterOptions.UNIT
                                        )}
                                        width={80}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {dataItem.stockUnitResponse?.name}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="exportPrice"
                                        title={getIngredientsQuickFilterLabel(
                                            IngredientsQuickFilterOptions.PRICE
                                        )}
                                        width={100}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {formatMoney(dataItem.exportPrice || 0)}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="createdOn"
                                        title={getIngredientsQuickFilterLabel(
                                            IngredientsQuickFilterOptions.CREATED_ON
                                        )}
                                        width={100}
                                        align="left"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {formatDateUTCToLocalDateString(
                                                            dataItem.createdOn,
                                                            false,
                                                            "DD/MM/YYYY"
                                                        )}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                    <GridColumn
                                        field="status"
                                        title={getIngredientsQuickFilterLabel(
                                            IngredientsQuickFilterOptions.STATUS
                                        )}
                                        width={100}
                                        align="center"
                                    >
                                        {({ dataItem }: CellTemplateProps) => {
                                            return (
                                                <>
                                                    <Typography>
                                                        {renderStatus(
                                                            dataItem.quantity,
                                                            )}
                                                    </Typography>
                                                </>
                                            );
                                        }}
                                    </GridColumn>
                                </SapoGrid>
                            ) : (
                                <NoResultsComponent
                                    message={"Không tìm thấy kết quả"}
                                    helpText={"Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm"}
                                />
                            )}
                        </React.Fragment>
                    )}
                </Box>
            </Box>
            <DialogAddIngredient
                open={openDialogIngredient}
                onClose={() => setOpenDialogIngredient(false)}
                initData={() => {
                    initData(filters);
                }}
            />
            <DialogEditIngredient
             open={openDialogEditIngredient}
             onClose={() => setOpenDialogEditIngredient(false)}
             ingredient={selected}
             initData={() => {
                 initData(filters);
             }}
            />
        </>
    );
};

const mapStateToProps = (state: AppState) => ({
    menuState: state.menu,
    authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(Ingredients));

