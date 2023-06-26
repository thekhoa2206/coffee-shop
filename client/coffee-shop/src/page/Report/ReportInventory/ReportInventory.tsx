import { Box, Typography, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { AppState } from "store/store";
import useStyles from "./ReportInventory.styles";
import { ReportInventoryProps } from "./ReportInventory.types";
import { DataResult, GridPageChangeEvent } from "components/SapoGrid/SapoGrid.type";
import { useHistory } from "react-router-dom";
import { ReportInventoryRequest } from "services/InventoryService/types";
import InventoryService from "services/InventoryService/InventoryService";
import LoadingAuth from "components/Loading/LoadingAuth";
import SapoGrid from "components/SapoGrid/SapoGrid";
import { GridColumn } from "components/SapoGrid/GridColumn/GridColumn";
import { ReportInventoryQuickFilterOptions, getReportInventoryQuickFilterLabel } from "./ReportInventoryFilter.constant";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import { CellTemplateProps } from "components/SapoGridSticky";
import { formatDateUTC, formatMoney } from "utilities";
import DatePicker from "components/DatePicker/DatePicker.component";
import FilterDatePredefined from "components/SapoFilter/FilterItemsV2/FilterItems/FilterDatePredefined/FilterDatePredefined";
import { DateRangesPredefineType, convertPredefinedToDate, getNamePredefinedDate } from "utilities/DateRangesPredefine";

const ReportInventory = (props: ReportInventoryProps & PropsFromRedux) => {
  const { classes, authState } = props;
  const [data, setData] = useState<DataResult>({
    data: [],
    total: 0,
  });
  const history = useHistory();
  // Không hiểu tại sao useQueryParams không dùng đk
  const currentFilter = props.history.location.search as string;
  const dataFromQuery: any = {};
  const [loading, setLoading] = useState<boolean>(true);
  const getDefaultQuery = () => {
    for (let searchFilter of currentFilter.slice(1).split("&")) {
      const data = searchFilter.split("=");
      dataFromQuery[data[0]] = decodeURIComponent(data[1]);
    }
    if(filters.createdOnPredefined){
    let newDateCreatedOn = convertPredefinedToDate(filters.createdOnPredefined);
    const initFilter: ReportInventoryRequest = {
      page: Number(dataFromQuery["page"]) || 1,
      limit: Number(dataFromQuery["limit"]) || undefined,
      startDate : formatDateUTC(newDateCreatedOn.startDate, false),
      endDate :formatDateUTC(newDateCreatedOn.endDate, true),
    }


    return initFilter;
  };
  };
  const [filters, setFilters] = useState<ReportInventoryRequest>({
    ...getDefaultQuery(),
  });
  useEffect(() => {
    let filters = getDefaultQuery();
    initData(filters);
  }, [location.search]);
  const initData = async (filters: ReportInventoryRequest) => {
    let res = await InventoryService.filter(filters);
    if (res.data)
      setData({
        data:
          res.data.data?.map((inventory, index) => {
            return {
              stt: index + 1,
              ingredientName: inventory.ingredientName,
              ingredientId: inventory.ingredientId,
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
        <Box className={classes.header}>
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
                    endDate={filters.endDate}
                    startDate={filters.startDate}
                    predefinedDate={filters.createdOnPredefined}
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
                    }}
                />
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
                      onRowClick={(e, data) => { history.push(`/admin/exports/${data.id}/edit`) }}
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

