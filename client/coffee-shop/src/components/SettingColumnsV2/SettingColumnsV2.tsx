import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  MenuList,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useModal from "components/Modal/useModal";
import SearchBox from "components/SearchBox/SearchBox";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useStyles from "./SettingColumnsV2.style";
import Button from "components/Button";
import clsx from "clsx";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Checkbox from "../Checkbox/Checkbox.component";
import { removeVietnameseTones } from "../../utilities";
import _ from "lodash";

export interface ColumnsGroupV2 {
  name: string;
  items: ColumnsV2[];
  disable?: boolean;
}

export interface ColumnsV2 {
  name: string;
  label: string;
  disable?: boolean;
  defaultSelected?: boolean;
  hidden?: boolean;
}

interface SettingColumnsProps {
  settingColumns: Record<string, boolean>;
  columnGroups: ColumnsGroupV2[];
  title?: string;
  description?: string;
  canHideColumn?: boolean;
  searchable?: boolean;
  sortable?: boolean;
}

const SettingColumnsV2 = (props: SettingColumnsProps) => {
  const { t } = useTranslation(["customer", "error", "component"]);
  const { columnGroups, title = "Điều chỉnh cột hiển thị", description, sortable } = props;
  const { closeModal } = useModal();
  const [query, setQuery] = useState<string>("");
  const classes = useStyles();
  const [selectedColumns, setSelectedColumns] = useState<ColumnsV2[]>(
    Object.keys(props.settingColumns).flatMap((key) => {
      if (!props.settingColumns[key]) {
        return [];
      }
      const cols = columnGroups.flatMap((e) => e.items);
      return cols.filter((e) => e.name === key)?.[0];
    })
  );

  const isShow = (col: ColumnsV2) => {
    if (query?.length) {
      const title = removeVietnameseTones(col.label.toLowerCase());
      const _query = removeVietnameseTones(query.trim().toLowerCase());
      if (!title.includes(_query)) {
        return false;
      }
    }
    return true;
  };

  const handleSaveColumns = () => {
    const cols = columnGroups.flatMap((e) => e.items.map((e) => e.name));
    let keys = selectedColumns.map((e) => e.name);
    let listSetting: any = {};
    keys.forEach((key) => {
      listSetting[key] = true;
    });
    cols.forEach((keyDefault) => {
      if (Object.keys(listSetting).findIndex((m) => m === keyDefault) < 0) {
        listSetting[keyDefault] = false;
      }
    });
    closeModal({ ...listSetting });
  };

  const handleReset = () => {
    const cols = columnGroups.flatMap((e) => e.items.filter((e) => e.defaultSelected));
    setSelectedColumns(cols);
    setQuery("");
  };

  const handleClose = () => {
    closeModal();
  };

  const handleSearch = (e: React.SyntheticEvent<HTMLElement>, value: any) => {
    setQuery(value);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(selectedColumns, result.source.index, result.destination.index);
    setSelectedColumns(items);
  };

  const handleSelect = (column: ColumnsV2) => {
    setSelectedColumns((prev) => {
      const selectedItem = !!prev.filter((e) => e.name === column.name)?.[0]
        ? prev.filter((e) => e.name !== column.name)
        : [...prev, column];
      if (sortable) return selectedItem;
      return columnGroups
        .map((cg) => cg.items)
        .flat()
        .filter((cgi) => selectedItem.some((si) => si.name === cgi.name));
    });
  };

  const isSelected = (column: ColumnsV2) => {
    return !!selectedColumns.filter((e) => e.name === column.name)?.[0];
  };

  const refContentBox = useRef<any>();
  const refContentBoxHeight = useRef<number>();

  const [forceRerender, setForceRerender] = useState(true);
  const loadingRef = useRef<any>(false);

  useEffect(() => {
    if (forceRerender) {
      setForceRerender(false);
    }
  }, [forceRerender]);

  if (!loadingRef.current && (!refContentBox || !refContentBox?.current)) {
    loadingRef.current = true;
    _.debounce(() => {
      setForceRerender(true);
      loadingRef.current = false;
    }, 300)();
  }
  if (refContentBox?.current?.clientHeight && !refContentBoxHeight?.current) {
    refContentBoxHeight.current = refContentBox?.current?.clientHeight;
  }

  return (
    <Dialog open={true} onClose={handleClose} aria-labelledby="form-dialog-title" className={classes.root}>
      <DialogTitle id="form-dialog-title" disableTypography>
        <Box display="flex" flexDirection="column">
          <Typography variant="h4" style={{ marginBottom: 4 }}>
            {title}
          </Typography>
          {description ? <Typography color="secondary">{description}</Typography> : null}
        </Box>
        <IconButton aria-label="close" onClick={handleClose} classes={{ root: classes.rootIconButton }}>
          <CloseIcon className={classes.iconClose} />
        </IconButton>
      </DialogTitle>
      <DialogContent ref={refContentBox} className={classes.container}>
        <Box className={classes.contentItemBox}>
          <Typography className={classes.titleBoxItem}>{"Thêm cột hiển thị"}</Typography>
          <Box className={classes.itemContentBox}>
            <SearchBox
              placeholder={"Tìm kiếm cột"}
              className={classes.searchbox}
              value={query}
              onChange={handleSearch}
            />
            {/* 150 là trừ đi title và ô search  */}
            <Box
              className={classes.boxMenuList}
              height={refContentBoxHeight.current ? refContentBoxHeight.current - 150 : 0}
            >
              {columnGroups.map((columnGroup, index) => {
                const isMultipleGroup = columnGroups.length > 1;
                const itemsShow = columnGroup.items.filter((e) => isShow(e) && !e.hidden);
                if (!itemsShow.length) {
                  return null;
                }
                return (
                  <Box
                    key={"columnGroup-" + columnGroup.name + index}
                    style={{
                      padding: isMultipleGroup ? "12px" : 0,
                      paddingTop: index === 0 && isMultipleGroup ? "12px" : 0,
                      paddingBottom: 0,
                    }}
                  >
                    {isMultipleGroup && (
                      <Typography className={classes.columnGroupTitle}>{columnGroup.name}</Typography>
                    )}
                    <MenuList className={classes.menuList} disabledItemsFocusable={columnGroup.disable}>
                      {itemsShow.map((column, index) => {
                        return (
                          <MenuItem
                            key={`items-${index}`}
                            onClick={() => handleSelect(column)}
                            className={classes.disableMenuItem}
                            disabled={column.disable}
                          >
                            <Checkbox checked={isSelected(column)} disabled={column.disable} style={{ margin: 0 }} />
                            <Typography style={{ paddingLeft: "8px" }}>{column.label}</Typography>
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        <Box className={classes.contentItemBox}>
          <Typography className={classes.titleBoxItem}>Cột hiển thị</Typography>
          {/* fix code tạm để fit form */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided: any, snapshot: any) => (
                <Box
                  className={classes.itemContentBox}
                  height={refContentBoxHeight.current ? refContentBoxHeight.current - 97 : 0}
                  overflow="auto"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={sortable ? getListStyle(snapshot.isDraggingOver) : {}}
                >
                  {selectedColumns.map((column, index) => (
                    <Draggable key={column.name} draggableId={column.name} index={index} isDragDisabled={!sortable}>
                      {(provided: any, snapshot: any) => (
                        <Box
                          className={classes.columnSelectedBox}
                          key={"column-" + column.name + index}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={
                            column.hidden
                              ? { display: "none" }
                              : sortable
                              ? getItemStyle(snapshot.isDragging, provided.draggableProps.style)
                              : {}
                          }
                        >
                          <Typography>{column.label}</Typography>
                          {!column.disable ? (
                            <IconButton
                              classes={{ root: classes.iconButton }}
                              className={clsx("icon-btn btn-subtract")}
                              onClick={() => handleSelect(column)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          ) : null}
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  <Box visibility="hidden">{provided.placeholder}</Box>
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </DialogContent>

      <DialogActions style={{ padding: "0 24px 16px 24px" }}>
        <Button color="primary" variant="outlined" size="small" onClick={handleReset}>
          {"Quay về mặc định"}
        </Button>
        <Button onClick={handleClose} color="primary" variant="outlined" size="small" style={{ marginLeft: "16px" }}>
          {"Thoát"}
        </Button>
        <Button
          onClick={handleSaveColumns}
          color="primary"
          variant="contained"
          size="small"
          style={{ marginLeft: "16px" }}
        >
          {"Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingColumnsV2;

const reorder = (list: ColumnsV2[], startIndex: any, endIndex: any) => {
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
