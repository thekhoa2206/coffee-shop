import React, { useEffect, useState } from "react";
import { ColumnsV2 } from "./SettingColumnsV2";
import { MenuItem, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import _, { isEqual } from "lodash";
import Checkbox from "components/Checkbox";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    disableMenuItem: {
      "&.MuiListItem-root.Mui-disabled": {
        opacity: 1,
      },
    },
  })
);

const ColumnSettingColumnGroupsComponent = (props: { items: ColumnsV2[]; onChange: (data: ColumnsV2[]) => void }) => {
  const { items, onChange } = props;
  const [selected, setSelected] = useState<boolean[]>(items.map((i) => !!i.defaultSelected));
  useEffect(() => {
    const _newData = _.cloneDeep(items);
    for (let i = 0; i < selected.length; i++) {
      _newData[i].defaultSelected = selected[i];
    }
    if (!_.isEqual(_newData, items)) {
      onChange(_newData);
    }
  }, [selected]);

  useEffect(() => {
    setSelected(items.map((i) => !!i.defaultSelected));
  }, [items]);

  const classes = useStyles();

  return (
    <>
      {items.map((column, index) => {
        return (
          <MenuItem
            key={`items-${index}`}
            onClick={(event) => {
              setSelected((prevState) => {
                prevState[index] = !prevState[index];
                return [...prevState];
              });
            }}
            className={classes.disableMenuItem}
            disabled={column.disable}
          >
            <Checkbox checked={selected[index]} disabled={column.disable} style={{ margin: 0 }} />
            <Typography style={{ paddingLeft: "8px" }}>{column.label}</Typography>
          </MenuItem>
        );
      })}
    </>
  );
};
export default ColumnSettingColumnGroupsComponent;
