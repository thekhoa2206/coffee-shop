import React, { useMemo } from "react";
import { Box, makeStyles, Theme, Typography } from "@material-ui/core";
import { isArray, isEqual } from "lodash";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

export interface FilterFixedV2Props<T> {
  options: T[];
  multiple?: boolean;
  uniqKey?: string;
  value?: T[] | T;
  onChange?: (values: T[] | T | null) => void;
  checkShow?: (item: T) => boolean;
  getOptionLabel: (item: T) => string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  toggleButtonGroup: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  toggleButton: {
    height: 40,
    width: "calc(50% - 2px)",
    borderRadius: "3px !important",
    border: "1px solid #D3D5D7 !important",
    margin: "2px 0",
    marginLeft: "0 !important",
    textTransform: "unset",
    backgroundColor: "#fff",
    transition: "200ms",
    "&:hover": {
      backgroundColor: "#E6F4FF",
      "& .MuiTypography-root": {
        color: theme.palette.primary.main,
      },
    },
    "&.Mui-selected": {
      backgroundColor: "#E6F4FF !important",
      "& .MuiTypography-root": {
        color: theme.palette.primary.main,
      },
    },
  },
}));

function FilterFixedV2<T>(props: FilterFixedV2Props<T>) {
  const { options, uniqKey, value, getOptionLabel, onChange, checkShow, multiple } = props;
  const classes = useStyles();
  const compareItem = (item: any, other: any) => {
    return uniqKey ? item[uniqKey] === other[uniqKey] : isEqual(item, other);
  };

  let itemsSelected = useMemo(
    () => (value && isArray(value) ? options.filter((item) => value.find((m) => compareItem(item, m))) : []),
    [value]
  );
  let itemSelected = useMemo(
    () =>
      value && !isArray(value)
        ? options.find((item) => (uniqKey ? (item as any)[uniqKey] === (value as any)[uniqKey] : item === value)) ?? ""
        : "",
    [value]
  );

  const handleChange = (event: React.MouseEvent<HTMLElement>, keys: any) => {
    if (multiple) {
      let items = options.filter((item: any) =>
        keys.find((m: any) =>
          uniqKey && item[uniqKey] !== null && item[uniqKey] !== undefined ? m === item[uniqKey] : m === item
        )
      );
      onChange?.(items);
    } else {
      let newItem = options.find((item) => (uniqKey ? (item as any)[uniqKey] === keys : item === (keys as any)));
      onChange?.(newItem || null);
    }
  };

  return (
    <Box padding="0">
      <ToggleButtonGroup
        value={
          !multiple
            ? uniqKey && itemSelected
              ? (itemSelected as any)[uniqKey]
              : itemSelected
            : itemsSelected.map((item: any) => (uniqKey ? item[uniqKey] : item))
        }
        exclusive={!multiple}
        onChange={handleChange}
        classes={{ root: classes.toggleButtonGroup }}
      >
        {React.Children.toArray(
          options
            .filter((item) => (checkShow ? checkShow(item) : true))
            .map((item) => (
              <ToggleButton value={uniqKey ? (item as any)[uniqKey] : item} classes={{ root: classes.toggleButton }}>
                <Typography color="textPrimary">{getOptionLabel(item)}</Typography>
              </ToggleButton>
            ))
        )}
      </ToggleButtonGroup>
    </Box>
  );
}

export default FilterFixedV2;
