import React, { useEffect, useRef, useState } from "react";
import { ChipProps, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import clsx from "clsx";
import Chip from "components/Chip";
import { colorInk } from "theme/palette";
import { useTranslation } from "react-i18next";

interface ViewTagsV2Props {
  tags: any[];
  classRoot?: string;
  parentWidth?: number | null;
  onDelete?: (tag: any) => void;
  chipProps?: ChipProps;
  uniqKey?: string;
  getOptionLabel?: (dataItem: any) => React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexWrap: "nowrap",
    alignItems: "center",
  },
  tagItem: {
    backgroundColor: "#F4F4F5",
    color: colorInk.base40,
    height: 24,
    fontSize: "0.875rem",
    borderRadius: 50,
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const ViewTagsV2 = (props: ViewTagsV2Props) => {
  const { t } = useTranslation(["component"]);
  const { tags, classRoot, parentWidth, chipProps, onDelete, getOptionLabel, uniqKey } = props;
  const classes = useStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentParentWidth, setCurrentParentWidth] = useState(0);
  const [isShowAll, setIsShowAll] = useState(false);

  useEffect(() => {
    if (parentWidth) {
      setCurrentParentWidth(parentWidth);
    }
  }, [parentWidth]);

  useEffect(() => {
    if (currentParentWidth) {
      handleShowTags();
    }
  }, [currentParentWidth, tags]);

  const handleShowTags = () => {
    let childrens = containerRef?.current?.children;
    if (childrens) {
      (containerRef?.current?.style as any).flexWrap = "nowrap";
      setIsShowAll(false);
      let widthElements = 0;
      for (let i = 0; i < childrens.length; i++) {
        (childrens[i] as any).style.display = "block";
        if (i === childrens.length - 1) break;
        widthElements += childrens[i].clientWidth;
      }
      let isViewMore = false;
      if (widthElements > currentParentWidth) {
        let viewMoreButtonWidth = childrens[childrens.length - 1].clientWidth;
        let widthWithViewMoreButton = viewMoreButtonWidth;
        for (let i = 0; i < childrens.length - 1; i++) {
          widthWithViewMoreButton += childrens[i].clientWidth;
          if (widthWithViewMoreButton > currentParentWidth || isViewMore) {
            (childrens[i] as any).style.display = "none";
            isViewMore = true;
          }
        }
      } else {
        (childrens[childrens.length - 1] as any).style.display = "none";
      }
    }
  };

  const handleShowAllTags = () => {
    if (isShowAll) {
      handleShowTags();
      return;
    }
    setIsShowAll(!isShowAll);
    (containerRef?.current?.style as any).flexWrap = "wrap";
    let childrens = containerRef?.current?.children;
    if (childrens) {
      for (let i = 0; i < childrens.length - 1; i++) {
        (childrens[i] as any).style.display = "";
      }
    }
  };

  return (
    <Grid
      ref={containerRef}
      container
      className={clsx(classes.root, classRoot)}
      style={{ width: currentParentWidth, maxWidth: currentParentWidth }}
      spacing={1}
    >
      {tags.map((item) => (
        <Grid item key={uniqKey ? item[uniqKey] : item}>
          <Chip
            label={getOptionLabel ? getOptionLabel(item) : item}
            className={classes.tagItem}
            onDelete={onDelete ? () => onDelete(item) : undefined}
            {...chipProps}
          />
        </Grid>
      ))}
      <Grid item onClick={() => handleShowAllTags()} style={{ cursor: "pointer" }}>
        <Typography style={{ fontSize: "0.875rem", whiteSpace: "nowrap", color: "#0088FF", minWidth: 73 }}>
          {isShowAll ? t("component:button.collapse") : t("component:button.showMore")}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewTagsV2;
