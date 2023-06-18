import { Box, createStyles, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import { isEqual } from "lodash";
import React, { Fragment, memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { colorInk } from "theme/palette";
import useModal from "../../../../Modal/useModal";
import InputTags from "./TagsSuggest/InputTags";
import PopperSuggestItem, { PopperSuggestItemProps, PopperSuggestItemRef } from "./TagsSuggest/PopperSuggestItem";
import TagFilterSuggest from "components/SapoFilter/FilterItems/FilterTags/FilterTags";
import { QueryFilterType } from "components/SapoFilter/FilterItems/FilterSearch/types";

export type SuggestTagFilter = {
  query?: string;
  limit?: number;
  page?: number;
};
interface FilterTagsProps {
  value: any[] | null | undefined;
  onChange: (value: any[]) => any;
  getOptionLabel?: (option: any) => string;
  uniqKey?: string;
  label?: string;
  deleteAll?: () => void;
  placeholder?: string;
  PopperSuggestItemProps?: Partial<PopperSuggestItemProps>;
  className?: string;
  isTag?: boolean;
  isSerial?: boolean;
  onchangeSerial?: (values: any) => void;
}

const useStyle = makeStyles(() =>
  createStyles({
    boxLabel: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
      "& .deleted-all-btn": {
        cursor: "pointer",
      },
    },
  })
);

const FilterTags = (props: FilterTagsProps) => {
  const { value, label, placeholder, onChange, uniqKey = "id", className, isTag, getOptionLabel, deleteAll, isSerial } = props;
  const { openModal } = useModal();
  const { t } = useTranslation("component");
  const classes = useStyle();
  const refInput = useRef<any | null>(null);
  const [active, setActive] = useState(false);
  const [showSelectSerial, setShowSelectSerial] = useState(false);
  const refPopper = useRef<PopperSuggestItemRef>();

  const openPopper = () => {
    if (active && !isSerial) {
      refPopper.current?.close();
      setActive(false);
      return;
    }
    if(!isSerial) {
      setActive(true);
      openModal(PopperSuggestItem, {
        referenceElement: refInput.current,
        value: value,
        onChange: onChange,
        uniqKey: uniqKey,
        getOptionLabel: getOptionLabel,
        ref: refPopper,
        isTag: isTag,
        ...props.PopperSuggestItemProps,
      })
        .result.then(() => {})
        .finally(() => {
          setActive(false);
        });
    } else {
      setActive(!showSelectSerial);
      setShowSelectSerial(!showSelectSerial);
    }
  };

  const compareItem = (item: any, other: any) => {
    if (isTag) {
      return item === other;
    }
    return uniqKey ? (item as any)[uniqKey] === (other as any)[uniqKey] : isEqual(item, other);
  };

  const isSelectedItem = (item: any) => {
    return !!value?.some((m) => compareItem(m, item));
  };

  const handleDeleteAll = useCallback(() => {
    onChange([]);
  }, [onChange, value]);

  return (
    <Fragment>
      <Box className={classes.boxLabel}>
        {label ? <Typography style={{ color: colorInk.base80 }}>{label}</Typography> : null}
        {value && value.length > 0 ? (
          <Typography onClick={handleDeleteAll} className={"deleted-all-btn"} variant={"body1"} color={"primary"}>
            Xóa tất cả
          </Typography>
        ) : null}
      </Box>
      <div className={clsx(className, "FilterTags-root")} ref={refInput}>
        <InputTags
          active={active}
          placeholder={placeholder}
          RootBoxProps={{
            onClick: () => openPopper(),
          }}
          onDelete={(item) => {
            let newValue;
            if (isSelectedItem(item)) {
              newValue = value?.filter((m) => !compareItem(m, item)) || [];
            } else {
              newValue = value ? [...value, item] : [item];
            }
            if(!isSerial) refPopper.current?.setValue(newValue);
            onChange(newValue);
          }}
          value={value}
          getOptionLabel={getOptionLabel}
        />
      </div>
      {showSelectSerial && (
        <Box marginTop={1}>
          <TagFilterSuggest
            placeholder={props.PopperSuggestItemProps?.placeholder}
            getOptionLabel={getOptionLabel || (() => "")}
            paging
            value={value}
            fetchDataSource={async (filter: SuggestTagFilter) => []}
            onChange={onChange || (() => {})}
            onQueryChange={(filter: QueryFilterType) => ({})}
          />
        </Box>)
      }
    </Fragment>
  );
};

export default memo(FilterTags);
