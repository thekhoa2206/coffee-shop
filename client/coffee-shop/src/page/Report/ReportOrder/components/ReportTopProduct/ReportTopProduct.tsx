
import { Box, MenuItem, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Fragment } from "react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "store/store";
import styles from "./ReportTopProduct.styles";
import { ReportTopProductProps } from "./ReportTopProduct.types";
import Select from "components/Select/Index";
import { DateRangeType, GetListDateRange, GetNameDateRangeType } from "utilities/DateRangeType";
import moment from "moment";
import CircularProgress from "components/Loading/CircularProgress";
import TopItemComponent from "./TopItemComponent/TopItem.component";
import { ReportProductFilter, ReportProductResponse } from "services/ReportOrderService";
import ReportOrderService from "services/ReportOrderService/ReportOrderService";

const ReportTopProduct = (props: ReportTopProductProps) => {
    const { classes } = props;
    const [dateRange, setDateRange] = useState(DateRangeType.DAY_LAST_7);
    const [listTopProduct, setListTopProduct] = useState<ReportProductResponse[]>([]);
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
        let res = await ReportOrderService.getReportTopProduct({
            ...filter,
            createdOnMin: formatDateUTC(filter.createdOnMin, false),
            createdOnMax: formatDateUTC(filter.createdOnMax, true),
        });
        if (res.data) {
            if (res.data) {
                setLoading(false)
                setListTopProduct(res.data);
            }
        }
    }
    const formatDateUTC = (
        date?: Date | string | null,
        isEndDate: boolean = false,
        format: string = "YYYY-MM-DDTHH:mm:ss[Z]"
      ) => {
        if (date) {
          let dateUtc;
          if (typeof date === "string") {
            dateUtc = moment(date, "YYYY-MM-DD").utc();
          } else {
            // format date theo chuẩn  ISO string (YYYY-MM-DD) sau đó chuyển về dạng UTC
            dateUtc = moment(moment(date).format("YYYY-MM-DD")).utc();
          }
          if (isEndDate) {
            // cộng 1 ngày trừ 1s để lấy 16:59:59 của ngày hôm đó tức là 23:59:59
            return dateUtc.add(1, "days").subtract(1, "seconds").format(format);
          }
          return dateUtc.format(format);
        }
        return "";
      }
    return <Fragment>
        <Box className={classes.root} borderRadius="3px" style={{ marginTop: 30, marginBottom: 50 }}>
            <Box className="box-title" style={{display: "flex", marginLeft: 20}}>
                <Typography variant="h6" style={{marginTop: 20}}>TOP SẢN PHẨM BÁN CHẠY</Typography>
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
                    {listTopProduct && listTopProduct.length > 0 ? (
                        listTopProduct.map(
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
export default connect(mapStateToProps)(withStyles(styles)(ReportTopProduct));