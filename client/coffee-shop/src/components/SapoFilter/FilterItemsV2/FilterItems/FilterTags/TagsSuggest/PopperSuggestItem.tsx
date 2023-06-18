import { Box, BoxProps, IconButton, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import CircularProgress from "components/Loading/CircularProgress";
import { ArrowLeftIcon, ArrowRightIcon } from "components/SVG";
import useDebounce from "hocs/useDebounce";
import { isArray, isEqual, isNil, toString, uniqWith } from "lodash";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useStyles from "./PopperSuggestItem.styles";
import Popper, { PopperBaseProps } from "components/Popper/PopperBase";
import { useTranslation } from "react-i18next";
import InputBase from "../../../../../InputBase";
import Checkbox from "components/Checkbox";
import useModal from "components/Modal/useModal";
import { DataSource } from "components/Select/types";
import { colorInk } from "theme/palette";
import HighlightOffIcon from "components/SVG/HighlightOffIcon";

export interface PopperSuggestItemProps {
  value: any[] | null | undefined;
  onChange: (value: any[]) => any;
  getOptionLabel: (options: any) => string;
  referenceElement: any;
  placeholder?: string;
  height?: number | string;
  onQueryChange?: (filter: { page: number; limit: number; query: string }) => any;
  fetchDataSource: (filter: any) => Promise<DataSource | undefined>;
  uniqKey?: string;
  textCreate?: React.ReactNode;
  createable?: boolean;
  onClickCreate?: () => void;
  NoResultsComponent?: any;
  textNoResults?: string;
  debounce?: number;
  limit?: number;
  textSelectAll?: string;
  optionSelectAll?: boolean;
  disabledPaging?: boolean;
  disabledSearch?: boolean;
  isTag?: boolean;
  ListOptionsProps?: BoxProps;
  PopperProps?: PopperBaseProps;
}

export interface PopperSuggestItemRef {
  close: () => void;
  setValue: (value: any[] | null | undefined) => void;
}

const PopperSuggestItem = React.forwardRef<PopperSuggestItemRef, PopperSuggestItemProps>((props, ref) => {
  const { t } = useTranslation(["customer"]);
  const {
    onChange,
    uniqKey = "id",
    fetchDataSource,
    onQueryChange,
    placeholder = "Tìm kiếm",
    getOptionLabel,
    NoResultsComponent,
    debounce = 300,
    limit = 10,
    textNoResults = t("component:filter.notFoundDataMatch"),
    disabledPaging,
    disabledSearch,
    textSelectAll = "Chọn tất cả",
    optionSelectAll,
    referenceElement,
    isTag,
  } = props;
  const classes = useStyles();
  const uniqIdComponent = useMemo(() => uuidv4(), []);
  const { closeModal } = useModal();

  const [query, setQuery] = useState("");
  const version = useRef(0);
  const queryDebounce = useDebounce(query, debounce);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<any[]>([]);
  const [value, setValue] = useState(props.value);
  const [metaData, setMetaData] = useState({
    currentPage: 1,
    totalPage: 0,
    totalItems: 0,
    version: 0,
  });

  React.useImperativeHandle(ref, () => ({
    close() {
      closeModal();
    },
    setValue(value) {
      setValue(value);
    },
  }));

  const compareItem = (item: any, other: any) => {
    if (isTag) {
      return item === other;
    }
    return uniqKey ? (item as any)[uniqKey] === (other as any)[uniqKey] : isEqual(item, other);
  };

  const isSelectedItem = (item: any) => {
    return !!value?.some((m) => compareItem(m, item));
  };

  const renderLabelItem = (option: any) =>
    isTag ? toString(option) : isNil(getOptionLabel?.(option)) ? option : getOptionLabel(option);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
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
        break;
      case "Enter":
        if(isTag) {
          handleSelect(query);
          setQuery("")
        }
        break;
      default:
        break;
    }
  };

  const handleQueryChange = async (page = metaData.currentPage) => {
    const filter = onQueryChange?.({ page: page, query: queryDebounce, limit: limit }) || {
      page: page,
      query: queryDebounce,
      limit: limit,
    };
    version.current += 1;
    const currentVer = version.current;
    try {
      const res = await fetchDataSource(filter);
      if (res?.metaData) {
        setMetaData({
          currentPage: page,
          totalPage: res.metaData.totalPage,
          totalItems: res.metaData.totalItems,
          version: currentVer,
        });
      }
      if (res?.data) {
        if (currentVer < version.current) return;
        setOptions(res.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleQueryChange(1);
  }, [queryDebounce]);

  const handleSelect = (item: any) => {
    let newValue;
    if (isSelectedItem(item)) {
      newValue = value?.filter((m) => !compareItem(m, item)) || [];
    } else {
      newValue = value ? [...value, item] : [item];
    }
    setValue(newValue);
    onChange(newValue);
  };

  const isSelectedAll = useMemo(() => {
    return isArray(value) && options.every((item) => isArray(value) && value.some((m) => compareItem(m, item)));
  }, [value, options]);

  const handleSelectAll = () => {
    let newValue;
    if (isSelectedAll) {
      newValue = value?.filter((item) => !options.some((m) => compareItem(m, item))) || [];
    } else {
      newValue = uniqWith(value ? [...value, ...options] : options, compareItem);
    }
    setValue(newValue);
    onChange(newValue);
  };

  const popperRef = useRef<any>();

  useEffect(() => {
    popperRef?.current?.update?.();
  }, [value]);

  return (
    <Popper
      open={true}
      ref={popperRef}
      referenceElement={referenceElement}
      onClose={() => closeModal()}
      ignoreEventCloseInRootRef={true}
      {...props.PopperProps}
    >
      <Box wrapper-suggest={uniqIdComponent}>
        {!disabledSearch && (
          <Box className={classes.input}>
            <InputBase
              autoFocus={true}
              value={query}
              InputProps={{
                startAdornment: !isTag ? <SearchIcon /> : null,
                endAdornment:
                  query && query.length > 0 ? (
                    <IconButton style={{ padding: 0 }} onClick={() => setQuery("")}>
                      <HighlightOffIcon style={{ margin: 0 }} />
                    </IconButton>
                  ) : null,
              }}
              height={"36px"}
              width="100%"
              placeholder={placeholder}
              onKeyDown={(e: any) => handleKeyDown(e)}
              onChange={(event: any) => {
                setQuery(event.target.value);
              }}
            />
          </Box>
        )}
        {!loading && options.length > 0 ? (
          <Fragment>
            {optionSelectAll && (
              <Box className={classes.menuItems}>
                <Box
                  className={clsx("menuItem", "optionAll", { "selected-item": isSelectedAll })}
                  onClick={handleSelectAll}
                  key-event="true"
                  style={{marginBottom: 8}}
                >
                  <Checkbox className="checkBox" checked={isSelectedAll} />
                  {textSelectAll}
                </Box>
              </Box>
            )}
            <Box
              className={classes.menuItems}
              {...props.ListOptionsProps}
              style={{ maxHeight: 300, ...props.ListOptionsProps?.style }}
            >
              {options.map((item) => (
                <Box
                  key={(item as any)[uniqKey]}
                  className={clsx("menuItem", isSelectedItem(item) ? "selected-item" : "")}
                  onClick={() => handleSelect(item)}
                  key-event="true"
                  data-id={uniqKey && (item as any)[uniqKey]}
                  style={{marginBottom: 8}} 
                >
                  {!isTag && <Checkbox className="checkBox" checked={isSelectedItem(item)} />}
                  {renderLabelItem(item)}
                </Box>
              ))}
            </Box>
            {!disabledPaging && (
              <Box className={classes.paginate}>
                <Box>
                  <IconButton
                    className="paging-btn prev"
                    disabled={metaData.currentPage <= 1}
                    onClick={() => handleQueryChange(metaData.currentPage - 1)}
                  >
                    <ArrowRightIcon />
                  </IconButton>
                  <IconButton
                    className="paging-btn next"
                    disabled={metaData.totalPage <= metaData.currentPage}
                    onClick={() => handleQueryChange(metaData.currentPage + 1)}
                  >
                    <ArrowLeftIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Fragment>
        ) : loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" py={2}>
            <CircularProgress size={30} />
          </Box>
        ) : NoResultsComponent ? (
          <NoResultsComponent />
        ) : (
          <Box style={{ padding: "10px 12px" }}>
            <Typography variant={"body1"} style={{ color: colorInk.base60 }}>
              {textNoResults}
            </Typography>
          </Box>
        )}
      </Box>
    </Popper>
  );
});

export default PopperSuggestItem;
