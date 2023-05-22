
import { Box, MenuItem, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Fragment } from "react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "store/store";
import styles from "./TopShipperStore.styles";
import { TopShipperStoreProps } from "./TopShipperStore.types";
import Select from "components/Select/Index";
import { DateRangeType, GetListDateRange, GetNameDateRangeType } from "utilities/DateRangeType";
import OrdersService, { AccountAnalyticsTopShipper, AnalyticsCODShipperResponse, OrdersFilter } from "services/OrdersService";
import moment from "moment";
import TopItemComponent from "./TopItemComponent/TopItem.component";
import CircularProgress from "components/Loading/CircularProgress";

const TopShipperStore = (props: TopShipperStoreProps) => {
    const { classes, authContext } = props;
    const [dateRange, setDateRange] = useState(DateRangeType.DAY_LAST_7);
    const [listTopShipper, setListTopShipper] = useState<AccountAnalyticsTopShipper[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterTopShipper, setFilterTopShipper] = useState<OrdersFilter>({
        created_on_min: moment(new Date()).startOf("day").subtract(6, "days").format("YYYY-MM-DDTHH:mm:ss[Z]"),
        created_on_max: moment(new Date()).startOf("day").format("YYYY-MM-DDTHH:mm:ss[Z]"),
        limit: 1000,
        page: 1,
    });

    const convertDateDateRangeToDateTime = (range: string) => {
        let startDate = filterTopShipper.created_on_min;
        let endDate = filterTopShipper.created_on_max;
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
        setFilterTopShipper({
            ...filterTopShipper,
            created_on_min: startDate,
            created_on_max: endDate,
        });
    };

    const handleChangeTime = (event: React.ChangeEvent<{ value: string }>) => {
        setDateRange(event.target.value);
        convertDateDateRangeToDateTime(event.target.value);
    };
    useEffect(() => {
        initData();
    }, [filterTopShipper])
    const initData = async () => {
        let res = await OrdersService.analyticsTopShipper(filterTopShipper);
        if (res.data) {
            if (res.data.list_analytics_top.accountTopShip) {
                setLoading(false)
                setListTopShipper(res.data.list_analytics_top.accountTopShip);
            }
        }
    }
    return <Fragment>
        <Box className={classes.root} borderRadius="3px" style={{ marginTop: 30, marginBottom: 50 }}>
            <Box className="box-title">
                <Typography variant="h6">TOP NHÂN VIÊN GIAO HÀNG</Typography>
                <Box className="header-group-button">
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
                    {listTopShipper && listTopShipper.length > 0 ? (
                        listTopShipper.map(
                            (item, index) =>
                                item && <TopItemComponent item={item} index={index + 1} key={index} />
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
export default connect(mapStateToProps)(withStyles(styles)(TopShipperStore));