import { Box, IconButton, RootRef, Typography } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { StartContainedIcon, StartOutlineIcon } from "../../SVG";
import useStyles from "./FilterItem.styles";
import FilterItemProps from "./FilterItem.types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector } from "react-redux";
import { AppState } from "store/store";
import { colorInk } from "theme/palette";

const FilterItem = (props: FilterItemProps) => {
  const { label, children, active, forceClose, sortMode, isFilterHighlights, filterName, handleSortItem } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(sortMode ? false : active);
  const parentRef = useRef<HTMLDivElement>(null);
  const theme = useSelector(({ theme }: AppState) => theme);

  useEffect(() => {
    if (forceClose) {
      setOpen(false);
    }
  }, [forceClose]);

  useEffect(() => {
    if (sortMode) {
      setOpen(false);
    }
  }, [sortMode]);

  const handleClickFilterItem = () => {
    if (!sortMode) {
      setOpen(!open);
      if (!open) {
        let inputElement = parentRef.current?.querySelector("[input-type='sapo-autocomplete-input'] input");
        if (inputElement) {
          setTimeout(() => {
            (inputElement as any)?.focus();
          }, 200);
        }
      }
    } else {
      handleSortItem?.(filterName, !isFilterHighlights);
    }
  };

  return (
    <RootRef rootRef={parentRef}>
      <Box className={clsx(classes.root, "filter-item")} filter-name={filterName} style={{ transition: "300ms" }}>
        <Box
          className={clsx(classes.header, open && !sortMode ? "open" : "", active && !sortMode ? "active" : "")}
          onClick={handleClickFilterItem}
        >
          <Box display="flex">
            <Typography className="bullet">&bull;</Typography>
            <Typography>{label}</Typography>
          </Box>
          {sortMode ? (
            <IconButton style={{ padding: 2 }}>
              {isFilterHighlights ? (
                <StartContainedIcon style={{ color: theme.currentTheme.primary.main }} />
              ) : (
                <StartOutlineIcon style={{ color: colorInk.base40 }} />
              )}
            </IconButton>
          ) : (
            <ExpandMoreIcon className="arrow-icon" style={{ width: 24, height: 24 }} />
          )}
        </Box>
        <Collapse in={open}>
          <Box className={clsx(classes.content)}>{children}</Box>
        </Collapse>
      </Box>
    </RootRef>
  );
};

FilterItem.displayName = "SapoFilterItem";

export default FilterItem;
