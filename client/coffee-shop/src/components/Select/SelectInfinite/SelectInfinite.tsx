import { Box, InputBaseComponentProps, MenuItem, RootRef, Typography } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Button from "components/Button";
import CircularProgress from "components/Loading/CircularProgress";
import Popper, { PopperBaseProps } from "components/Popper/PopperBase";
import SearchBox from "components/SearchBox/SearchBox";
import useDebounce from "hocs/useDebounce";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { v4 as uuidv4 } from "uuid";
import useStyles from "./SelectInfinite.styles";
import clsx from "clsx";
import { DataSource, InfiniteScrollProps } from "../types";

interface SelectInfiniteProps {
  value: any;
  onChange: (value: any, event: "default" | "enter") => any;
  getOptionLabel: (options: any) => string;
  placeholder?: string;
  height?: number | string;
  maxHeight?: number;
  renderOption?: (value: any) => React.ReactNode;
  onQueryChange?: (filter: { page: number; limit: number; query: string }) => any;
  fetchDataSource: (filter: any) => Promise<DataSource | undefined>;
  PopperBaseProps?: PopperBaseProps;
  uniqKey?: string;
  textCreate?: React.ReactNode;
  createable?: boolean;
  onClickCreate?: () => void;
  NoResultsComponent?: any;
  textNoResults?: string;
  debounce?: number;
  className?: string;
  limit?: number;
  InfiniteScrollProps?: InfiniteScrollProps;
  MoreElement?: (props: MoreElementProps) => JSX.Element;
  inputProps?: InputBaseComponentProps;
  disableSelected?: boolean;
  disableCloseWhenBlur?: boolean;
  disabledEnter?: boolean;
  onClickMixpanel?: () => void;
  error?: boolean;
  multiple?: boolean;
}

interface MoreElementProps {
  onClick: () => void;
}

export interface SelectInfiniteRef {
  open: () => void;
  close: () => void;
  setValue: (value: any | null | undefined) => void;
}


