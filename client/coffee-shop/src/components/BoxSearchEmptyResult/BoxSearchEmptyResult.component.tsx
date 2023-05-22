import { Box, Typography, withStyles } from "@material-ui/core";
import React from "react";
import styles from "./BoxSearchEmptyResult.styles";
import {BoxSearchEmptyResultProps} from "./BoxSearchEmptyResult.types";
import { useTranslation } from "react-i18next";
import NoSearchResultIcon from '../SVG/NoSearchResultIcon';

const BoxSearchEmptyResult = (props: BoxSearchEmptyResultProps) => {
  const { classes, label } = props;
  const { t } = useTranslation("error");

  return (
    <Box className={classes.root}>
      <Box className="content">
        <NoSearchResultIcon style={{ width: "206px", height: "150px" }}/>
        <Typography variant="subtitle1" color="secondary" style={{ marginTop: "10px" }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(BoxSearchEmptyResult);
