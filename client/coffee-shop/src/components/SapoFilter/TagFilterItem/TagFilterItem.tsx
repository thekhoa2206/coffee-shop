import useTextWidth from "hocs/useTextWidth";
import { IconButton, makeStyles, Theme } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import TagFilterItemProps from "./TagFilterItem.types";
import { useTranslation } from "react-i18next";
import useForceUpdate from "hocs/useForceUpdate";
import { useSelector } from "react-redux";
import { AppState } from "store/store";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "unset",
    display: "inline-flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: 14,
    background: "#E6F4FF",
    margin: 6,
    fontWeight: 400,
    padding: "6px 12px",
    textAlign: "left",
    borderRadius: 20,
    cursor: "pointer",
    "&:focus": {
      backgroundColor: "#E6F4FF",
    },
    boxSizing: "border-box",
    maxWidth: "calc(100% - 12px)",
    overflow: "hidden",
  },
  label: {
    marginRight: 12,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    lineHeight: "20px",
    color: "#2B4263",
    "&.expand": {
      padding: "1px 0",
      whiteSpace: "unset",
    },
  },
  areaRight: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& .view-more-text": {
      width: 65,
      marginRight: 7,
      boxSizing: "border-box",
      color: theme.palette.primary.main,
      textAlign: "right",
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
    "& .delete-icon": {
      color: theme.palette.primary.main,
      padding: 0,
      width: 18,
      height: 18,
      "& svg": {
        width: 18,
        height: 18,
      },
    },
  },
}));

const TagFilterItem = (props: TagFilterItemProps) => {
  const { label, filterType, filterName, handleClick, handleDelete } = props;
  const classes = useStyles();
  const ref = useRef<HTMLDivElement | null>(null);
  const [expand, setExpand] = useState(false);
  const width = useTextWidth({ ref });
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(["component"]);
  const forceUpdate = useForceUpdate();
  const menu = useSelector((state: AppState) => state.menu);

  const handleClickTag = (e: React.MouseEvent<HTMLSpanElement>) => {
    handleClick(filterName);
  };

  const handleExpand = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    setExpand(!expand);
  };

  const handleClickDelete = (event: any) => {
    event.stopPropagation();
    handleDelete(filterType);
  };

  let parentWidth = rootRef?.current?.parentElement?.clientWidth || 0;

  useEffect(() => {
    parentWidth = rootRef?.current?.parentElement?.clientWidth || 0;
    forceUpdate();
  }, [label, menu.collapse]);

  return (
    <div className={classes.root} onClick={handleClickTag} ref={rootRef}>
      <span className={clsx(classes.label, "label", expand ? "expand" : "")} ref={ref}>
        {label}
      </span>
      <div className={classes.areaRight}>
        {!!(width && width > parentWidth - 25) && (
          <span className="view-more-text" onClick={handleExpand}>
            {expand ? `${t("component:tagFilterItem.expand")}` : `${t("component:tagFilterItem.more")}`}
          </span>
        )}
        <IconButton classes={{ root: "delete-icon" }} onClick={handleClickDelete}>
          <ClearIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default TagFilterItem;
