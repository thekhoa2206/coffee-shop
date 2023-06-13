import { Box, Typography, withStyles } from "@material-ui/core";
import { AddCircleOutline } from "@material-ui/icons";
import Button from "components/Button";
import LoadingAuth from "components/Loading/LoadingAuth";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import SapoGrid from "components/SapoGrid/SapoGrid";
import {
  DataResult,
  GridPageChangeEvent,
} from "components/SapoGrid/SapoGrid.type";
import { CellTemplateProps } from "components/SapoGridSticky";
import SearchBox from "components/SearchBox/SearchBox";
import useQueryParams from "hocs/useQueryParams";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  IngredientFilterRequest,
  IngredientResponse,
} from "services/IngredientsService";
import { AppState } from "store/store";
import { formatDateUTCToLocalDateString, formatMoney } from "utilities";
import QueryUtils from "utilities/QueryUtils";
import {
  StocktakingReponse,
  StoctakingFilterRequest,
} from "services/StocktakingService/type";
import { ReceiptProps } from "./Receipt.type";
import StocktakingService from "services/StocktakingService/StocktakingService";
import { StocktakingIngredientReponse } from "../../../services/StocktakingService/type";
import {
  ReceiptQuickFilterOptions,
  getReceiptQuickFilterLabel,
} from "./ReceiptFilter.constant";
import styles from "./Receipt.styles";
import Chip from "components/Chip/Chip.component";

const Receipt = (props: ReceiptProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const location = useLocation();
  const queryParams = useQueryParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialogIngredient, setOpenDialogIngredient] =
    useState<boolean>(false);
  const [selected, setSelected] = useState<StocktakingReponse>();
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
    const initFilter: StoctakingFilterRequest = {
      page: Number(dataFromQuery["page"]) || 1,
      limit: Number(dataFromQuery["limit"]) || undefined,
      query: dataFromQuery["query"] || undefined,
      type: "import",
    };
    return initFilter;
  };
  const [filters, setFilters] = useState<StoctakingFilterRequest>({
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

  const initData = async (filters: StoctakingFilterRequest) => {
    let res = await StocktakingService.filter(filters);
    if (res.data)
      setData({
        data:
          res.data.data?.map((receipt, index) => {
            return {
              stt: index + 1,
              createdBy: receipt.createdBy,
              createdOn: receipt.createdOn,
              description: receipt.description,
              id: receipt.id,
              modifiedBy: receipt.modifiedBy,
              modifiedOn: receipt.modifiedOn,
              name: receipt.name,
              totalMoney: receipt.totalMoney,
              status: receipt.status,
              type: receipt.type,
              code:receipt.code,
            };
          }) || [],
        total: res.data.metadata?.total || 0,
      });
    setLoading(false);
    
  };

  const handlePageChange = (e: GridPageChangeEvent) => {
    setLoading(true);
    const page = e.page;
    const newParams: Record<string, any> = {
      ...Object.fromEntries(queryParams),
      page: page.page,
      limit: page.pageSize,
    };
    setFilters((prev) => ({ ...prev, limit: page.pageSize, page: page.page }));
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
    setFilters((prev) => ({ ...prev, query: value?.trim() }));
    changeQueryString(newFilters);
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
                history.push("/admin/receipts/create");
              }}
            >
              {"tạo phiếu nhập"}
            </Button>
          </Box>
        </Box>
        <Box className={classes.listBox}>
          <Box className={classes.utilities}>
            <Box className={classes.filterAndSearchBox}>
              <SearchBox
                placeholder={"Tìm kiếm nguyên liệu ..."}
                onSubmit={(e, value) => {
                  handleSearch(value);
                }}
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
                console.log("66",data),
                <SapoGrid
                  data={data}
                  page={filters?.page}
                  pageSize={filters?.limit}
                  onPageChange={handlePageChange}
                  stickyHeader
                  tableDrillDown
                  stickyHeaderTop={52}
                  onRowClick={(e, data) => {
                    setSelected(data);
                    setOpenDialogIngredient(true);
                  }}
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
                    title={getReceiptQuickFilterLabel(
                      ReceiptQuickFilterOptions.CODE
                    )}
                    width={150}
                    align="left"
                  >

                  </GridColumn>
                  <GridColumn
                    field="name"
                    title={getReceiptQuickFilterLabel(
                      ReceiptQuickFilterOptions.NAME
                    )}
                    width={150}
                    align="left"
                  />

                  <GridColumn
                    field="type"
                    title={getReceiptQuickFilterLabel(
                      ReceiptQuickFilterOptions.TYPE
                    )}
                    width={150}
                    align="left"
                  >
                  
                  </GridColumn>
                  <GridColumn
                    field="totalMoney"
                    title={getReceiptQuickFilterLabel(
                      ReceiptQuickFilterOptions.PRICE
                    )}
                    width={100}
                    align="left"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      return (
                        <>
                          <Typography>
                            {formatMoney(dataItem.totalMoney || 0)}
                          </Typography>
                        </>
                      );
                    }}
                  </GridColumn>
                  <GridColumn
                    field="createdOn"
                    title={getReceiptQuickFilterLabel(
                      ReceiptQuickFilterOptions.CREATED_ON
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
                    field="modifedOn"
                    title={getReceiptQuickFilterLabel(
                      ReceiptQuickFilterOptions.STATUS
                    )}
                    width={100}
                    align="left"
                  >
                    {({ dataItem }: CellTemplateProps) => {
                      if( dataItem.status === "Nhập kho"){ 
                        return (
                          <>
                        <Chip variant="outlined" size="small" label={dataItem.status} className="info" />
                        </>
                      )}  
                      if(dataItem.status === "Đặt hàng"){
                      return (
                        <>
                      <Chip variant="outlined" size="small" label={dataItem.status} className="success" />
                      </>)
                     }
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
      {/* <DialogAddIngredient
                open={openDialogIngredient}
                onClose={() => setOpenDialogIngredient(false)}
                ingredient={selected}
                initData={() => {
                    initData(filters);
                }}
            /> */}
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(Receipt));
