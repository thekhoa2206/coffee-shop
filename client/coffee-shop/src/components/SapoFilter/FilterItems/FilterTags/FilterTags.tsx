import React, { useEffect, useRef, useState } from "react";
import TagsSuggest from "components/AutocompleteCustom/TagSuggest";
import { QueryFilterType } from "../FilterSearch/types";

interface FilterSearchProps<D, F> {
  error?: boolean;
  paging?: boolean;
  value?: any;
  dataSource?: D;
  placeholder?: string;
  uniqKey?: string;
  getOptionLabel: (options: any) => string;
  fetchDataSource: (filter: F) => any;
  onChange: (values: any) => void;
  onBlur?: (values: any) => void;
  onRemoveTag?: (values: any) => void;
  onQueryChange?: (filter: QueryFilterType) => any;
}

function FilterTags<D, T>(props: FilterSearchProps<D, T>) {
  const {
    paging,
    placeholder,
    uniqKey,
    value,
    onBlur,
    onChange,
    onRemoveTag,
    fetchDataSource,
    onQueryChange,
    getOptionLabel,
    error,
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

  const handleQueryChange = (page = metaData.currentPage) => {
    if (onQueryChange) {
      let filter = onQueryChange?.({ page: page, query: query });
      fetchDataSource(filter).then((res: any) => {
        if (paging && res?.metaData?.totalPage) {
          setMetaData({
            ...metaData,
            currentPage: page,
            totalPage: res.metaData.totalPage,
          });
        }
        if (res?.data) {
          setOptions(res.data);
        }
        setLoading(false);
      });
    }
  };

  return (
    <TagsSuggest
      error={error}
      uniqKey={uniqKey}
      options={options}
      width="100%"
      paging={paging}
      value={value}
      debounce={300}
      loading={loading}
      openOnFocus={true}
      getOptionLabel={getOptionLabel}
      placeholder={placeholder}
      onInputChange={(value) => handleInputChange(value)}
      onOpen={() => {
        setLoading(true);
        handleQueryChange();
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
        setMetaData({ currentPage: 1, totalPage: 0 });
      }}
      maxHeightListOption={144}
      onChange={onChange}
      onBlur={onBlur}
      onRemoveTag={onRemoveTag}
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

export default FilterTags;
