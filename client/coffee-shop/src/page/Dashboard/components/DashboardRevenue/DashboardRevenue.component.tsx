import { Box, Typography, withStyles } from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./DashboardRevenue.styles";
import { RevenueProps } from "./DashboardRevenue.types";
import { BarChart, DataPoint, DataSeries, LineChart, SparkLineChart, StackedAreaChart } from "@shopify/polaris-viz";
import ReportOrderService from "services/ReportOrderService/ReportOrderService";
import { ReportFilterRequest } from "services/ReportOrderService";
import { formatDateUTC, formatDateUTCToLocalDateString } from "utilities";
import {
  DateRangesPredefineType,
  convertPredefinedToDate,
  getNamePredefinedDate,
} from "utilities/DateRangesPredefine";
import FilterDatePredefined from "components/SapoFilter/FilterItemsV2/FilterItems/FilterDatePredefined/FilterDatePredefined";
import Button from "components/Button";
import DashboardService from "services/DashboardService/DashboardService";
import { DashboardRequest } from "services/DashboardService";

const DashboardRevenue = (props: RevenueProps) => {
  const { classes } = props;
  const [data, setData] = useState<DataSeries[]>([]);
  const [filter, setFilter] = useState<DashboardRequest>({
    createdOnMin: "2023-06-29T17:00:00Z",
    createdOnMax: "2023-06-17T17:00:00Z",
  });
  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    if (filter?.createdOnPredefined) {
      let newDateCreatedOn = convertPredefinedToDate(
        filter?.createdOnPredefined
      );
      filter.createdOnMin = formatDateUTC(newDateCreatedOn.startDate, false);
      filter.createdOnMax = formatDateUTC(newDateCreatedOn.endDate, true);
    }
    const res = await DashboardService.reportAggregateRevenue(filter);
    if (res.data) {
      let revenues: DataPoint[] = [
        {
          key: "",
          value: 0,
        },
      ];
      res.data.map((item) => {
        let revenue: DataPoint = {
          key: formatDateUTCToLocalDateString(item.date),
          value: item.aggregateRevenue,
        };
        if (item.date) revenues.push(revenue);
      });
      let cancels: DataPoint[] = [
        {
          key: "",
          value: 0,
        },
      ];
      res.data.map((item) => {
        let cancel: DataPoint = {
          key: formatDateUTCToLocalDateString(item.date),
          value: item.cancelMoney,
        };
        if (item.date) cancels.push(cancel);
      });
      if (revenues && revenues.length > 0) {
        revenues.push({
          key: "",
          value: 0,
        });
        cancels.push({
          key: "",
          value: 0,
        });
        setData([
          {
            data: revenues,
            color: "blue",
            name: "Doanh thu",
          },
          {
            data: cancels,
            color: "red",
            name: "Tiền hủy",
          },
        ]);
      }
    }
  };
  console.log(data);
  return (
    <Fragment>
      <Box
        style={{
          width: "100%",
          height: 60,
          background: "#FFFFFF",
          borderRadius: 6,
          display: "flex",
        }}
      >
        <Typography
          style={{
            fontWeight: "500",
            fontSize: 20,
            marginTop: 20,
            marginLeft: 20,
          }}
        >
          Doanh thu tổng hợp
        </Typography>
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
                label: getNamePredefinedDate(
                  DateRangesPredefineType.THIS_MONTH
                ),
              },
              {
                key: DateRangesPredefineType.LAST_MONTH,
                label: getNamePredefinedDate(
                  DateRangesPredefineType.LAST_MONTH
                ),
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
                createdOnMin: _startDate
                  ? formatDateUTC(_startDate, false)
                  : undefined,
                createdOnMax: _endDate
                  ? formatDateUTC(_endDate, true)
                  : undefined,
                createdOnPredefined: _predefinedDate || undefined,
                startDate: dateRanges?.startDate,
                endDate: dateRanges?.endDate,
              }));
            }}
          />
        </Box>
        <Button
          onClick={() => {
            initData();
          }}
          color="primary"
          style={{ marginTop: 15 }}
        >
          Xem
        </Button>
      </Box>
      <Box style={{ width: "100%", height: "500px" }}>
        {data && data.length > 0 ? (
          <BarChart data={data} theme="Light" />
        ) : (
          <Box>
            <Typography>Không có dữ liệu</Typography>
          </Box>
        )}
      </Box>
      <Box
        style={{
          height: 10,
          width: "100%",
          background: "#FFFFFF",
          borderRadius: 6,
        }}
      ></Box>
    </Fragment>
  );
};

export default withStyles(styles)(DashboardRevenue);
