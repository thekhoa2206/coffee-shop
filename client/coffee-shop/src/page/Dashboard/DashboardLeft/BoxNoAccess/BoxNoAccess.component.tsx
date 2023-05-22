import { Box, Typography, withStyles } from "@material-ui/core";
import React from "react";
import styles from "./BoxNoAccess.styles";
import { BoxNoAccessProps } from "./BoxNoAccess.types";
import { useTranslation } from "react-i18next";
import { WarningIcon } from "components/SVG";
import { Image } from "@material-ui/icons";

const BoxNoAccess = (props: BoxNoAccessProps) => {
  const { classes, type, width, height, label } = props;
  const { t } = useTranslation("error");

  return (
    <Box className={classes.root}>
      <Box className="content">
        <WarningIcon color="error" />

        {label || (
          <Typography variant="subtitle1" color="secondary" style={{ marginTop: "10px" }}>
            {t("error.notHaveAccess")}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default withStyles(styles)(BoxNoAccess);
