import { Box, Grid, Typography, withStyles } from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./DashboardRevenue.styles";
import { RevenueProps } from "./DashboardRevenue.types";
import {
  BarChart,
  DataPoint,
  DataSeries,
  LineChart,
  SparkLineChart,
  StackedAreaChart,
} from "@shopify/polaris-viz";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReportOrderService from "services/ReportOrderService/ReportOrderService";
import { ReportFilterRequest } from "services/ReportOrderService";
import { formatDateUTC, formatDateUTCToLocalDateString, formatMoney } from "utilities";
import {
  DateRangesPredefineType,
  convertPredefinedToDate,
  getNamePredefinedDate,
} from "utilities/DateRangesPredefine";
import FilterDatePredefined from "components/SapoFilter/FilterItemsV2/FilterItems/FilterDatePredefined/FilterDatePredefined";
import Button from "components/Button";
import DashboardService from "services/DashboardService/DashboardService";
import { DashboardRequest, DashboardResponse } from "services/DashboardService";
const DashboardRevenue = (props: RevenueProps) => {
  const { classes } = props;
  const [data, setData] = useState<DataSeries[]>([]);
  const [dataTop, setDataTop] = useState<DashboardResponse | undefined>();
  const [filter, setFilter] = useState<DashboardRequest>(
     {
      createdOnPredefined: "today"
  });
  useEffect(() => {
    initData();
    initDataTop();
  }, []);
  const initDataTop = async () => {
    if (filter?.createdOnPredefined) {
      let newDateCreatedOn = convertPredefinedToDate(
        filter?.createdOnPredefined
      );
      filter.createdOnMin = formatDateUTC(newDateCreatedOn.startDate, false);
      filter.createdOnMax = formatDateUTC(newDateCreatedOn.endDate, true);
    }
    const res = await DashboardService.filter(filter);
    console.log("check", res);
    if (res.data) {
      setDataTop(res.data);
    }
  };
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
            color: "#7cb5ec",
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
      <Box>
        <Box
          style={{
            marginTop: 15,
            width: 500,
            display: "flex",
            marginBottom: 24,
          }}
        >
          <Box style={{ background: "#FFFFFF" }}>
            <FilterDatePredefined
              placeholder={"Chọn ngày tạo"}
              ranges={[
                {
                  key: DateRangesPredefineType.TODAY,
                  label: getNamePredefinedDate(DateRangesPredefineType.TODAY),
                },
                {
                  key: DateRangesPredefineType.YESTERDAY,
                  label: getNamePredefinedDate(
                    DateRangesPredefineType.YESTERDAY
                  ),
                },
                {
                  key: DateRangesPredefineType.THIS_WEEK,
                  label: getNamePredefinedDate(
                    DateRangesPredefineType.THIS_WEEK
                  ),
                },
                {
                  key: DateRangesPredefineType.LAST_WEEK,
                  label: getNamePredefinedDate(
                    DateRangesPredefineType.LAST_WEEK
                  ),
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
              initDataTop();
            }}
            color="primary"
          >
            Xem
          </Button>
        </Box>
        <Box
          style={{
            display: "flex",
            marginBottom: 24,
            padding: 20,
            background: "#FFFFFF",
            height: 80,
            boxShadow: "0 2px 4px hsla(0,0%,66%,.25)",
            borderRadius: 3,
          }}
        >
          <Grid item xs={2}>
            <Box style={{ display: "flex", padding: 10 }}>
              <RoomServiceIcon
                sx={{
                  color: "#A3A8AF",
                  background: "#EEEFF1",
                  width: 42,
                  height: 42,
                }}
              />
              <Box style={{ marginLeft: 12 }}>
                <Typography style={{ color: "#0088FF" }}>Tiền hàng</Typography>
                <Typography
                  style={{ fontSize: 24, marginTop: 10 }}
                  variant="h6"
                >
                  {dataTop?.totalSale ? formatMoney(dataTop.totalSale) : 0}đ
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2} style={{ marginLeft: 50 }}>
            <Box style={{ display: "flex", padding: 10 }}>
              <DeleteForeverIcon
                sx={{
                  color: "#A3A8AF",
                  background: "#EEEFF1",
                  width: 42,
                  height: 42,
                }}
              />
              <Box style={{ marginLeft: 12 }}>
                <Typography style={{ color: "#0088FF" }}>Hoàn huỷ</Typography>
                <Typography
                  style={{ fontSize: 24, marginTop: 10 }}
                  variant="h6"
                >
                  {dataTop?.cancelMoney ? formatMoney(dataTop.cancelMoney) : 0}đ
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2} style={{ marginLeft: 50 }}>
            <Box style={{ display: "flex", padding: 10 }}>
              <ExitToAppIcon
                sx={{
                  color: "#A3A8AF",
                  background: "#EEEFF1",
                  width: 42,
                  height: 42,
                }}
              />
              <Box style={{ marginLeft: 12 }}>
                <Typography style={{ color: "#0088FF" }}>Xuất kho</Typography>
                <Typography
                  style={{ fontSize: 24, marginTop: 10 }}
                  variant="h6"
                >
                  {dataTop?.exportMoney ? formatMoney(dataTop.exportMoney) : 0}đ
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2} style={{ marginLeft: 50 }}>
            <Box style={{ display: "flex", padding: 10 }}>
              <WarehouseIcon
                sx={{
                  color: "#A3A8AF",
                  background: "#EEEFF1",
                  width: 42,
                  height: 42,
                }}
              />
              <Box style={{ marginLeft: 12 }}>
                <Typography style={{ color: "#0088FF" }}>Nhập kho</Typography>
                <Typography
                  style={{ fontSize: 24, marginTop: 10 }}
                  variant="h6"
                >
                  {dataTop?.importMoney ? formatMoney(dataTop.importMoney) : 0}đ
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2} style={{ marginLeft: 50 }}>
            <Box style={{ display: "flex", padding: 10 }}>
              <AttachMoneyIcon
                sx={{
                  color: "#A3A8AF",
                  background: "#EEEFF1",
                  width: 42,
                  height: 42,
                }}
              />
              <Box style={{ marginLeft: 12 }}>
                <Typography style={{ color: "#0088FF" }}>Doanh thu</Typography>
                <Typography
                  style={{ fontSize: 24, marginTop: 10 }}
                  variant="h6"
                >
                  {dataTop?.totalRevenue ? formatMoney(dataTop.totalRevenue) : 0}đ
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Box>
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
                Số khách hàng
              </Typography>
              <Typography style={{ fontSize: 24, marginTop: 10 }}>
                {dataTop?.customers ? dataTop.customers : 0}
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
                Số hoá đơn
              </Typography>
              <Typography style={{ fontSize: 24, marginTop: 10 }}>
                {dataTop?.orderCount ? dataTop.orderCount : 0}
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
                TB mặt hàng/ hoá đơn
              </Typography>
              <Typography style={{ fontSize: 24, marginTop: 10 }}>
                {dataTop?.averageItemQuantity
                  ? dataTop.averageItemQuantity
                  : "--"}
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
                TB doanh thu/ hoá đơn
              </Typography>
              <Typography style={{ fontSize: 24, marginTop: 10 }}>
                {dataTop?.averageOrderValue ? formatMoney(dataTop.averageOrderValue)  : "--"}đ
              </Typography>
            </Box>
          </Grid>
        </Box>
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
      </Box>
    </Fragment>
  );
};

export default withStyles(styles)(DashboardRevenue);