const SelectInfinite = memo(
  React.forwardRef<SelectInfiniteRef, SelectInfiniteProps>((props, ref) => {
    const { t } = useTranslation(["component"]);
    const {
      onChange,
      renderOption,
      uniqKey = "id",
      fetchDataSource,
      onQueryChange,
      placeholder = "Tìm kiếm",
      getOptionLabel,
      createable,
      textCreate,
      onClickCreate,
      NoResultsComponent,
      debounce = 300,
      height,
      maxHeight,
      className,
      limit = 10,
      MoreElement,
      inputProps,
      textNoResults = t("component:filter.searchEmpty"),
      disableCloseWhenBlur,
      disabledEnter,
      onClickMixpanel,
      error,
      multiple,
    } = props;
    const classes = useStyles();
    const didMountRef = useRef(false);
    const refInput = useRef<any | null>(null);
    const refOptions = useRef<any[]>([]);
    const isChanging = useRef<boolean>(true);
    const uniqIdComponent = useMemo(() => uuidv4(), []);
    const wrapperSuggestRef = useRef<HTMLDivElement>();

    const [value, setValue] = useState<any | null | undefined>(props.value || null);
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const queryDebounce = useDebounce(query, debounce);
    const [open, setOpen] = useState(false);
    const [metaData, setMetaData] = useState({
      currentPage: 1,
      totalPage: 0,
      totalItems: 0,
      version: 0,
    });
    const version = useRef(0);

    React.useImperativeHandle(ref, () => ({
      open() {
        setOpen(true);
      },
      close() {
        setOpen(false);
      },
      setValue(value) {
        setValue(value);
      },
    }));

    const handleQueryChange = async (page = metaData.currentPage, append = false) => {
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
          setOptions((prev) => {
            if (append) {
              refOptions.current = [...prev, ...res.data];
              return [...prev, ...res.data];
            }
            refOptions.current = res.data;
            return res.data;
          });
          if (!append) {
            let wrapper = wrapperSuggestRef.current?.querySelector(".InfiniteScroll-ListItem");
            if (wrapper) wrapper.scrollTop = 0;
          }
          setTimeout(() => {
            let listSuggestItem = wrapperSuggestRef.current?.querySelectorAll(`[key-event='true']`);
            if (!append && listSuggestItem && listSuggestItem.length > 0 && res.data) {
              for (let item of listSuggestItem) {
                if (item.classList.contains("focus-key-event")) {
                  item.classList.remove("focus-key-event");
                }
              }
              if (createable) {
                let indexFocus = res.data.length === 0 ? 0 : 1;
                listSuggestItem?.[indexFocus]?.classList.add("focus-key-event");
              } else {
                listSuggestItem?.[0]?.classList.add("focus-key-event");
              }
            }
          }, 0);
        }
      } catch (e) {
      } finally {
        isChanging.current = false;
        loading && setLoading(false);
      }
    };

    useEffect(() => {
      if (didMountRef.current && open) {
        handleQueryChange(1);
      } else {
        didMountRef.current = true;
      }
    }, [queryDebounce]);

    const clearFocus = useCallback(() => {
      let listSuggestItem = wrapperSuggestRef.current?.querySelectorAll(`[key-event='true']`);
      if (listSuggestItem && listSuggestItem.length > 0) {
        listSuggestItem.forEach((item) => {
          if (item.classList.contains("focus-key-event")) {
            item.classList.remove("focus-key-event");
          }
        });
      }
    }, [wrapperSuggestRef.current]);

    const isSelected = useCallback(
      (dataItem: any) => {
        return value?.[uniqKey] === dataItem?.[uniqKey];
      },
      [value, options]
    );

    const handleChangValue = useCallback(
      (dataItem: any, event: "default" | "enter") => {
        setValue(dataItem);
        onChange(dataItem, event);
        clearFocus();
        !multiple && handleClosePopover();
      },
      [onChange, clearFocus]
    );

    const handleClosePopover = useCallback(() => {
      setOpen(false);
      setQuery("");
      setLoading(true);
      setOptions([]);
      refOptions.current = [];
      version.current = 0;
      setMetaData({ currentPage: 1, totalPage: 0, totalItems: 0, version: 0 });
    }, []);

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
          let tryTime = 1;
          await new Promise((resolve) => setTimeout(resolve, debounce));
          while (isChanging.current && tryTime < 20) {
            tryTime++;
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          setTimeout(() => {
            const optionFocus = document.querySelector(`[wrapper-suggest='${uniqIdComponent}'] .focus-key-event`);
            const idFocus = optionFocus?.getAttribute("data-id");
            let options = refOptions.current;
            if (idFocus === "-1") {
              onClickCreate?.();
              handleClosePopover();
            } else {
              if (disabledEnter) {
                return;
              }
              const newValue = options.find((e) => e[uniqKey]?.toString() === idFocus);
              newValue && handleChangValue(newValue, "enter");
              optionFocus && handleClosePopover();
            }
          }, 10);
          break;
        default:
          break;
      }
    };

    const handleClick = (e: any) => {
      if (open) {
        return;
      }
      setOpen(true);
      handleQueryChange(1);
      e.currentTarget.focus();
    };

    const handleBlur = (event: any) => {
      if (disableCloseWhenBlur) {
        return;
      }
      if (event?.relatedTarget) {
        let relatedTarget = event.relatedTarget as HTMLElement;
        if (document.querySelectorAll(`[wrapper-suggest="${uniqIdComponent}"]`)?.[0]?.contains(relatedTarget)) {
          return;
        }
      }
      setOpen(false);
    };

    return (
      <div className={clsx(classes.root, "SI-root")} ref={refInput} onClick={onClickMixpanel}>
        <SearchBox
          className={clsx("SearchBox", [{ error: error }])}
          value={query}
          onChange={(e, value) => {
            isChanging.current = true;
            setQuery(value);
            !open && setOpen(true);
          }}
          removeable
          placeholder={placeholder}
          inputProps={{
            onKeyDown: handleKeyDown,
            onClick: handleClick,
            onBlur: handleBlur,
            autoComplete: "off",
            ...inputProps,
          }}
        />
        {MoreElement && <MoreElement onClick={() => setOpen(false)} />}
        <Popper
          referenceElement={refInput.current}
          open={open}
          style={{
            zIndex: 99999,
          }}
          ignoreEventCloseInRootRef
          onClose={handleClosePopover}
          {...props.PopperBaseProps}
        >
          <RootRef rootRef={wrapperSuggestRef}>
            <Box className={clsx(classes.list, className)} wrapper-suggest={uniqIdComponent}>
              {createable && (
                <Box
                  onClick={() => {
                    onClickCreate?.();
                    setOpen(false);
                  }}
                  tabIndex={0}
                >
                  <Button
                    key-event="true"
                    data-id="-1"
                    className="InfiniteScroll-BoxCreate"
                    fullWidth
                    startIcon={<AddCircleOutlineIcon color="primary" className="icon" />}
                  >
                    <Typography variant="subtitle1" color="primary">
                      {textCreate}
                    </Typography>
                  </Button>
                </Box>
              )}
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
                        onClick={() => handleChangValue(dataItem, "default")}
                        className={"InfiniteScroll-MenuItem"}
                        key-event="true"
                        data-id={dataItem[uniqKey]}
                        tabIndex={0}
                      >
                        {renderOption(dataItem)}
                      </Box>
                    ) : (
                      <InfiniteScrollItem
                        key={dataItem[uniqKey]}
                        dataItem={dataItem}
                        label={getOptionLabel(dataItem)}
                        selected={isSelected(dataItem)}
                        onClick={() => handleChangValue(dataItem, "default")}
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
          </RootRef>
        </Popper>
      </div>
    );
  })
);

const InfiniteScrollItem = memo((props: any) => {
  const { label, dataItem, ...remainProps } = props;
  return (
    <MenuItem className={"InfiniteScroll-MenuItem"} {...remainProps}>
      {label}
    </MenuItem>
  );
});
InfiniteScrollItem.displayName = "InfiniteScrollItem";

SelectInfinite.displayName = "SelectInfinite";
export default SelectInfinite;
