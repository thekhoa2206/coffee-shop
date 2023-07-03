import { Box, Typography, withStyles } from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./Revenue.styles";
import { RevenueProps } from "./Revenue.types";
import { DataPoint, DataSeries, StackedAreaChart } from "@shopify/polaris-viz";
import ReportOrderService from "services/ReportOrderService/ReportOrderService";
import { ReportFilterRequest } from "services/ReportOrderService";
import { formatDateUTC, formatDateUTCToLocalDateString } from "utilities";
import { DateRangesPredefineType, convertPredefinedToDate, getNamePredefinedDate } from "utilities/DateRangesPredefine";
import FilterDatePredefined from "components/SapoFilter/FilterItemsV2/FilterItems/FilterDatePredefined/FilterDatePredefined";
import Button from "components/Button";

const Revenue = (props: RevenueProps) => {

    const { classes } = props;
    const [data, setData] = useState<DataSeries[]>([]);
    const [filter, setFilter] = useState<ReportFilterRequest>({
        createdOnMax: "2023-06-29T17:00:00Z",
        createdOnMin: "2023-06-17T17:00:00Z"
    });
    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        if (filter?.createdOnPredefined) {
            let newDateCreatedOn = convertPredefinedToDate(filter?.createdOnPredefined);
            filter.createdOnMin = formatDateUTC(newDateCreatedOn.startDate, false);
            filter.createdOnMax = formatDateUTC(newDateCreatedOn.endDate, true);
          }
        const res = await ReportOrderService.getRevenues(filter);
        if (res.data) {
            let revenues: DataPoint[] = [{
                key: "",
                value: 0,
            }];
            res.data.map((item) => {
                let revenue: DataPoint = {
                    key: formatDateUTCToLocalDateString(item.date),
                    value: item.totalRevenue,
                }
                if(item.date) revenues.push(revenue);
            })
            let discounts: DataPoint[] = [{
                key: "",
                value: 0,
            }];
            res.data.map((item) => {
                let discount: DataPoint = {
                    key: formatDateUTCToLocalDateString(item.date),
                    value: item.totalDiscount,
                }
                if(item.date) discounts.push(discount);
            })
            if(revenues && revenues.length > 0){
                revenues.push({
                    key: "",
                    value: 0,
                })
                discounts.push({
                    key: "",
                    value: 0,
                })
                setData([{
                    data: revenues,
                    color: "blue",
                    name: "Doanh thu",
                }, {
                    data: discounts,
                    color: "red",
                    name: "Chiết khấu",
                }])
            }
        }
    }
    console.log(data)
    return (<Fragment>
        <Box style={{ width: "100%", height: 60, background: "#FFFFFF", borderRadius: 6, display: "flex" }}>
            <Typography style={{ fontWeight: "500", fontSize: 20, marginTop: 20, marginLeft: 20 }}>Thống kê đơn hàng theo thời gian</Typography>
            <Box style={{ marginTop: 15, marginLeft: "55%", width: 200 }}>
                <FilterDatePredefined
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
                    endDate={filter?.endDate}
                    startDate={filter?.startDate}
                    predefinedDate={filter?.createdOnPredefined}
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
                        setFilter((prev) => ({
                            ...prev,
                            createdOnMin: _startDate ? formatDateUTC(_startDate, false) : undefined,
                            createdOnMax: _endDate ? formatDateUTC(_endDate, true) : undefined,
                            createdOnPredefined: _predefinedDate || undefined,
                            startDate: dateRanges?.startDate,
                            endDate: dateRanges?.endDate,
                        }));
                    }}
                />
            </Box>
            <Button onClick={() => {initData()}} color="primary" style={{marginTop: 15}}>Xem</Button>
        </Box>
        <Box style={{ width: "100%", height: "500px" }}>
            {data && data.length > 0 ? (<StackedAreaChart data={data} theme="Light" />) : (<Box><Typography>Không có dữ liệu</Typography></Box>)}
        </Box>
        <Box style={{height: 10, width: "100%", background: "#FFFFFF", borderRadius: 6}}></Box>
    </Fragment>
    );
};

export default withStyles(styles)(Revenue);
