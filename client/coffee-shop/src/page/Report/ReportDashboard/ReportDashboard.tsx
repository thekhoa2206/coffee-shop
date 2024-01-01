import { Box, Grid, Typography, withStyles } from "@material-ui/core";
import { DataResult } from "components/SapoGrid/SapoGrid.type";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { IOInventoryFilter, InventoryFilterModel } from "services/InventoryService/types";
import { AppState } from "store/store";
import { formatDateTime, formatDateUTC, formatMoney } from "utilities";
import { DateRangesPredefineType, convertPredefinedToDate, getNameAndDatePredefined, getNamePredefinedDate } from "utilities/DateRangesPredefine";
import useStyles from "./ReportDashboard.styles";
import { ReportDashboardProps } from "./ReportDashboard.types";
import Button from "components/Button";
import FilterDatePredefined from "components/SapoFilter/FilterItemsV2/FilterItems/FilterDatePredefined/FilterDatePredefined";
import CircularProgress from "components/Loading/CircularProgress";
import InventoryService from "services/InventoryService/InventoryService";
import ReportOrderService, { ReportSaleResponse } from "services/ReportOrderService";

const ReportDashboard = (props: ReportDashboardProps & PropsFromRedux) => {
    const { classes, authState } = props;
    const [data, setData] = useState<DataResult>({
        data: [],
        total: 0,
    });
    const [reportSale, setReportSale] = useState<ReportSaleResponse>();
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
        initData(filters)
    }, [location.search]);

    const initData = async (filters?: IOInventoryFilter) => {
        if (filters?.createdOnPredefined) {
            let newDateCreatedOn = convertPredefinedToDate(filters?.createdOnPredefined);
            filters.startDate = formatDateUTC(newDateCreatedOn.startDate, false);
            filters.endDate = formatDateUTC(newDateCreatedOn.endDate, true);
          }
        initDataOnHand(filters);
        initDataOrder(filters)
    }
    const initDataOnHand = async (filters?: IOInventoryFilter) => {
        var res = await InventoryService.onHand(filters);

        setLoading(false);
    };

    const initDataOrder = async (filters?: IOInventoryFilter) => {
        var res = await ReportOrderService.reportSale(filters);
        if (res.data) {
            setReportSale(res.data);
        }
        setLoading(false);
    }
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
                        <Box>
                            <CircularProgress size={30} />
                        </Box>
                    ) : (
                        <React.Fragment>
                            {/* Báo cáo bán hàng */}
                            <Box
                                style={{
                                    display: "flex",
                                    marginBottom: 24,
                                }}
                            >
                                <Grid
                                    item
                                    xs={6}
                                    md={4}
                                    style={{
                                        width: "calc((100% - 60px) / 4)",
                                        marginRight: 20,
                                        height: 100,
                                        background: "#FFFFFF",
                                        borderRadius: 3,
                                        boxShadow: "0 2px 4px hsla(0,0%,66%,.25)",
                                        padding: 20,
                                        borderLeft: "5px solid rgb(244, 148, 35)",
                                    }}
                                >
                                    <Box style={{ padding: 6 }}>
                                        <Typography style={{ color: "rgb(244, 148, 35)" }}>
                                            Tổng số đơn hàng ({reportSale?.quantityOrder || 0})
                                        </Typography>
                                        <Typography style={{ fontSize: 24, marginTop: 10 }}>
                                            {formatMoney(reportSale?.totalOrder || 0)} đ
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    md={4}
                                    style={{
                                        width: "calc((100% - 60px) / 4)",
                                        height: 100,
                                        marginRight: 20,
                                        background: "#FFFFFF",
                                        borderRadius: 3,
                                        boxShadow: "0 2px 4px hsla(0,0%,66%,.25)",
                                        padding: 20,
                                        borderLeft: "5px solid rgb(41, 164, 182)",
                                    }}
                                >
                                    <Box style={{ padding: 6 }}>
                                        <Typography style={{ color: "rgb(41, 164, 182)" }}>
                                            Số đơn hàng huỷ ({reportSale?.quantityOrderCancel || 0})
                                        </Typography>
                                        <Typography style={{ fontSize: 24, marginTop: 10 }}>
                                            {formatMoney(reportSale?.totalOrderCancel || 0)} đ
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    md={4}
                                    style={{
                                        width: "calc((100% - 60px) / 4)",
                                        height: 100,
                                        marginRight: 20,
                                        background: "#FFFFFF",
                                        borderRadius: 3,
                                        boxShadow: "0 2px 4px hsla(0,0%,66%,.25)",
                                        padding: 20,
                                        borderLeft: "5px solid rgb(118, 64, 239)",
                                    }}
                                >
                                    <Box style={{ padding: 6 }}>
                                        <Typography style={{ color: "rgb(118, 64, 239)" }}>
                                            Tổng giá trị nguyên liệu đã sử dụng
                                        </Typography>
                                        <Typography style={{ fontSize: 24, marginTop: 10 }}>
                                            {formatMoney(reportSale?.totalIngredient || 0)} đ
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    md={4}
                                    style={{
                                        width: "calc((100% - 60px) / 4)",
                                        height: 100,
                                        background: "#FFFFFF",
                                        borderRadius: 3,
                                        boxShadow: "0 2px 4px hsla(0,0%,66%,.25)",
                                        padding: 20,
                                        borderLeft: "5px solid rgb(244, 98, 141)",
                                    }}
                                >
                                    <Box style={{ padding: 6 }}>
                                        <Typography style={{ color: "rgb(244, 98, 141)" }}>
                                            Tổng nguyên liệu bị huỷ
                                        </Typography>
                                        <Typography style={{ fontSize: 24, marginTop: 10 }}>
                                            {formatMoney(reportSale?.totalIngredientCancel || 0) }đ
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Box>

                            {/* Báo cáo tồn kho */}
                            <Box>

                            </Box>
                            {/* Báo cáo nhập xuất */}
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
export default connect(mapStateToProps, {})(withStyles(useStyles)(ReportDashboard));

