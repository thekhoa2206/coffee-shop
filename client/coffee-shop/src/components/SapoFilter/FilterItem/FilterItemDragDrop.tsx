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
import { Draggable } from "react-beautiful-dnd";
import DragDropIcon from "components/SVG/DragDropIcon";
import Tooltip from "components/Tooltip";
import { useTranslation } from "react-i18next";

const FilterItemDragDrop = (props: FilterItemProps) => {
  const {
    label,
    children,
    active,
    forceClose,
    sortMode,
    isFilterHighlights,
    filterName,
    handleSortItem,
    index,
    isDragDropItem,
    onOpen,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(sortMode ? false : active);
  const parentRef = useRef<HTMLDivElement>(null);
  const theme = useSelector(({ theme }: AppState) => theme);
  const { t } = useTranslation(["component"]);

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
        onOpen?.();
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

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    userSelect: "none",
    background: isDragging ? "#E6F4FF" : "white",
    ...draggableStyle,
    cursor: "move !important",
  });

  return (
    <RootRef rootRef={parentRef}>
      <Draggable draggableId={filterName} index={index || 0} isDragDisabled={!sortMode}>
        {(provided: any, snapshot: any) => (
          <Box
            className={clsx(classes.root, "filter-item")}
            filter-name={filterName}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={isDragDropItem ? getItemStyle(snapshot.isDragging, provided.draggableProps.style) : {}}
          >
            <Box
              className={clsx(classes.header, open && !sortMode ? "open" : "", active && !sortMode ? "active" : "")}
              onClick={handleClickFilterItem}
              style={sortMode && isDragDropItem ? { cursor: "move" } : {}}
            >
              <Box display="flex">
                <Typography className="bullet">&bull;</Typography>
                <Typography>{label}</Typography>
              </Box>
              {sortMode && !isDragDropItem ? (
                <IconButton style={{ padding: 2 }}>
                  {isFilterHighlights ? (
                    <StartContainedIcon style={{ color: theme.currentTheme.primary.main }} />
                  ) : (
                    <StartOutlineIcon style={{ color: colorInk.base40 }} />
                  )}
                </IconButton>
              ) : sortMode && isDragDropItem ? (
                <Tooltip
                  title={t("component:settingColumn.moveMouse") || ""} 
                  placement="left-start"
                  arrow
                  classes={{ tooltip: classes.dragableTooltip }}
                >
                  <Box display="flex" style={{ marginRight: 5 }}>
                    <DragDropIcon style={{ cursor: "move", width: 10, height: 16 }} />
                  </Box>
                </Tooltip>
              ) : (
                <ExpandMoreIcon className="arrow-icon" style={{ width: 24, height: 24 }} />
              )}
            </Box>
            <Collapse in={open}>
              <Box className={clsx(classes.content)}>{children}</Box>
            </Collapse>
          </Box>
        )}
      </Draggable>
    </RootRef>
  );
};

FilterItemDragDrop.displayName = "SapoFilterItem";

export default React.memo(FilterItemDragDrop);
