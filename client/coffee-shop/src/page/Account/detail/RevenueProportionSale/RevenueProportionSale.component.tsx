import { Box, Grid, MenuItem, Typography, withStyles } from "@material-ui/core";
import Select from "components/Select/Index";
import { default as HighchartsReact, default as PieChart } from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import React, { useEffect, useState } from "react";
import OrdersService, { OrdersFilter } from "services/OrdersService";
import { formatDateUTC, formatMoney } from "utilities";
import { DateRangeType, GetListDateDashboardRange, GetNameDateRangeType } from "utilities/DateRangeType";
import styles from "./RevenueProportionSale.styles";
import { RevenueProportionSaleProps } from "./RevenueProportionSale.types";

const RevenueProportionSale = (props: RevenueProportionSaleProps) => {

  const { classes, account, id } = props;
  const [chartStateRevenue, setChartStateRevenue] = useState<any>();
  const [totaleRevenueSales, setTotaleRevenueSales] = useState(0);
  const [filters, setFilters] = useState<OrdersFilter>();
  const [dateRange, setDateRange] = useState(DateRangeType.DAY_LAST_7);
  const [chartState, setChartState] = useState<any>();
  const [totalSales, setTotalSales] = useState(0);
  const [filterReport, setFilterReport] = useState({
    startDate: moment(new Date()).startOf("days").subtract(6, "days").format("YYYY-MM-DD"),
    endDate: moment(new Date()).startOf("day").format("YYYY-MM-DD"),
  });
  useEffect(() => {
    if (chartStateRevenue) {
      chartStateRevenue.reflow();
    }
    //setOptionsRevenue();
  }, []);

  const setPositionTotal = () => {
    if (chartState) {
      document.getElementById("position-total")?.remove();
      if (chartState.renderer) {
        let text = chartState.renderer.text(formatMoney(totalSales, "201")).add(),
          textBBox = text.getBBox(),
          x = chartState.plotLeft + chartState.plotWidth * 0.455 - textBBox.width * 0.5,
          y = chartState.plotTop + chartState.plotHeight * 0.5 + textBBox.height * 0.25;
        text.attr({ x: x, y: y }).css({ fontSize: "24px", color: "#000000", fontWeight: "bold" }).add();
        text.attr({ id: "position-total" });
      }
    }
  };

  useEffect(() => {
    setPositionTotal();
  }, [chartState, totalSales]);

  const afterChartCreatedRevenue = (chart: any) => {
    chart.reflow();
    setChartStateRevenue(chart);
  };
  const afterChartCreated = (chart: any) => {
    setChartState(chart);
  };
  Highcharts.setOptions({
    lang: {
      numericSymbols: ["k", "M", "B", "T", "P", "E"],
      thousandsSep: ",",
    },
  });
  const [optionsRevenueState, setOptionsRevenueState] = useState({
    chart: {
      style: {
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
        height: window.innerWidth < 1920 ? "286px" : "378px",
        fontSize: "14px",
      },
      maintainAspectRatio: true,
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: [
      {
        categories: [] as string[],
        crosshair: true,
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: "normal",
            color: "#182537",
          },
        },
      },
    ],
    yAxis: [
      {
        color: "#33A0FF",
        labels: {
          format: `{value:,.0f}`,
          style: {
            color: "#182537;",
            fontSize: "14px",
            fontFamily:
              '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
          },
        },
      },
    ],
    tooltip: {
      pointFormat: `
               {point.y:,.0f}
          `,
    },
    legend: {
      layout: "vertical",
      x: 0,
      verticalAlign: "top",
      y: 0,
      floating: false,
      style: {
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
        color: "#33A0FF",
      },
      backgroundColor: "rgba(255,255,255,0.25)",
    },
    series: [
      {
        name: "",
        type: "column",
        data: [] as number[],
        tooltip: {
          valueSuffix: "",
        },
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              window.open(
                `/admin/analytics`,
                "_blank",
                "noopener,noreferrer"
              );
            },
          },
        },
      },
    ],
  });
  useEffect(() => {
    initData();
  }, [dateRange])
  const initData = async () => {
    let filterOrder: OrdersFilter = {
      ...filters,
      created_on_max: filterReport.endDate,
      created_on_min: filterReport.startDate,
      page: 1,
      limit: 10,
      type: (dateRange === DateRangeType.THIS_YEAR || dateRange === DateRangeType.LAST_YEAR) ? "month" : "day",
      year: dateRange === DateRangeType.LAST_YEAR ? "2022" : "2023",
      shipperId: Number(id),
    }
    setFilters(filterOrder);
    let res = await OrdersService.getRevenueAnalytics(filterOrder);
    if (res) {
      let total = 0;
      let optionsRevenueClone = { ...optionsRevenueState };
      let label: string[] = [];
      let revenue: number[] = [];
      if (res.data.list_revenue) {
        res.data.list_revenue.revenue_response?.map((item) => {
          if (item) {
            label.push(item?.date || "");
            revenue.push(item?.revenue || 0);
            total += item?.revenue || 0;
          }
        })
      }
      optionsRevenueClone.xAxis[0].categories = label;
      optionsRevenueClone.series[0].data = revenue;
      setTotaleRevenueSales(total);
      setOptionsRevenueState(optionsRevenueClone);
    }

  }

  const convertDateDateRangeToDateTime = (range: string) => {
    let startDate = "";
    let endDate = "";
    if (range === DateRangeType.YESTERDAY) {
      startDate = endDate = moment(new Date()).startOf("day").subtract(1, "days").format("YYYY-MM-DD");
    } else if (range === DateRangeType.TODAY) {
      startDate = endDate = moment(new Date()).startOf("day").format("YYYY-MM-DD");
    } else if (range === DateRangeType.DAY_LAST_7) {
      startDate = moment(new Date()).startOf("days").subtract(6, "days").format("YYYY-MM-DD");
      endDate = moment(new Date()).startOf("day").format("YYYY-MM-DD");
    } else if (range === DateRangeType.THIS_MONTH) {
      startDate = moment(new Date()).startOf("month").format("YYYY-MM-DD");
      endDate = moment(new Date()).startOf("day").format("YYYY-MM-DD");
    } else if (range === DateRangeType.LAST_MONTH) {
      startDate = moment(new Date()).subtract(1, "months").startOf("month").format("YYYY-MM-DD");
      endDate = moment(new Date()).subtract(1, "months").endOf("month").format("YYYY-MM-DD");
    } else if (range === DateRangeType.THIS_YEAR) {
      startDate = moment(new Date(new Date().getFullYear(), 0, 1)).format("YYYY-MM-DD");
      endDate = moment(new Date()).format("YYYY-MM-DD");
    } else if (range === DateRangeType.LAST_YEAR) {
      startDate = moment(new Date(new Date().getFullYear() - 1, 0, 1)).format("YYYY-MM-DD");
      endDate = moment(new Date(new Date().getFullYear() - 1, 11, 31)).format("YYYY-MM-DD");
    }
    setFilterReport({ ...filterReport, startDate: startDate, endDate: endDate });
  };
  const handleChangeTime = (event: React.ChangeEvent<{ value: string }>) => {
    setDateRange(event.target.value);
    convertDateDateRangeToDateTime(event.target.value);
  };
  console.log(filterReport)
  return (
    <>
      <Box className={props.classes.root} display="flex" flexWrap="wrap">
        <Box style={{ width: "100%" }}>
          <Grid container xs={12}>
            <Grid container xs={10}>
              <Typography style={{ marginLeft: "20px", marginTop: 20, fontWeight: 500, fontSize: "1.125rem" }}>DOANH THU</Typography>
            </Grid>
            <Grid container xs={2}>
              <Select
                value={dateRange}
                style={{ height: 36, color: "#182537", marginTop: 20, marginLeft: 50 }}
                onChange={(event: React.ChangeEvent<{ value: any }>) => {
                  handleChangeTime(event);
                }}
              >
                {GetListDateDashboardRange.map((item) => (
                  <MenuItem value={item} key={item} className={classes.option}>
                    {GetNameDateRangeType(item)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.root}>
          <Box className="box-content">
            <Box className="box-content-revenue">
              <HighchartsReact
                highcharts={Highcharts}
                options={optionsRevenueState}
                callback={afterChartCreatedRevenue}
              />
              <Typography style={{ fontWeight: 500, marginLeft: 700, marginTop: 20 }}>
                Tổng doanh thu:{" "}
                <Typography variant="subtitle1" style={{ display: "inline-block" }}>
                  {formatMoney(totaleRevenueSales)} VNĐ
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

    </>
  );
};

export default withStyles(styles)(RevenueProportionSale);
