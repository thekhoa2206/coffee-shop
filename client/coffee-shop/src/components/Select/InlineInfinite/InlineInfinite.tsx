import { Box, MenuItem } from "@material-ui/core";
import CircularProgress from "components/Loading/CircularProgress";
import { PopperBaseProps } from "components/Popper/PopperBase";
import SearchBox from "components/SearchBox/SearchBox";
import useDebounce from "hocs/useDebounce";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { v4 as uuidv4 } from "uuid";
import useStyles from "./InlineInfinite.styles";
import clsx from "clsx";
import { DataSource, InfiniteScrollProps } from "../types";
import { isNil } from "lodash";

interface InlineInfiniteProps {
  value: any;
  onChange: (value: any) => any;
  getOptionLabel: (options: any) => string;
  placeholder?: string;
  height?: number | string;
  maxHeight?: number | string;
  renderOption?: (value: any) => React.ReactNode;
  onQueryChange?: (filter: { page: number; limit: number; query: string }) => any;
  fetchDataSource: (filter: any) => Promise<DataSource | undefined>;
  PopperBaseProps?: PopperBaseProps;
  uniqKey?: string;
  NoResultsComponent?: any;
  textNoResults?: string;
  debounce?: number;
  className?: string;
  didMount?: boolean;
  disabledSelect?: boolean;
  limit?: number;
  autoFocus?: boolean;
  InfiniteScrollProps?: InfiniteScrollProps;
  query?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>, option?: any) => void;
}

interface InlineInfiniteRef {
  //todo
}

