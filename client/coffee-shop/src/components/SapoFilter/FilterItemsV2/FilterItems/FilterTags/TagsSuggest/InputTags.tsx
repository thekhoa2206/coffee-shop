import { Box, BoxProps, Chip, makeStyles, Theme, Typography } from "@material-ui/core";
import React, { memo, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { cloneDeep, toString } from "lodash";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import clsx from "clsx";
import { colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "relative",
    width: "100%",
    minHeight: 40,
    border: "1px solid #D3D5D7",
    boxSizing: "border-box",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    padding: "4px 22px 4px 12px",
    flexWrap: "wrap",
    cursor: "pointer",
    "&.active, &.open": {
      maxHeight: 150,
      overflow: "auto",
      borderColor: theme.palette.primary.main,
      "&.open": {
        "& svg": {
          color: theme.palette.primary.main,
          transform: "rotate(180deg)",
        },
      },
    },
  },
  boxArrowIcon: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    right: 12,
    width: 24,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      color: colorInk.base40,
      width: 24,
      height: 24,
    },
  },
  chip: {
    height: 24,
    maxWidth: "100%",
    borderRadius: 20,
    background: "#E6F4FF",
    fontSize: 14,
    cursor: "pointer",
    margin: "2px 5px 2px 0",
    "& .MuiChip-deleteIcon": {
      width: 18,
      height: 18,
      color: theme.palette.primary.main,
    },
  },
  smallChip: {
    height: 24,
    maxWidth: "100%",
    borderRadius: 20,
    background: "#E6F4FF",
    fontSize: 13,
    cursor: "pointer",
    margin: "2px 5px 2px 0",
    "& .MuiChip-deleteIcon": {
      width: 12,
      height: 12,
      color: theme.palette.primary.main,
    },
  },
}));

interface InputTagsProps {
  value: any[] | null | undefined;
  getOptionLabel?: (option: any) => string;
  limit?: number;
  onDelete?: (option: any) => void;
  RootBoxProps?: BoxProps;
  placeholder?: string;
  active?: boolean;
  className?: string;
  size?: boolean;
}

const InputTags = (props: InputTagsProps) => {
  const { value, getOptionLabel, onDelete, placeholder, active, limit = 3, className, size } = props;
  const classes = useStyles();
  const [showAll, setshowAll] = useState(false);

  return (
    <Box className={clsx(classes.root, { active: !!value?.length, open: active }, className)} {...props.RootBoxProps}>
      {!value?.length && <Typography style={{ lineHeight: "16px" }}>{placeholder}</Typography>}
      {!showAll
        ? cloneDeep(value)
          ?.splice(0, 3)
          ?.map((item, idx) => (
            <Chip
              label={getOptionLabel ? getOptionLabel(item) : toString(item)}
              onDelete={(e) => onDelete?.(item)}
              onClick={() => {
                setshowAll(!showAll);
              }}
              className={size && size === true ? classes.smallChip : classes.chip}
              key={`${idx}-${getOptionLabel ? getOptionLabel(item) : toString(item)}`}
              deleteIcon={<ClearIcon />}
            />
          ))
        : cloneDeep(value)?.map((item, idx) => (
          <Chip
            label={getOptionLabel ? getOptionLabel(item) : toString(item)}
            onDelete={(e) => onDelete?.(item)}
            onClick={() => {
              setshowAll(!showAll);
            }}
            className={classes.chip}
            key={`${idx}-${getOptionLabel ? getOptionLabel(item) : toString(item)}`}
            deleteIcon={<ClearIcon />}
            style={{ maxHeight: 250, overflow: "auto" }}
          />
        ))}
      {!showAll &&
        (value && value.length > limit ? (
          <Chip
            label={`+${value.length - limit}`}
            onClick={() => {
              setshowAll(!showAll);
            }}
            className={size && size === true ? classes.smallChip : classes.chip}
          />
        ) : null)}
      <Box className={classes.boxArrowIcon}>
        <ArrowDropDownIcon />
      </Box>
    </Box>
  );
};

export default memo(InputTags);
