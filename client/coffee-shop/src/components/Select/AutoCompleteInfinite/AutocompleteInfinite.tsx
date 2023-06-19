import React, { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataSource, InfiniteScrollProps } from "../types";
import Popper, { PopperBaseProps } from "components/Popper/PopperBase";
import { Box, MenuItem, PopperPlacementType, Typography } from "@material-ui/core";
import clsx from "clsx";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "components/Loading/CircularProgress";
import useStyles from "./AutocompleteInfinite.styles";
import { v4 as uuidv4 } from "uuid";
import useDebounce from "hocs/useDebounce";
import { useTranslation } from "react-i18next";
import Button from "components/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import _ from "lodash";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SapoTextField from "components/SapoTextField";
import { SapoTextFieldProps } from "../../SapoTextField/SapoTextField";

export interface AutoCompleteInfiniteProps {
  value: any | null | undefined;
  onChange: (value: any | null | undefined) => void;
  onSubmit?: (query: string, value: any | null | undefined, options: any[]) => void;
  getOptionLabel: (options: any) => string;
  label?: string;
  placeholder?: string;
  height?: number | string;
  maxHeight?: number;
  renderOption?: (value: any) => React.ReactNode;
  onQueryChange?: (filter: { page: number; limit: number; query: string }) => any;
  fetchDataSource?: (filter: any) => Promise<DataSource | undefined>;
  PopperBaseProps?: PopperBaseProps;
  uniqKey?: string;
  emptyComponent?: React.ReactNode;
  debounce?: number;
  limit?: number;
  className?: string;
  createable?: boolean;
  textCreate?: React.ReactNode;
  onClickCreate?: (value: string) => void;
  error?: boolean;
  helperText?: string;
  maxLength?: number;
  InfiniteScrollProps?: InfiniteScrollProps;
  tooltipLabel?: React.ReactNode;
  TextFieldProps?: SapoTextFieldProps;
  placement?: PopperPlacementType;
  disabled?: boolean;
}

interface AutocompleteInfiniteRef {
  //todo
}

