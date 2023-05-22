import { createStyles, makeStyles, Paper, Theme } from "@material-ui/core";
import SearchIcon from "components/SVG/SearchIcon";
import React from "react";
import { useTranslation } from "react-i18next";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "24px 0",
      flex: "1 1 auto",
    },
    searchIcon: {
      color: "#D3D5D7",
      width: 44,
      height: 44,
    },
    message: {
      fontWeight: 500,
      margin: 0,
      padding: "16px 0px 8px",
      fontSize: 16,
    },
    helpText: {
      color: "#747C87",
    },
  })
);

interface NoResultsComponent {
  nameObject?: string;
  message?: string;
  helpText?: string;
  style?: React.CSSProperties;
  searchIcon?: boolean;
}

const NoResultsComponent = (props: NoResultsComponent) => {
  const classes = useStyles();
  const { t } = useTranslation(["component"]);
  const { nameObject, message, helpText, style, searchIcon = true } = props;
  return (
    <Paper className={classes.root} style={{ ...style }}>
      {searchIcon ? <SearchIcon className={classes.searchIcon}></SearchIcon> : null}
      <p className={classes.message}>
        {message ||
          `${t("component:noResults.notFound")} ${nameObject || t("component:noResults.data")} ${t(
            "component:noResults.searchResult"
          )}`}
      </p>
      <span className={classes.helpText}>{helpText || t("component:noResults.helpText")}</span>
    </Paper>
  );
};

export default NoResultsComponent;
