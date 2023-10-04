import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Checkbox from "components/Checkbox";
import useModal from "components/Modal/useModal";
import SearchBox from "components/SearchBox/SearchBox";
import DragDropIcon from "components/SVG/DragDropIcon";
import Tooltip from "components/Tooltip";
import React, { Fragment, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import useStyles from "./SettingColumns.style";
import NoResultsComponent from "components/NoResults/NoResultsComponent";
import Button from "components/Button";

const reorder = (list: Columns[], startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "#E6F4FF" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
  cursor: "grab",
});

const getListStyle = (isDraggingOver: any) => ({
  background: isDraggingOver ? "#F2F9FF" : "white",
  cursor: isDraggingOver ? "grabbing" : "default",
});

interface Columns {
  name: string;
  title: string;
  display: boolean;
}

interface SettingColumnsProps {
  settingColumns: Record<string, boolean>;
  defaultSettings?: Record<string, boolean>;
  columnNames: Record<string, string>;
  title?: string;
  description?: string;
  canHideColumn?: boolean;
  searchable?: boolean;
}

const SettingColumns = (props: SettingColumnsProps) => {
  const { t } = useTranslation(["customer", "error", "component"]);
  const {
    settingColumns,
    defaultSettings,
    columnNames,
    canHideColumn = true,
    searchable = true,
    title = t("component:settingColumn.title"),
    description = t("component:settingColumn.description"),
  } = props;
  const { closeModal } = useModal();
  const [originalColumns, setOriginalColumns] = useState<Columns[]>([]);
  const [columns, setColumns] = useState<Columns[]>([]);
  const [query, setQuery] = useState<string>("");
  const [_settingColumns, setSetingColumns] = useState<Record<string, boolean>>(settingColumns);
  const classes = useStyles();
  useEffect(() => {
    initData();
  }, [_settingColumns]);

  useEffect(() => {
    setSetingColumns(settingColumns);
  }, [settingColumns]);

  const initData = () => {
    let _columns: Columns[] = [];
    Object.entries(_settingColumns).forEach(([key, value]) => {
      _columns.push({ name: key, title: columnNames[key], display: value });
    });
    setColumns(_columns);
    setOriginalColumns(_columns);
  };

  const onDisplayChange = (e: React.ChangeEvent, value: boolean, col: Columns) => {
    col.display = value;
    setColumns([...columns]);
  };

  const handleSaveColumns = (e: React.MouseEvent) => {
    let newSettingColumns: Record<string, boolean> = {};
    originalColumns.forEach((col) => {
      newSettingColumns[col.name] = col.display;
    });
    closeModal(newSettingColumns);
  };

  const handleReset = (e: React.MouseEvent) => {
    setSetingColumns({ ...defaultSettings });
    setQuery("");
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(columns, result.source.index, result.destination.index);
    setColumns(items);

    if (query && query.trim()) {
      const original_source_index = originalColumns.findIndex((c) => c.name === columns[result.source.index].name);
      const original_destination_index = originalColumns.findIndex(
        (c) => c.name === columns[result.destination.index].name
      );

      const originalItems = reorder(originalColumns, original_source_index, original_destination_index);
      setOriginalColumns(originalItems);
    } else {
      setOriginalColumns(items);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    setSetingColumns({ ...settingColumns });
    closeModal();
  };

  const searchFields = (query: string) => {
    let result: Columns[] = [];
    if (query && query.trim()) {
      result = originalColumns.reduce((items: Columns[], item) => {
        const title = item.title.toLowerCase();
        const _query = query.trim().toLowerCase();
        if (title.includes(_query)) {
          items.push(item);
        }
        return items;
      }, []);
    } else {
      result = [...originalColumns];
    }

    return result;
  };

  const handleSearch = (e: React.SyntheticEvent<HTMLElement>, value: any) => {
    setQuery(value);
    const result = searchFields(value);
    setColumns(result);
  };

  return (
    <Dialog open={true} onClose={handleClose} aria-labelledby="form-dialog-title" className={classes.root}>
      <DialogTitle id="form-dialog-title" disableTypography>
        <Box display="flex" flexDirection="column">
          <Typography variant="h4" style={{ marginBottom: 4 }}>
            {title}
          </Typography>
          <Typography color="secondary">{description}</Typography>
        </Box>
        <IconButton aria-label="close" onClick={handleClose} classes={{ root: classes.rootIconButton }}>
          <CloseIcon className={classes.iconClose} />
        </IconButton>

        {searchable && (
          <SearchBox
            placeholder={"Tìm kiếm"}
            className={classes.searchbox}
            value={query}
            onChange={handleSearch}
          />
        )}
      </DialogTitle>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any, snapshot: any) => (
            <DialogContent
              dividers
              className={classes.container}
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {columns.length ? (
                <React.Fragment>
                  {columns.map((col, index) => (
                    <Draggable key={col.name} draggableId={col.name} index={index}>
                      {(provided: any, snapshot: any) => (
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          className={classes.lineItems}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                canHideColumn ? (
                                  <Checkbox
                                    checked={col.display}
                                    onChange={(e, value) => onDisplayChange(e, value, col)}
                                  />
                                ) : (
                                  <Fragment />
                                )
                              }
                              label={col.title}
                            />
                          </FormGroup>
                          <Tooltip
                            title={t("component:settingColumn.moveMouse") || ""}
                            placement="left-start"
                            arrow
                            classes={{ tooltip: classes.dragableTooltip }}
                          >
                            <Box display="flex">
                              <DragDropIcon style={{ cursor: "grab" }} />
                            </Box>
                          </Tooltip>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  <Box visibility="hidden">{provided.placeholder}</Box>
                </React.Fragment>
              ) : (
                <NoResultsComponent searchIcon={false} />
              )}
            </DialogContent>
          )}
        </Droppable>
      </DragDropContext>
      <DialogActions style={{ padding: "0 24px 16px 24px" }}>
        {defaultSettings && (
          <Button color="primary" variant="outlined" size="small" onClick={handleReset}>
            {t("component:settingColumn.setDefault")}
          </Button>
        )}
        <Button onClick={handleClose} color="primary" variant="outlined" size="small" style={{ marginLeft: "16px" }}>
          {t("component:button.exit")}
        </Button>
        <Button
          onClick={handleSaveColumns}
          color="primary"
          variant="contained"
          size="small"
          style={{ marginLeft: "16px" }}
        >
          {t("component:button.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingColumns;
