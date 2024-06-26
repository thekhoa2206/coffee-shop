import { Box, Typography, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { AppState } from "store/store";
import useStyles from "../ReportInventory.styles";
import { ReportInventoryProps } from "../ReportInventory.types";
import { DataResult, GridPageChangeEvent } from "components/SapoGrid/SapoGrid.type";
import { useHistory, useParams } from "react-router-dom";
import { IOInventoryFilter, InventoryFilterModel, ReportInventoryRequest } from "services/InventoryService/types";
import InventoryService from "services/InventoryService/InventoryService";
import LoadingAuth from "components/Loading/LoadingAuth";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import { ReportInventoryDetailQuickFilterOptions, ReportInventoryQuickFilterOptions, getReportInventoryDetailQuickFilterLabel, getReportInventoryQuickFilterLabel } from "../ReportInventoryFilter.constant";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { CellTemplateProps } from "components/SapoGridSticky";
import { formatDateTime, formatDateUTC, formatDateUTCToLocalDateString, formatMoney } from "utilities";
import DatePicker from "components/DatePicker/DatePicker.component";
import FilterDatePredefined from "components/SapoFilter/FilterItemsV2/FilterItems/FilterDatePredefined/FilterDatePredefined";
import { DateRangesPredefineType, convertPredefinedToDate, getNameAndDatePredefined, getNamePredefinedDate } from "utilities/DateRangesPredefine";
import { cloneDeep } from "lodash";
import QueryUtils from "utilities/QueryUtils";
import Button from "components/Button";
import { ReportDetailInventoryProps } from "./ReportDetailInventory.types";
import { log } from "console";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";

const ReportInventoryDeatail = (props: ReportDetailInventoryProps & PropsFromRedux) => {
  const { classes, authState,filter} = props;
  const [data, setData] = useState<DataResult>({
    data: [],
    total: 0,
  });
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  // Không hiểu tại sao useQueryParams không dùng đk
  const currentFilter = props.history.location.search as string;
  const dataFromQuery: any = {};
  const [ingredientName, setIngredientName] = useState<string>(); 
  const [loading, setLoading] = useState<boolean>(true);
  const getDefaultQuery = () => {
    for (let searchFilter of currentFilter.slice(1).split("&")) {
      const data = searchFilter.split("=");
      dataFromQuery[data[0]] = decodeURIComponent(data[1]);
    }
    if(filters?.createdOnPredefined){
    let newDateCreatedOn = convertPredefinedToDate(filters.createdOnPredefined);
    const initFilter: IOInventoryFilter = {
      startDate : formatDateUTC(newDateCreatedOn.startDate, false),
      endDate :formatDateUTC(newDateCreatedOn.endDate, true),
    }
    return initFilter;
  };
  };
  const [filterModel, setFilterModel] = useState<InventoryFilterModel | null>({
    createdOnPredefined:"today"
  });
  const [filters, setFilters] = useState<IOInventoryFilter>({
    createdOnPredefined:"today"
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
  const initData = async (filters?: IOInventoryFilter) => {
    let _filters = cloneDeep(filters);
    if (_filters?.createdOnPredefined) {
        let newDateCreatedOn = convertPredefinedToDate(_filters?.createdOnPredefined);
        _filters.startDate = formatDateUTC(newDateCreatedOn.startDate, false);
        _filters.endDate = formatDateUTC(newDateCreatedOn.endDate, true);
    }
    let res = await InventoryService.detail(_filters,id);
    console.log("data",res.data.stockEvents)
    
    if (res.data)
      setIngredientName(res.data.ingredientName)
      setData({
        data:
        res.data.stockEvents.data?.map((inventory, index) => {
            return {
              stt: index + 1,
              amountChargeInUnit: inventory.amountChargeInUnit,
              createdOn: inventory.createdOn,
              objectId: inventory.objectId,
              name: inventory.name,
              code: inventory.code,
              type: inventory.type,
              notes: inventory.notes,
              stockRemain:inventory.stockRemain
            };
          }) || [],
        total: res.data.stockEvents.metadata?.total || 0,
      });
      SnackbarUtils.success("Cập nhập báo cáo thàng công");
    setLoading(false);
  };

  const handlePageChange = (e: GridPageChangeEvent) => {
    setLoading(true);
    const page = e.page;
    setFilters((prev) => ({ ...prev, limit: page.pageSize, page: page.page }));
  };
  const handlePush = (id: number,type:string)=>{
    if(type.includes("Đơn hàng") || type.includes("Huỷ đơn hàng")){
      window.open(`/admin/orders/${id}`, '_blank');
    }
    else{
      if(type.includes("Phiếu Nhập kho")|| type.includes("Huỷ phiếu nhập kho")){
        window.open(`/admin/receipts/${id}/edit`, '_blank');
      }
      else{
        window.open(`/admin/exports/${id}/edit`);
      }
    }
 }
  return (
    <>
      <Box className={classes.container}>
      <Box style={{ marginBottom: 24 }}>
      <Box style={{ marginTop: 24, marginBottom: 12 }}>
          <Typography variant="h3" style={{}}>Nguyên Liệu: {ingredientName? ingredientName : "--"} </Typography>
              </Box>
        <Box display="flex" style={{ marginTop: 24, marginBottom: 50 }}>
        <FilterDatePredefined
                    label={"Ngày tạo phiếu"}
                    placeholder={"Chọn ngày tạo"}
                    ranges={[
                        {
                            key: DateRangesPredefineType.TODAY,
                            label: getNamePredefinedDate(DateRangesPredefineType.TODAY),
                        },
                        {
                            key: DateRangesPredefineType.YESTERDAY,
                            label: getNamePredefinedDate(DateRangesPredefineType.YESTERDAY),
                        },
                        {
                            key: DateRangesPredefineType.THIS_WEEK,
                            label: getNamePredefinedDate(DateRangesPredefineType.THIS_WEEK),
                        },
                        {
                            key: DateRangesPredefineType.LAST_WEEK,
                            label: getNamePredefinedDate(DateRangesPredefineType.LAST_WEEK),
                        },
                        {
                            key: DateRangesPredefineType.THIS_MONTH,
                            label: getNamePredefinedDate(DateRangesPredefineType.THIS_MONTH),
                        },
                        {
                            key: DateRangesPredefineType.LAST_MONTH,
                            label: getNamePredefinedDate(DateRangesPredefineType.LAST_MONTH),
                        },
                    ]}
                    endDate={filterModel?.endDate}
                    startDate={filterModel?.startDate}
                    predefinedDate={filters?.createdOnPredefined}
                    onSubmit={(predefinedDate, dateRanges) => {
                        let _startDate: any = null;
                        let _endDate: any = null;
                        let _predefinedDate = "";
                        if (predefinedDate) {
                            _predefinedDate = predefinedDate;
                        } else if (dateRanges) {
                            _startDate = dateRanges.startDate;
                            _endDate = dateRanges.endDate;
                        }
                        setFilters((prev) => ({
                            ...prev,
                            startDate: _startDate ? formatDateUTC(_startDate, false) : undefined,
                            endDate: _endDate ? formatDateUTC(_endDate, true) : undefined,
                            createdOnPredefined: _predefinedDate || undefined,
                        }));
                        setFilterModel((prev) => ({
                          ...prev,
                          startDate: dateRanges?.startDate,
                          endDate: dateRanges?.endDate,
                          createdOnPredefined: _predefinedDate || undefined,
                      }));

                    }}
                />
                        <Button variant="contained" color="primary" style={{ height: 40, marginTop: 24, marginLeft: 24 }}
         onClick={()=>initData(filters)}>Xem báo cáo</Button>
        </Box>

                   <Box style={{ marginTop: "-45px" }}>
            {filterModel?.createdOnPredefined ?
              <Typography style={{ fontStyle: "italic", color: "#747C87" }}>Thời gian xem: {getNameAndDatePredefined(filterModel.createdOnPredefined)}</Typography> :
              <Box>
                <Typography style={{ fontStyle: "italic", color: "#747C87" }}>Thời gian xem: {filterModel?.endDate ? formatDateTime(filterModel.endDate, "DD-MM-YYYY HH:mm") : "---"} - {filterModel?.startDate ? formatDateTime(filterModel.startDate, "DD-MM-YYYY HH:mm") : "---"} </Typography>
              </Box>
            }
          </Box>
          </Box>
        <Box className={classes.listBox}>
          {loading ? (
            <LoadingAuth />
          ) : (
            <React.Fragment>
              {data.total > 0 ? (
                (console.log("66", data),
                  (
                    <SapoGrid
                      data={data}
                      page={filters?.page}
                      pageSize={filters?.limit}
                      onPageChange={handlePageChange}
                      stickyHeader
                      tableDrillDown
                      stickyHeaderTop={52}
                      onRowClick={(e, data) => { handlePush(data.objectId,data.type)}}
                      disablePaging={false}
                    >
                      <GridColumn
                        field="stt"
                        title={"STT"}
                        width={80}
                        align="center"
                      />
                      <GridColumn
                        field="createdOn"
                        title={getReportInventoryDetailQuickFilterLabel(
                          ReportInventoryDetailQuickFilterOptions.CREATEON
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
                        field="code"
                        title={getReportInventoryDetailQuickFilterLabel(
                          ReportInventoryDetailQuickFilterOptions.CODE
                        )}
                        width={150}
                        align="left"
                      >{({ dataItem }: CellTemplateProps) => {
                        return (
                          <>
                            <Typography style={{color:"#68B5FD"}}>
                              {dataItem.code || 0}
                            </Typography>
                          </>
                        );
                      }}</GridColumn>
                                 <GridColumn
                        field="type"
                        title={getReportInventoryDetailQuickFilterLabel(
                          ReportInventoryDetailQuickFilterOptions.TYPE
                        )}
                        width={150}
                        align="left"
                      ></GridColumn>
                      <GridColumn
                        field="amountChargeInUnit"
                        title={getReportInventoryDetailQuickFilterLabel(
                          ReportInventoryDetailQuickFilterOptions.AMOUTCHARGEINUNIT
                        )}
                        width={100}
                        align="center"
                      >
                        {({ dataItem }: CellTemplateProps) => {
                          return (
                            <>
                              <Typography>
                                {dataItem.amountChargeInUnit || 0}
                              </Typography>
                            </>
                          );
                        }}
                      </GridColumn>
                      <GridColumn
                        field="stockRemain"
                        title={getReportInventoryDetailQuickFilterLabel(
                          ReportInventoryDetailQuickFilterOptions.STOCKREMAIN
                        )}
                        width={60}
                        align="right"
                      >
                        {({ dataItem }: CellTemplateProps) => {
                        return (
                          <>
                            <Typography>
                              {dataItem.stockRemain || 0}
                            </Typography>
                          </>
                        );}}
                      </GridColumn>
                    </SapoGrid>
                  ))
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
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  menuState: state.menu,
  authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(useStyles)(ReportInventoryDeatail));

