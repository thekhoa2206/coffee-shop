import { Box, Typography, withStyles } from "@material-ui/core";
import React from "react";
import styles from "./BoxNoData.styles";
import { BoxNoDataProps } from "./BoxNoData.types";
import Image from "components/Image";
import NoData from "images/dashboard/no-data-report.svg";
import { useTranslation } from "react-i18next";

const BoxNoData = (props: BoxNoDataProps) => {
  const { classes, width, height } = props;
  const { t } = useTranslation("error");
  return (
    <Box className={classes.root}>
      <Box className="content">
        <Image src={NoData} style={{ width: width, height: height }} />
        <Typography variant="subtitle1" color="secondary" style={{ marginTop: "15px" }}>
          Chưa có dữ liệu
        </Typography>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(BoxNoData);
