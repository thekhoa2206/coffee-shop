import React, { useEffect, useRef, useState } from "react";
import SearchSuggest from "components/Filter";
import { QueryFilterType } from "./types";
import { useTranslation } from "react-i18next";

interface FilterSearchProps<D, F> {
  paging?: boolean;
  multiple?: boolean;
  value?: any;
  dataSource?: D;
  placeholder?: string;
  textNoOption?: string;
  uniqKey?: string;
  type?: "search" | "search-tags";
  optionSelectAll?: boolean;
  getOptionLabel: (options: any) => string;
  fetchDataSource: (filter: F) => any;
  onChange: (values: any) => void;
  onQueryChange?: (filter: QueryFilterType) => any;
  disableLoading?: boolean;
  placeholderSelect?: string;
  label?: string;
}

function FilterSearch<D, T>(props: FilterSearchProps<D, T>) {
  const {
    paging,
    multiple,
    placeholder,
    textNoOption,
    uniqKey,
    value,
    onChange,
    fetchDataSource,
    onQueryChange,
    getOptionLabel,
    optionSelectAll,
    disableLoading,
    label,
    placeholderSelect,
  } = props;
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState("");
  const didMountRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [metaData, setMetaData] = useState({
    currentPage: 1,
    totalPage: 0,
  });

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

  const handleQueryChange = (page = metaData.currentPage, _open = open) => {
    if (onQueryChange && _open) {
      let filter = onQueryChange?.({ page: page, query: query });
      fetchDataSource(filter).then((res: any) => {
        if (paging) {
          if (res?.metaData)
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
  const { t } = useTranslation(["component"]);
  return (
    <SearchSuggest
      label={label}
      placeholderSelect={placeholderSelect}
      // openOnFocus={true}
      optionSelectAll={optionSelectAll}
      uniqKey={uniqKey}
      options={options}
      width="100%"
      paging={paging}
      multiple={multiple}
      value={value}
      debounce={300}
      type="select-search"
      loading={loading && !disableLoading}
      getOptionLabel={getOptionLabel}
      placeholder={placeholder}
      textNoOption={textNoOption}
      onInputChange={(value) => handleInputChange(value)}
      showResult
      textSelectAll={`${t("component:filter.selectAll")}`}
      textButtonShowResult={`${t("component:filter.selected")}`}
      onOpen={() => {
        setLoading(true);
        setOpen(true);
        handleQueryChange(undefined, true);
      }}
      onClose={() => {
        setOpen(false);
        setQuery("");
        setMetaData({ currentPage: 1, totalPage: 0 });
      }}
      maxHeightListOption={144}
      onChange={onChange}
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
  );
}

export default FilterSearch;