const InlineInfinite = React.forwardRef<InlineInfiniteRef, InlineInfiniteProps>((props, ref) => {
  const { t } = useTranslation(["component"]);
  const {
    onChange,
    renderOption,
    uniqKey = "id",
    fetchDataSource,
    onQueryChange,
    placeholder = t("component:filter.search"),
    getOptionLabel,
    NoResultsComponent,
    debounce = 300,
    height,
    maxHeight,
    className,
    didMount = true,
    limit = 10,
    disabledSelect,
    autoFocus = true,
    textNoResults = t("component:filter.searchEmpty"),
    onKeyDown,
  } = props;
  const classes = useStyles();
  const didMountRef = useRef(didMount);
  const refInput = useRef<HTMLDivElement | null>(null);
  const uniqIdComponent = useMemo(() => uuidv4(), []);

  const [value, setValue] = useState<any | null | undefined>(props.value || null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<any[]>([]);
  const [query, setQuery] = useState<string>(isNil(props.query) ? "" : props.query);
  const queryDebounce = useDebounce(query, debounce);
  const [metaData, setMetaData] = useState({
    currentPage: 1,
    totalPage: 0,
    totalItems: 0,
  });

  React.useImperativeHandle(ref, () => ({
    setQuery(value: any) {
      setQuery(value);
    },
    setValue(value: any) {
      setValue(value);
    },
  }));

  const handleQueryChange = (page = metaData.currentPage, append = false) => {
    let filter = onQueryChange?.({ page: page, query: queryDebounce, limit: limit });
    fetchDataSource(filter).then((res) => {
      if (res?.metaData) {
        setMetaData({
          currentPage: page,
          totalPage: res.metaData.totalPage,
          totalItems: res.metaData.totalItems,
        });
      }
      if (res?.data) {
        setOptions((prev) => (append ? [...prev, ...res.data] : res.data));
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (didMountRef.current) {
      handleQueryChange(1);
      refInput.current?.focus();
    } else {
      didMountRef.current = true;
    }
  }, [queryDebounce]);

  const isSelected = useCallback(
    (dataItem: any) => {
      if (disabledSelect) return false;
      return value?.[uniqKey] === dataItem?.[uniqKey];
    },
    [value, options]
  );

  const handleChangValue = useCallback((dataItem) => {
    setValue(dataItem);
    onChange(dataItem);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        const parentNode = document.querySelector(`[wrapper-suggest='${uniqIdComponent}']`);
        const itemFocus = parentNode?.querySelector(".focus-key-event");
        const listSuggestItem = parentNode?.querySelectorAll(`[key-event='true']`);
        if (listSuggestItem && itemFocus) {
          const sizeItems = listSuggestItem.length;
          for (let i = 0; i < sizeItems; i++) {
            const item = listSuggestItem[i];
            if (item.classList.contains("focus-key-event")) {
              item.classList.remove("focus-key-event");
              let indexFocus = i;
              if (event.key === "ArrowDown") {
                indexFocus = i !== sizeItems - 1 ? i + 1 : 0;
              } else {
                indexFocus = i !== 0 ? i - 1 : 0;
              }
              listSuggestItem[indexFocus].scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
              listSuggestItem[indexFocus].classList.add("focus-key-event");
              break;
            }
          }
        } else if (listSuggestItem && listSuggestItem.length > 0 && event.key === "ArrowDown") {
          listSuggestItem[0].classList.add("focus-key-event");
        }
        onKeyDown?.(event);
        break;
      case "Enter":
        const optionFocus = document.querySelector(`[wrapper-suggest='${uniqIdComponent}'] .focus-key-event`);
        const idFocus = optionFocus?.getAttribute("data-id");
        const newValue = options.find((e) => e[uniqKey]?.toString() === idFocus);
        newValue && handleChangValue(newValue);
        onKeyDown?.({ ...event, target: optionFocus as any }, newValue);
        break;
      default:
        onKeyDown?.(event);
        break;
    }
  };

  const removeFocused = useCallback(() => {
    const parentNode = document.querySelector(`[wrapper-suggest='${uniqIdComponent}']`);
    const itemFocus = parentNode?.querySelector(".focus-key-event");
    const listSuggestItem = parentNode?.querySelectorAll(`[key-event='true']`);
    if (listSuggestItem && itemFocus) {
      const sizeItems = listSuggestItem.length;
      for (let i = 0; i < sizeItems; i++) {
        const item = listSuggestItem[i];
        if (item.classList.contains("focus-key-event")) {
          item.classList.remove("focus-key-event");
        }
      }
    }
  }, []);

  return (
    <Box className={classes.root}>
      <SearchBox
        autoFocus={autoFocus}
        ref={refInput}
        className={"SearchBox"}
        value={query}
        onChange={(e, value) => setQuery(value)}
        removeable
        placeholder={placeholder}
        inputProps={{
          onKeyDown: handleKeyDown,
          autoComplete: "off",
          onBlur: removeFocused,
        }}
      />
      <Box className={clsx(classes.list, className)} wrapper-suggest={uniqIdComponent}>
        {options.length > 0 ? (
          <InfiniteScroll
            dataLength={options.length}
            next={() => {
              setMetaData((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
              }));
              handleQueryChange(metaData.currentPage + 1, true);
            }}
            hasMore={metaData.currentPage < metaData.totalPage}
            loader={
              <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                <CircularProgress size={16} />
              </Box>
            }
            height={height || "auto"}
            style={{ maxHeight: maxHeight }}
            {...props.InfiniteScrollProps}
            className={clsx("InfiniteScroll-ListItem", props.InfiniteScrollProps?.className)}
          >
            {options.map((dataItem, idx) =>
              renderOption ? (
                <Box
                  key={dataItem[uniqKey]}
                  onClick={() => handleChangValue(dataItem)}
                  className={"InfiniteScroll-MenuItem"}
                  key-event="true"
                  data-id={dataItem[uniqKey]}
                >
                  {renderOption(dataItem)}
                </Box>
              ) : (
                <InfiniteScrollItem
                  key={dataItem[uniqKey]}
                  dataItem={dataItem}
                  label={getOptionLabel(dataItem)}
                  selected={isSelected(dataItem)}
                  onClick={() => handleChangValue(dataItem)}
                  key-event="true"
                  data-id={dataItem[uniqKey]}
                />
              )
            )}
          </InfiniteScroll>
        ) : loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" py={2}>
            <CircularProgress size={30} />
          </Box>
        ) : NoResultsComponent ? (
          <NoResultsComponent />
        ) : (
          <Box style={{ padding: "10px 24px" }}>{textNoResults}</Box>
        )}
      </Box>
    </Box>
  );
});

const InfiniteScrollItem = memo((props: any) => {
  const { label, dataItem, ...remainProps } = props;
  return (
    <MenuItem className={"InfiniteScroll-MenuItem"} {...remainProps}>
      {label}
    </MenuItem>
  );
});
InfiniteScrollItem.displayName = "InfiniteScrollItem";

InlineInfinite.displayName = "InlineInfinite";
export default memo(InlineInfinite);
