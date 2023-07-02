
import { Box, MenuItem, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Fragment } from "react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "store/store";
import styles from "./ReportTopCustomer.styles";
import { ReportTopCustomerProps } from "./ReportTopCustomer.types";
import Select from "components/Select/Index";
import { DateRangeType, GetListDateRange, GetNameDateRangeType } from "utilities/DateRangeType";
import moment from "moment";
import CircularProgress from "components/Loading/CircularProgress";
import { ReportCustomerResponse, ReportProductFilter, ReportProductResponse } from "services/ReportOrderService";
import ReportOrderService from "services/ReportOrderService/ReportOrderService";
import TopItemComponent from "./TopItemComponent/TopItem.component";

const ReportTopCustomer = (props: ReportTopCustomerProps) => {
    const { classes } = props;
    const [dateRange, setDateRange] = useState(DateRangeType.DAY_LAST_7);
    const [listTopCustomer, setListTopCustomer] = useState<ReportCustomerResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState<ReportProductFilter>({
        createdOnMin: moment(new Date()).startOf("day").subtract(6, "days").format("YYYY-MM-DDTHH:mm:ss[Z]"),
        createdOnMax: moment(new Date()).startOf("day").format("YYYY-MM-DDTHH:mm:ss[Z]"),
        limit: 1000,
        page: 1,
        top: 5,
    });

    const convertDateDateRangeToDateTime = (range: string) => {
        let startDate = filter.created_on_min;
        let endDate = filter.created_on_max;
        if (range === DateRangeType.YESTERDAY) {
            startDate = endDate = moment(new Date()).startOf("day").subtract(1, "days").format("YYYY-MM-DDTHH:mm:ss[Z]");
        } else if (range === DateRangeType.TODAY) {
            startDate = endDate = moment(new Date()).startOf("day").format("YYYY-MM-DDTHH:mm:ss[Z]");
        } else if (range === DateRangeType.DAY_LAST_7) {
            startDate = moment(new Date()).startOf("day").subtract(6, "days").format("YYYY-MM-DDTHH:mm:ss[Z]");
            endDate = moment(new Date()).startOf("day").format("YYYY-MM-DDTHH:mm:ss[Z]");
        } else if (range === DateRangeType.THIS_MONTH) {
            startDate = moment(new Date()).startOf("month").format("YYYY-MM-DDTHH:mm:ss[Z]");
            endDate = moment(new Date()).startOf("day").format("YYYY-MM-DDTHH:mm:ss[Z]");
        } else if (range === DateRangeType.LAST_MONTH) {
            startDate = moment(new Date()).subtract(1, "months").startOf("month").format("YYYY-MM-DDTHH:mm:ss[Z]");
            endDate = moment(new Date()).subtract(1, "months").endOf("month").startOf("day").format("YYYY-MM-DDTHH:mm:ss[Z]");
        } else if (range === DateRangeType.THIS_YEAR) {
            startDate = moment(new Date()).startOf("year").format("YYYY-MM-DDTHH:mm:ss[Z]");
            endDate = moment(new Date()).startOf("day").format("YYYY-MM-DDTHH:mm:ss[Z]");
        } else if (range === DateRangeType.LAST_YEAR) {
            startDate = moment(new Date()).subtract(1, "years").startOf("year").format("YYYY-MM-DDTHH:mm:ss[Z]");
            endDate = moment(new Date()).subtract(1, "years").endOf("year").startOf("day").format("YYYY-MM-DDTHH:mm:ss[Z]");
        }
        setFilter({
            ...filter,
            createdOnMin: startDate,
            createdOnMax: endDate,
        });
    };

    const handleChangeTime = (event: React.ChangeEvent<{ value: string }>) => {
        setDateRange(event.target.value);
        convertDateDateRangeToDateTime(event.target.value);
    };
    useEffect(() => {
        initData();
    }, [filter])
    const initData = async () => {
        let res = await ReportOrderService.getReportTopCustomer(filter);
        if (res.data) {
            if (res.data) {
                setLoading(false)
                setListTopCustomer(res.data.data || []);
            }
        }
    }
    return <Fragment>
        <Box className={classes.root} borderRadius="3px" style={{ marginTop: 30, marginBottom: 50 }}>
            <Box className="box-title" style={{display: "flex", marginLeft: 20}}>
                <Typography variant="h6" style={{marginTop: 20}}>TOP KHÁCH HÀNG MUA HÀNG</Typography>
                <Box className="header-group-button" style={{marginTop: 10, marginLeft: "auto", marginRight: 10}}>
                    <Select
                        className={classes.selectDateRange}
                        value={dateRange}
                        onChange={(event: React.ChangeEvent<{ value: any }>) => {
                            handleChangeTime(event);
                        }}
                    >
                        {GetListDateRange.map((item) => (
                            <MenuItem value={item} key={item}>
                                {GetNameDateRangeType(item)}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>
            {loading ? (
                <Box height="280px">
                    <CircularProgress size={30} />
                </Box>
            ) : (
                <Box className={classes.topSaleList}>
                    {listTopCustomer && listTopCustomer.length > 0 ? (
                        listTopCustomer.map(
                            (item, index) =>
                                item && <TopItemComponent item={item} index={index + 1} key={index}/>
                        )
                    ) : (
                        <Box className={classes.boxNoDataProduct}>
                            <Typography variant="subtitle1" color="secondary" style={{ marginTop: "10px" }}>
                                Không có dữ liệu
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    </Fragment>;
};

const mapStateToProps = (state: AppState) => ({
    authContext: state.auth,
});
export default connect(mapStateToProps)(withStyles(styles)(ReportTopCustomer));