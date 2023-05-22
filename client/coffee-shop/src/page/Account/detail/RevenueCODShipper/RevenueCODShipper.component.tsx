import { Box, Grid, MenuItem, Typography, withStyles } from "@material-ui/core";
import Select from "components/Select/Index";
import { default as PieChart } from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import React, { useEffect, useState } from "react";
import OrdersService, { OrdersFilter } from "services/OrdersService";
import { formatDateUTC, formatMoney } from "utilities";
import { DateRangeType, GetListDateDashboardRange, GetNameDateRangeType } from "utilities/DateRangeType";
import BoxNoDataComponent from "../BoxNoData/BoxNoData.component";
import styles from "./RevenueCODShipper.styles";
import { RevenueCODShipperProps } from "./RevenueCODShipper.types";

const RevenueCODShipper = (props: RevenueCODShipperProps) => {

  const { classes, account } = props;
  const [filters, setFilters] = useState<OrdersFilter>();
  const [dateRange, setDateRange] = useState(DateRangeType.DAY_LAST_7);
  const [chartState, setChartState] = useState<any>();
  const [totalSales, setTotalSales] = useState(0);
  const [isNoData, setIsNodata] = useState<boolean>(false);
  const [filterReport, setFilterReport] = useState({
    startDate: moment(new Date()).startOf("days").subtract(6, "days").format("YYYY-MM-DD"),
    endDate: moment(new Date()).startOf("day").format("YYYY-MM-DD"),
  });

  Highcharts.setOptions({
    lang: {
      numericSymbols: ["k", "M", "B", "T", "P", "E"],
      thousandsSep: ",",
    },
  });

  const setPositionTotal = () => {
    if (chartState) {
      document.getElementById("position-total")?.remove();
      if (chartState.renderer) {
        let text = chartState.renderer.text(formatMoney(totalSales, " VNĐ")).add(),
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

  const [optionsProportionState, setOptionsProportionState] = useState({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
      style: {
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
        height: window.innerWidth < 1920 ? "296px" : "",
        width: "100%",
      },
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    legend: {
      itemStyle: {
        fontWeight: "normal",
        fontSize: "16px",
      },
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      itemWidth: 400,
      width: 400,
    },
    tooltip: {
      useHtml: true,
      pointFormat: ` <span style="display:flex;flex-wrap:wrap;"><b style="display:flex;">{series.name}</b> <span style="display:flex;">: {point.percentage:.1f}%</span> <br>
                    Tổng tiền: <b>{point.y}</b>`,
    },
    colors: [
      "#0088FF",
      "#0FD186",
      "#FFAE06",
      "#33A0FF",
      "#3FDA9E",
      "#4267b2",
      "#FFBE38",
      "#66B8FF",
      "#6FE3B6",
      "#FFCE6A",
      "#99CFFF",
      "#9FEDCF",
      "#FFDF9B",
      "#CCE7FF",
      "#CFF6E7",
      "#FFEFCD",
      "#D9EDFF",
    ],
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
        innerSize: 220,
        point: {
          events: {
            click: function () {
              window.open(
                `/admin/analytics/sale_orders/revenue_by_month?dateRangeType=${dateRange}`,
                "_blank",
                "noopener,noreferrer"
              );
            },
          },
        },
      },
    },
    series: [
      {
        name: `Tỷ lệ thanh toán`,
        colorByPoint: true,
        data: [] as Object[],
      },
    ],
  });
  const afterChartCreated = (chart: any) => {
    setChartState(chart);
  };
  useEffect(() => {
    setOptionProportion();
  }, [dateRange])

  const setOptionProportion = async () => {
    let serials = [];
    let total = 0;
    let countData = 0;
    let filterOrder: OrdersFilter = {
      ...filters,
      created_on_max: filterReport.endDate,
      created_on_min: filterReport.startDate,
      page: 1,
      limit: 10,
      type: (dateRange === DateRangeType.THIS_YEAR || dateRange === DateRangeType.LAST_YEAR) ? "month" : "day",
      year: dateRange === DateRangeType.LAST_YEAR ? "2022" : "2023",
      shipperId: account?.id,
    }
    setFilters(filterOrder);
    let res = await OrdersService.getRevenueAnalyticsCODShipper(filterOrder);
    if (res) {
      if (res.data.analytics_cod_shipper) {
        if (res.data.analytics_cod_shipper.totalCOD === 0) {
          setIsNodata(true);
          return;
        } else {
          setIsNodata(false);
          let item2 = [];
          let item3 = [];

          item2.push("Đã thanh toán");
          item2.push(res.data.analytics_cod_shipper.paidCOD || 0);
          serials.push(item2);

          item3.push("Còn phải trả");
          item3.push((res.data.analytics_cod_shipper.totalCOD || 0) - (res.data.analytics_cod_shipper.paidCOD || 0));
          serials.push(item3);
          countData = 2;
          setTotalSales(res.data.analytics_cod_shipper.totalCOD || 0);
        }
      }
    }
    let optionsProportionClone = { ...optionsProportionState };
    optionsProportionClone.series[0].data = serials;
    optionsProportionClone.legend.layout = countData < 7 ? "vertical" : "horizontal";
    optionsProportionClone.legend.itemWidth = countData < 7 ? 400 : 200;
    optionsProportionClone.plotOptions.pie.point.events.click = function () { };
    setOptionsProportionState(optionsProportionClone);
  };

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
  return (
    <>
      <Box className={props.classes.root} display="flex" flexWrap="wrap" style={{ marginTop: 50 }}>
        <Box style={{ width: "100%" }}>
          <Grid container xs={12}>
            <Grid container xs={10}>
              <Typography style={{ marginLeft: "20px", marginTop: 20, fontWeight: 500, fontSize: "1.125rem" }}>TỶ LỆ THANH TOÁN COD</Typography>
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
            <Box className="box-content-proportion">
              {!isNoData && optionsProportionState.series[0].data.length > 0 && <PieChart
                highcharts={Highcharts}
                options={optionsProportionState}
                callback={afterChartCreated}
              ></PieChart>}
              {isNoData && <BoxNoDataComponent width="280px" height="205px"></BoxNoDataComponent>}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default withStyles(styles)(RevenueCODShipper);
