import { createStyles, Theme } from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      background: "#fff",
      width: "100%",
      marginBottom: "24px",
      marginRight: "auto",
      height: "400px",
      borderRadius: 3,
      position: "relative",
      "@media screen and (min-width: 1920px)": {
        height: "500px",
      },
      "& .total-revenue-sale": {
        position: "absolute",
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
        color: "unset",
        "&:hover": {
          color: "unset",
          textDecoration: "unset !important",
        },
      },
      "& .box-title": {
        paddingRight: "16px",
        "& .tab": {
          paddingLeft: "16px",
          display: "flex",
          height: "100%",
          alignItems: "center",
          paddingRight: "15px",
          cursor: "pointer",
          "&>.MuiTypography-root": {
            textTransform: "uppercase",
          },
        },
        "& .tab-active": {
          borderBottom: "2px solid #0088FF",
        },
      },
      "& .box-content": {
        height: "calc(100% - 64px)",
        padding: "20px 25px 20px 10px",
        "& .box-content-revenue": {
          "& .highcharts-column-series": {
            "& .highcharts-point": {
              fill: "#33A0FF",
            },
          },
          "& .highcharts-credits": {
            display: "none",
          },
          "& .highcharts-legend": {
            display: "none",
          },
          "& .highcharts-axis-title": {
            display: "none",
          },
        },
      },
      boxShadow: "0px 2px 4px rgba(168, 168, 168, 0.25)",
    },
    option: {
      color: "#182537",
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
    tabComponent: {
      // "&.MuiTab-root": {
      //   "@media (min-width: 1920px)": {
      //     paddingLeft: "24px",
      //     paddingRight: "24px",
      //   },
      // },
    },
    boxProportionSaleGroup: {
      display: "flex",
      paddingLeft: 32,
      // width: "calc(100% - 405px)",
    },
  });

export default styles;
