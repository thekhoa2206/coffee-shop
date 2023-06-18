import React, { useEffect, useState } from "react";
import { Box, FormControlLabel, makeStyles, RadioGroup, Theme, Typography } from "@material-ui/core";
import Checkbox from "components/Checkbox";
import { isArray, isEqual } from "lodash";
import Radio from "components/RadioGroup/Radio";

export interface BaseFilterFixedModel<T> {
  value: T;
  label: string;
}

export interface FilterFixedProps<T> {
  options: T[];
  uniqKey?: string;
  value?: T[] | T;
  type?: string;
  onChange?: (values: T[] | T) => void;
  checkShow?: (item: T) => boolean;
  getOptionLabel: (item: T) => string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    height: 30,
    boxSizing: "border-box",
    cursor: "pointer",
  },
  checkbox: {
    padding: 6,
    marginRight: 4,
  },
}));

function FilterFixed<T>(props: FilterFixedProps<T>) {
  const { options, uniqKey, value, type = "checkbox", getOptionLabel, onChange, checkShow } = props;
  const classes = useStyles();
  const [itemsSelected, setItemsSelected] = useState<T[]>([]);
  const [itemSelected, setItemSelected] = useState<T | "">("");

  const compareItem = (item: T, other: T) => {
    return uniqKey ? (item as any)[uniqKey] === (other as any)[uniqKey] : isEqual(item, other);
  };
  useEffect(() => {
    if (value) {
      if (type === "checkbox" && isArray(value)) {
        setItemsSelected(options.filter((item) => value.find((m) => compareItem(item, m))));
      } else if (type === "radio" && !isArray(value)) {
        let item = options.find((item) =>
          uniqKey ? (item as any)[uniqKey] === (value as any)[uniqKey] : item === value
        );
        setItemSelected(item || "");
      }
    } else {
      setItemSelected("");
      setItemsSelected([]);
    }
  }, [value]);

  const handleClickItemCheckbox = (item: T) => {
    let hasItemSelected = itemsSelected.some((m) => compareItem(item, m));
    let newItemsSelected: T[] = [];
    if (hasItemSelected) {
      newItemsSelected.push(...itemsSelected.filter((m) => !compareItem(item, m)));
    } else {
      newItemsSelected.push(...itemsSelected, item);
    }
    setItemsSelected(newItemsSelected);
    onChange?.(newItemsSelected);
  };

  const convertType = (type: string, item: any) => {
    switch (type) {
      case "number":
        return Number(item);
      case "string":
        return String(item);
    }
    return "";
  };

  const handleChangeItemRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    let typeofValue = "";
    if (uniqKey) {
      typeofValue = typeof (options[0] as any)[uniqKey];
    } else {
      typeofValue = typeof options[0];
    }
    let value = convertType(typeofValue, event.target.value);
    let newItem = options.find((item) => (uniqKey ? (item as any)[uniqKey] === value : item === (value as any)));
    if (newItem) {
      setItemSelected(newItem);
      onChange?.(newItem);
    }
  };

  const isSelectedItem = (item: T) => {
    return itemsSelected.some((m) => compareItem(m, item));
  };

  if (options.length > 0 && type === "checkbox") {
    return (
      <Box padding="0 12px">
        {React.Children.toArray(
          options
            .filter((item) => (checkShow ? checkShow(item) : true))
            .map((item) => (
              <Box className={classes.root} onClick={() => handleClickItemCheckbox(item)}>
                <Checkbox className={classes.checkbox} checked={isSelectedItem(item)} />
                <Typography>{getOptionLabel(item)}</Typography>
              </Box>
            ))
        )}
      </Box>
    );
  } else if (options.length > 0 && type === "radio") {
    return (
      <Box padding="0 24px">
        <RadioGroup
          value={uniqKey && itemSelected ? (itemSelected as any)[uniqKey] : itemSelected}
          onChange={handleChangeItemRadio}
        >
          {React.Children.toArray(
            options
              .filter((item) => (checkShow ? checkShow(item) : true))
              .map((item) => (
                <FormControlLabel
                  value={uniqKey ? (item as any)[uniqKey] : item}
                  control={<Radio />}
                  label={getOptionLabel(item)}
                  className={classes.root}
                />
              ))
          )}
        </RadioGroup>
      </Box>
    );
  }
  return <> </>;
}

export default FilterFixed;
