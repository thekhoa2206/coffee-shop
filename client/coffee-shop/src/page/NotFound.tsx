import { Box, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation(["common"]);
  return (
    <Fragment>
      <Box className="container">
        <Box className="body-error">
          <p className="title">{t("notFound.notfoundTitle")}</p>
        </Box>
        <Box className="body-footer">
          <Typography>
            {t("notFound.title")} <Link to="/admin">{t("notFound.home")}</Link>
            {t("notFound.infoSupport")} <Link to="https://support.sapo.vn/">{t("notFound.infoSupportLink")}</Link>
          </Typography>
        </Box>
      </Box>
    </Fragment>
  );
};

export default NotFound;