const AutocompleteInfinite = React.forwardRef<AutocompleteInfiniteRef, AutoCompleteInfiniteProps>((props, ref) => {
  const { t } = useTranslation(["component"]);
  const {
    onChange,
    onSubmit,
    renderOption,
    uniqKey = "id",
    fetchDataSource,
    onQueryChange,
    placeholder = "Tìm kiếm",
    label,
    getOptionLabel,
    emptyComponent,
    debounce = 300,
    height,
    maxHeight,
    className,
    limit = 10,
    createable,
    textCreate = t("component:button.add"),
    onClickCreate,
    error,
    helperText,
    maxLength,
    TextFieldProps,
    placement,
    disabled,
  } = props;
  const classes = useStyles();
  const didMountRef = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const uniqIdComponent = useMemo(() => uuidv4(), []);

  const [value, setValue] = useState<any | null | undefined>(props.value || null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<any[]>([]);
  const [query, setQuery] = useState<string>(_.isNil(props.value?.[uniqKey]) ? "" : props.value?.[uniqKey]?.toString());
  const queryDebounce = useDebounce(query, debounce);
  const [open, setOpen] = useState(false);
  const [metaData, setMetaData] = useState({
    currentPage: 1,
    totalPage: 0,
    totalItems: 0,
  });

  React.useImperativeHandle(ref, () => ({
    open() {
      setOpen(true);
    },
    close() {
      setOpen(false);
      setMetaData({ currentPage: 1, totalPage: 0, totalItems: 0 });
    },
    setValue(value: any) {
      setValue(value);
    },
  }));

  useEffect(() => {
    setQuery(_.isNil(props.value) ? "" : getOptionLabel(props.value));
    if (open) {
      if (!_.isEqual(value?.[uniqKey], props.value?.[uniqKey])) {
        setValue(props.value);
      }
    }
  }, [props.value, open]);

  const isSelected = useCallback(
    (dataItem: any) => {
      return _.isEqual(value?.[uniqKey], dataItem?.[uniqKey]);
    },
    [value]
  );

  const handleClosePopover = (event?: any) => {
    if (event?.relatedTarget) {
      let relatedTarget = event.relatedTarget as HTMLElement;
      if (relatedTarget?.getAttribute("key-event") === "true") {
        return;
      }
    }
    onSubmit?.(query, value, options);
    setOpen(false);
    setMetaData({ currentPage: 1, totalPage: 0, totalItems: 0 });
  };

  const handleChangValue = useCallback((dataItem) => {
    setValue(dataItem);
    onChange(dataItem);
    setOpen(false);
    setMetaData({ currentPage: 1, totalPage: 0, totalItems: 0 });
  }, []);

  const handleQueryChange = (page = metaData.currentPage, append = false) => {
    if (fetchDataSource) {
      let filter = onQueryChange?.({ page: page, query: queryDebounce, limit: limit }) || {
        page: page,
        query: queryDebounce,
        limit: limit,
      };
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
    }
  };

  useEffect(() => {
    if (didMountRef.current && open) {
      handleQueryChange(1, false);
    } else {
      didMountRef.current = true;
    }
  }, [queryDebounce]);

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
        break;
      case "Enter":
        const optionFocus = document.querySelector(`[wrapper-suggest='${uniqIdComponent}'] .focus-key-event`);
        optionFocus && handleClosePopover();
        const idFocus = optionFocus?.getAttribute("data-id");
        const newValue = options.find((e) => e[uniqKey]?.toString() === idFocus);
        newValue && handleChangValue(newValue);
        break;
      default:
        break;
    }
  };

  const handleFocus = () => {
    setOpen(true);
    setLoading(true);
    handleQueryChange();
  };

  return (
    <Fragment>
      <Popper
        referenceElement={rootRef.current}
        open={open}
        style={{
          zIndex: 1301,
        }}
        placement={placement}
        ignoreEventCloseInRootRef
        onClose={handleClosePopover}
        {...props.PopperBaseProps}
      >
        <Box className={clsx(classes.list, className)} wrapper-suggest={uniqIdComponent}>
          {!loading && createable && options.length === 0 && query.trim().length > 0 && (
            <Button
              className="InfiniteScroll-BoxCreate"
              key-event="true"
              data-id="-1"
              onClick={() => {
                if (!disabled) {
                  onClickCreate?.(query);
                  setOpen(false);
                  setMetaData({ currentPage: 1, totalPage: 0, totalItems: 0 });
                }
              }}
              startIcon={<AddCircleOutlineIcon color="primary" />}
            >
              <Typography>
                <Typography variant="subtitle1" component="span" color="primary">
                  {textCreate}&nbsp;
                </Typography>
                <Typography className={"query"} variant="body1" component="span">
                  {query}
                </Typography>
              </Typography>
            </Button>
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
              {}
            </InfiniteScroll>
          ) : loading ? (
            <Box display="flex" alignItems="center" justifyContent="center" py={2}>
              <CircularProgress size={16} />
            </Box>
          ) : (
            emptyComponent
          )}
        </Box>
      </Popper>
      <Box className={classes.root}>
        <SapoTextField
          value={query}
          onChange={(e: any) => {
            setQuery(e.target.value);
            !open && setOpen(true);
          }}
          ref={rootRef}
          fullWidth
          label={label}
          placeholder={placeholder}
          inputProps={{
            onKeyDown: handleKeyDown,
            onFocus: handleFocus,
            onBlur: handleClosePopover,
            className: classes.input,
            maxLength: maxLength,
          }}
          InputProps={{
            endAdornment: <ArrowDropDownIcon />,
          }}
          tooltipLabelProps={
            {
              title: props.tooltipLabel,
            } as any
          }
          error={error}
          helperText={helperText}
          {...TextFieldProps}
        />
      </Box>
    </Fragment>
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

AutocompleteInfinite.displayName = "AutocompleteInfinite";
export default AutocompleteInfinite;
