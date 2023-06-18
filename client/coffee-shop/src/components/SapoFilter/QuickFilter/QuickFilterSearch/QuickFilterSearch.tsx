import React, { Fragment, useEffect, useRef, useState } from "react";
import QuickFilterButton, { QuickFilterButtonProps } from "../QuickFilterButton";
import { isArray } from "lodash";
import { Box, makeStyles, Theme } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { QueryFilterType } from "components/SapoFilter/FilterItems/FilterSearch/types";
import Popper from "components/Popper/PopperBase";
import SearchSuggest from "components/AutocompleteCustom/SearchSuggest";
import Button from "components/Button";

const useStyles = makeStyles((theme: Theme) => ({
  rootPopover: {
    padding: "8px 4px 0",
  },
}));

export interface QuickFilterSearchProps {
  label: string;
  paging?: boolean;
  multiple?: boolean;
  value?: any[] | any | null;
  dataSource?: any[];
  placeholder?: string;
  textNoOption?: string;
  uniqKey?: string;
  optionSelectAll?: boolean;
  placement?: string;
  btnProps?: QuickFilterButtonProps;
  getOptionLabel?: (options: any) => string;
  fetchDataSource?: (filter: any) => Promise<any | undefined>;
  onSubmit?: (values: any) => void;
  onQueryChange?: (filter: QueryFilterType) => any;
  onChange?: (value: any[] | any) => any;
  widthPopper?: string | number;
  disableSearch?: boolean;
}

function QuickFilterSearch(props: QuickFilterSearchProps) {
  const { t } = useTranslation(["component"]);
  const {
    label,
    paging,
    multiple,
    placeholder = "Tìm kiếm",
    textNoOption = t("component:filter.searchEmpty"),
    uniqKey,
    value,
    onSubmit,
    btnProps,
    placement,
    fetchDataSource,
    onQueryChange,
    getOptionLabel,
    optionSelectAll,
    onChange,
    widthPopper = 350,
    disableSearch,
  } = props;

  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState("");
  const didMountRef = useRef(false);
  const [open, setOpen] = useState(false);
  const refPopper = useRef(null);
  const [metaData, setMetaData] = useState({
    currentPage: 1,
    totalPage: 0,
  });
  const classes = useStyles();

  const [_value, _setValue] = useState<any | null | undefined>(!isArray(value) ? value : null);
  const [_values, _setValues] = useState<any[] | null | undefined>(isArray(value) ? value : null);

  useEffect(() => {
    if (open) {
      if (multiple) {
        _setValues(value);
      } else {
        _setValue(value);
      }
    }
  }, [open, value]);

  useEffect(() => {
    if (didMountRef.current && open) {
      handleQueryChange(1);
    } else {
      didMountRef.current = true;
    }
  }, [query]);

  const handleInputChange = (value: string) => {
    setQuery(value);
  };

  const handleQueryChange = (page = metaData.currentPage, _open: boolean = open) => {
    if (onQueryChange && fetchDataSource && _open) {
      let filter = onQueryChange?.({ page: page, query: query });
      fetchDataSource(filter).then((res: any) => {
        if (paging && res?.metaData) {
          setMetaData({
            ...metaData,
            currentPage: page,
            totalPage: res.metaData.totalPage,
          });
        }
        if (res?.data) {
          setOptions(res.data);
          setLoading(false);
        }
      });
    }
  };

  const handleChange = (value: any) => {
    if (multiple) {
      onChange?.(value);
      _setValues(value);
    } else {
      onChange?.(value);
      _setValue(value);
    }
  };

  const handleSubmit = () => {
    if (multiple) {
      onSubmit?.(_values);
    } else {
      onSubmit?.(_value);
    }
    setOpen(false);
    setQuery("");
    setMetaData({ currentPage: 1, totalPage: 0 });
  };

  return (
    <Fragment>
      <QuickFilterButton
        ref={refPopper}
        active={open}
        onClick={() => {
          setOpen(!open);
          if (!open) {
            setLoading(true);
            handleQueryChange(undefined, true);
          }
        }}
        children={label}
        {...btnProps}
      />

      <Popper
        referenceElement={refPopper.current}
        width={widthPopper}
        open={open}
        ignoreEventCloseInRootRef={true}
        onClose={() => {
          setOpen(false);
          setQuery("");
          setMetaData({ currentPage: 1, totalPage: 0 });
        }}
        placement={placement}
      >
        <Box className={classes.rootPopover}>
          <Fragment>
            <SearchSuggest
              variant="inline"
              optionSelectAll={optionSelectAll}
              uniqKey={uniqKey}
              autoFocus
              //disableSearch={disableSearch}
              options={options}
              openOnFocus={true}
              width="100%"
              paging={paging}
              multiple={multiple}
              value={_values}
              loading={loading}
              debounce={300}
              getOptionLabel={getOptionLabel}
              placeholder={placeholder}
              textNoOption={textNoOption}
              onInputChange={(value) => handleInputChange(value)}
              showResult
              textSelectAll={`${t("component:filter.selectAll")}`}
              textButtonShowResult={`${t("component:filter.selected")}`}
              maxHeightListOption={144}
              onChange={handleChange}
              handlePagingChange={(type) => {
                let newPage = type === "next" ? metaData.currentPage + 1 : metaData.currentPage - 1;
                setMetaData({
                  ...metaData,
                  currentPage: newPage,
                });
                handleQueryChange(newPage);
              }}
              checkActivePagingBtn={(type) => {
                if (type === "next") return metaData.totalPage <= metaData.currentPage;
                else return metaData.currentPage <= 1;
              }}
            />
            {onSubmit && (
              <Button
                size="small"
                color="primary"
                variant="contained"
                style={{ width: "100%", marginTop: 16, marginBottom: 16 }}
                onClick={handleSubmit}
              >
                {`${t("component:filter.filterBtnText")}`}
              </Button>
            )}
          </Fragment>
        </Box>
      </Popper>
    </Fragment>
  );
}

export default QuickFilterSearch;
