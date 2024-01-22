import { Box, Typography, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { AppState } from "store/store";
import useStyles from "./ReportInventory.styles";
import { ReportInventoryProps } from "./ReportInventory.types";
import { DataResult, GridPageChangeEvent } from "components/SapoGrid/SapoGrid.type";
import { useHistory } from "react-router-dom";
import { IOInventoryFilter, InventoryFilterModel, ReportInventoryRequest } from "services/InventoryService/types";
import InventoryService from "services/InventoryService/InventoryService";
import LoadingAuth from "components/Loading/LoadingAuth";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import { ReportInventoryQuickFilterOptions, getReportInventoryQuickFilterLabel } from "./ReportInventoryFilter.constant";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { CellTemplateProps } from "components/SapoGridSticky";
import { formatDateTime, formatDateUTC, formatMoney } from "utilities";
import DatePicker from "components/DatePicker/DatePicker.component";
import FilterDatePredefined from "components/SapoFilter/FilterItemsV2/FilterItems/FilterDatePredefined/FilterDatePredefined";
import { DateRangesPredefineType, convertPredefinedToDate, getNameAndDatePredefined, getNamePredefinedDate } from "utilities/DateRangesPredefine";
import { cloneDeep } from "lodash";
import Button from "components/Button";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
const ReportInventory = (props: ReportInventoryProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const [data, setData] = useState<DataResult>({
    data: [],
    total: 0,
  });
  const history = useHistory();
  // Không hiểu tại sao useQueryParams không dùng đk
  const dataFromQuery: any = {};
  const [loading, setLoading] = useState<boolean>(true);
  const getDefaultQuery = () => {
    if (filters?.createdOnPredefined) {
      let newDateCreatedOn = convertPredefinedToDate(filters.createdOnPredefined);
      const initFilter: IOInventoryFilter = {
        startDate: formatDateUTC(newDateCreatedOn.startDate, false),
        endDate: formatDateUTC(newDateCreatedOn.endDate, true),
      }
      return initFilter;
    };
  };
  const [filterModel, setFilterModel] = useState<InventoryFilterModel | null>({
    createdOnPredefined: "today",
  });
  const [filters, setFilters] = useState<IOInventoryFilter>({
    createdOnPredefined: "today"
  });
  useEffect(() => {
    let filters = getDefaultQuery();
    initData(filters);
  }, [location.search]);

  const initData = async (filters?: IOInventoryFilter) => {
    let _filters = cloneDeep(filters);
    if (_filters?.createdOnPredefined) {
      let newDateCreatedOn = convertPredefinedToDate(_filters?.createdOnPredefined);
      _filters.startDate = formatDateUTC(newDateCreatedOn.startDate, true);
      _filters.endDate = formatDateUTC(newDateCreatedOn.endDate, true);
    }
    let res = await InventoryService.filter(_filters);
    if (res.data)
      setData({
        data:
          res.data.data?.map((inventory, index) => {
            return {
              stt: index + 1,
              ingredientName: inventory.ingredientName,
              id: inventory.ingredientId,
              startAmount: inventory.startAmount,
              endAmount: inventory.endAmount,
              amountDecrease: inventory.amountDecrease,
              amountIncrease: inventory.amountIncrease,
              amountPurchase: inventory.amountPurchase,
              unitName: inventory.unitName,
              totalCode: inventory.totalCode,

            };
          }) || [],
        total: res.data.metadata?.total || 0,
      });
      SnackbarUtils.success("Cập nhập báo cáo thàng công");
    setLoading(false);
  };

  const handlePageChange = (e: GridPageChangeEvent) => {
    setLoading(true);
    const page = e.page;
    // const newParams: Record<string, any> = {
    //   ...Object.fromEntries(queryParams),
    //   page: page.page,
    //   limit: page.pageSize,
    // };
    setFilters((prev) => ({ ...prev, limit: page.pageSize, page: page.page }));
  };

  return (
    <>
      <Box className={classes.container}>
        <Box style={{ marginBottom: 24 }}>
          <Box display="flex" style={{ marginTop: 24, marginBottom: 50 }}>
            <FilterDatePredefined
              label={"Thời gian"}
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
              onClick={() => initData(filters)}>Xem báo cáo</Button>
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
                      onRowClick={(e, data) => { history.push(`/admin/report/inventory/${data.id}`) }}
                      disablePaging={false}
                    >
                      <GridColumn
                        field="stt"
                        title={"STT"}
                        width={80}
                        align="center"
                      />
                      <GridColumn
                        field="ingredientName"
                        title={getReportInventoryQuickFilterLabel(
                          ReportInventoryQuickFilterOptions.NAME
                        )}
                        width={100}
                        align="left"
                      ></GridColumn>
                      <GridColumn
                        field="unitName"
                        title={getReportInventoryQuickFilterLabel(
                          ReportInventoryQuickFilterOptions.UNITNAME
                        )}
                        width={60}
                        align="left"
                      ></GridColumn>
                      <GridColumn
                        field="startAmount"
                        title={getReportInventoryQuickFilterLabel(
                          ReportInventoryQuickFilterOptions.STARTAMOUNT
                        )}
                        width={150}
                        align="right"
                      >
                        {({ dataItem }: CellTemplateProps) => {
                          return (
                            <>
                              <Typography>
                                {dataItem.startAmount || 0}
                              </Typography>
                            </>
                          );
                        }}
                      </GridColumn>
                      <GridColumn
                        field="amountDecrease"
                        title={getReportInventoryQuickFilterLabel(
                          ReportInventoryQuickFilterOptions.AMOUNTDECREASE
                        )}
                        width={100}
                        align="right"
                      >
                        {({ dataItem }: CellTemplateProps) => {
                          return (
                            <>
                              <Typography>
                                {dataItem.amountDecrease || 0}
                              </Typography>
                            </>
                          );
                        }}
                      </GridColumn>
                      <GridColumn
                        field="amountIncrease"
                        title={getReportInventoryQuickFilterLabel(
                          ReportInventoryQuickFilterOptions.AMOUNTINCREASE
                        )}
                        width={100}
                        align="right"
                      >
                        {({ dataItem }: CellTemplateProps) => {
                          return (
                            <>
                              <Typography>
                                {dataItem.amountIncrease || 0}
                              </Typography>
                            </>
                          );
                        }}
                      </GridColumn>
                      <GridColumn
                        field="amountPurchase"
                        title={getReportInventoryQuickFilterLabel(
                          ReportInventoryQuickFilterOptions.AMOUNTPUSRCHASE
                        )}
                        width={100}
                        align="right"
                      >
                        {({ dataItem }: CellTemplateProps) => {
                          return (
                            <>
                              <Typography>
                                {dataItem.amountPurchase || 0}
                              </Typography>
                            </>
                          );
                        }}
                      </GridColumn>
                      <GridColumn
                        field="endAmount"
                        title={getReportInventoryQuickFilterLabel(
                          ReportInventoryQuickFilterOptions.ENDAMOUNT
                        )}
                        width={100}
                        align="right"
                      >
                        {({ dataItem }: CellTemplateProps) => {
                          return (
                            <>
                              <Typography>
                                {dataItem.endAmount || 0}
                              </Typography>
                            </>
                          );
                        }}
                      </GridColumn>

                      <GridColumn
                        field="totalCode"
                        title={getReportInventoryQuickFilterLabel(
                          ReportInventoryQuickFilterOptions.TOTALCODE
                        )}
                        width={150}
                        align="right"
                      >
                        {({ dataItem }: CellTemplateProps) => {
                          return (
                            <>
                              <Typography>
                                {formatMoney(dataItem.totalCode || 0)}
                              </Typography>
                            </>
                          );
                        }}
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
export default connect(mapStateToProps, {})(withStyles(useStyles)(ReportInventory));

