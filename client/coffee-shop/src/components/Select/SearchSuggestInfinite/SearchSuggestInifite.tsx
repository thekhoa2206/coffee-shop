import { Box, FormHelperText, InputAdornment, InputBase as MuiInputBase, Typography } from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import CircularProgress from "components/Loading/CircularProgress";
import useDebounce from "hocs/useDebounce";
import { isArray, isEqual, uniqWith } from "lodash";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CheckBox from "components/Checkbox";
import InputBase from "components/InputBase";
import Chip from "@material-ui/core/Chip";
import useStyles from "./SearchSuggestInifite.styles";
import Popper from "components/Popper/PopperBase";
import ClearIcon from "@material-ui/icons/Clear";
import Tooltip from "components/Tooltip";
import { useTranslation } from "react-i18next";
import InputTags from "../../Filter/components/InputTags";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchSuggestInfiniteProps from "./SearchSuggestInifite.types";
import CancelIcon from "@material-ui/icons/Cancel";
import { colorInk } from "theme/palette";

export interface BtnTemplateProps {
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
  className?: string | undefined;
  open: boolean;
}


function SearchSuggestInfinite(props: SearchSuggestInfiniteProps) {
  const { t } = useTranslation(["customer"]);
  const {
    inline,
    multiple,
    value,
    uniqKey = "id",
    optionSelectAll,
    debounce = 0,
    width = 300,
    widthPopper,
    maxHeightListOption = 300,
    creatable,
    creatableText = `Thêm mới`,
    CreatableComponent,
    placeholder,
    placeholderSelect,
    type = "search",
    disableCloseOnSelect,
    textNoOption = `Không có kết quả tìm kiếm`,
    textSelectAll = `Chọn tất cả`,
    label,
    getLabelSelect,
    renderOption,
    onClose,
    getOptionLabel,
    onChange,
    placement,
    handleClickCreatable,
    required,
    textButtonShowResult = `${t("component:filter.selected")}`,
    showResult,
    limit = 10,
    onQueryChange,
    fetchDataSource,
    styleRoot,
    renderValueElement,
    disabled,
    disabledDrillIcon,
    isInlineDisplay,
    removeable,
  } = props;
  const classes = useStyles(props)();
  const uniqIdComponent = useMemo(() => uuidv4(), []);

  const [open, setOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);

  const [loading, setLoading] = useState<boolean>(!!fetchDataSource);
  const [suggestItems, setSuggestItems] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const queryDebounce = useDebounce(inputValue, debounce);
  const [metaData, setMetaData] = useState({
    currentPage: 1,
    totalPage: 0,
    totalItems: 0,
  });

  const selected = useMemo(
    () => (value ? value : multiple || type === "search-tags" || type === "search-reason" ? [] : null),
    [value]
  );

  const compareItem = (item: any, other: any) => {
    return uniqKey ? (item as any)[uniqKey] === (other as any)[uniqKey] : isEqual(item, other);
  };

  const renderLabelItem = (option: any) => getOptionLabel?.(option) || option;

  useEffect(() => {
    if (type === "search-reason") {
      setInputValue(value && value.name ? value.name : "");
    }
  }, [value]);

  useEffect(() => {
    if (open) {
      handleQueryChange(1);
    }
  }, [open, queryDebounce]);

  const handleQueryChange = (page = metaData.currentPage, append = false) => {
    let filter = onQueryChange?.({ page: page, query: queryDebounce, limit: limit }) || {
      page: page,
      query: queryDebounce,
      limit: limit,
    };
    fetchDataSource(filter).then((res) => {
      if (res?.data) {
        const metaData = {
          currentPage: page,
          totalItems: res.metaData?.totalItems,
          totalPage: res.metaData?.totalPage,
        };
        setMetaData(metaData);
        setSuggestItems((prev) => (append ? [...prev, ...res.data] : res.data));
        setLoading(false);
      }
    });
  };

  const handleSelectItem = (item: any) => {
    if (type !== "search-tags") {
      if (multiple && isArray(selected)) {
        let hasItemSelected = selected.some((m) => compareItem(item, m));
        if (hasItemSelected) {
          onChange?.([...selected.filter((m) => !compareItem(item, m))]);
        } else {
          onChange?.([...selected, item]);
        }
      } else {
        onChange?.(item);
        if (!disableCloseOnSelect) {
          handleClose();
        }
      }
    } else {
      if (isArray(selected)) {
        if (!selected.some((m) => compareItem(item, m))) {
          onChange?.([...selected, item]);
        }
        if (!disableCloseOnSelect) {
          handleClose();
        }
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
    setInputValue("");
  };

  const isCheckedOptionSelectAll = () => {
    return (
      isArray(selected) && suggestItems.every((item) => isArray(selected) && selected.some((m) => compareItem(m, item)))
    );
  };

  const handleClickOptionSelectAll = () => {
    if (isArray(selected)) {
      if (isCheckedOptionSelectAll()) {
        let newListItemSelected = selected.filter((item) => !suggestItems.some((m) => compareItem(m, item)));
        onChange?.(newListItemSelected);
      } else {
        onChange?.(uniqWith([...selected, ...suggestItems], compareItem));
      }
    }
  };

  const handleClickDeleteAllOptionSelected = () => {
    onChange?.([]);
  };
  const handleClickRemove = (e: React.MouseEvent<HTMLElement>) => {
    if (onChange) {
      onChange("");
      setInputValue("");
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      let parentNode = document.querySelector(`[wrapper-suggest='${uniqIdComponent}']`);
      let itemFocus = parentNode?.querySelector(".focus-key-event");
      let listSuggestItem = parentNode?.querySelectorAll(`[key-event='true']`);
      if (listSuggestItem && itemFocus) {
        let sizeItems = listSuggestItem.length;
        for (let i = 0; i < sizeItems; i++) {
          let item = listSuggestItem[i];
          if (item.classList.contains("focus-key-event")) {
            item.classList.remove("focus-key-event");
            let indexFocus = i;
            if (e.key === "ArrowDown") {
              indexFocus = i !== sizeItems - 1 ? i + 1 : 0;
            } else {
              indexFocus = i !== 0 ? i - 1 : 0;
            }
            listSuggestItem[indexFocus].scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
            listSuggestItem[indexFocus].classList.add("focus-key-event");
            break;
          }
        }
      } else if (listSuggestItem && listSuggestItem.length > 0 && e.key === "ArrowDown") {
        listSuggestItem[0].classList.add("focus-key-event");
      }
    } else if (e.key === "Enter" || e.key === ",") {
      let optionFocus = document.querySelector(`[wrapper-suggest='${uniqIdComponent}'] .focus-key-event`);
      if (optionFocus && type !== "search-tags") {
        const idFocus = optionFocus.getAttribute("data-id");
        if (idFocus === "-1") {
          handleClickCreatable?.(inputValue);
          onClose?.();
          setOpen(false);
          setInputValue("");
          return;
        }
        const itemFocus = suggestItems.find((e) => e[uniqKey]?.toString() === idFocus);
        if (!itemFocus) return;
        if (multiple && isArray(selected)) {
          let hasItemSelected = selected.some((m) => compareItem(itemFocus, m));
          if (hasItemSelected) {
            onChange?.([...selected.filter((m) => !compareItem(itemFocus, m))]);
          } else {
            onChange?.([...selected, itemFocus]);
          }
        } else {
          onChange?.(itemFocus);
          if (!disableCloseOnSelect) {
            handleClose();
          }
        }
      } else if (type === "search-tags" && isArray(selected) && inputValue) {
        if (!selected.some((m) => compareItem(inputValue as any, m))) {
          onChange?.([...selected, inputValue.replace(",", "") as any]);
        }
        handleClose();
      }
    } else if (
      e.key === "Backspace" &&
      type === "search-tags" &&
      inputValue === "" &&
      isArray(selected) &&
      selected.length > 0
    ) {
      let newOptions = [...selected];
      newOptions.pop();
      onChange?.(newOptions);
      setOpen(false);
    }
  };

  const renderCreatableContent = () => {
    if (CreatableComponent) {
      return (
        <CreatableComponent
          key-event="true"
          data-id="-1"
          onClick={() => {
            handleClickCreatable?.(inputValue);
            onClose?.();
            setOpen(false);
            setInputValue("");
          }}
        />
      );
    } else {
      return (
        <Box
          className={classes.creatable}
          onClick={() => {
            handleClickCreatable?.(inputValue);
            onClose?.();
            setOpen(false);
            setInputValue("");
          }}
          key-event="true"
          data-id="-1"
        >
          <AddCircleIcon />
          {type === "search-reason" ? (
            <Typography>
              {creatableText} <span style={{ color: "black", fontWeight: 500 }}>{inputValue}</span>
            </Typography>
          ) : (
            creatableText
          )}
        </Box>
      );
    }
  };

  const isSelectedItem = (item: any) => {
    if (multiple && isArray(selected)) {
      return selected.some((m) => compareItem(m, item));
    } else if (!multiple && selected && !isArray(selected)) {
      return compareItem(item, selected);
    } else {
      return false;
    }
  };

  const renderListOption = () => {
    return (
      <InfiniteScroll
        dataLength={suggestItems.length}
        hasMore={metaData.currentPage < metaData.totalPage}
        loader={
          <Box display="flex" alignItems="center" justifyContent="center" py={2}>
            <CircularProgress size={30} />
          </Box>
        }
        height={"auto"}
        style={{
          maxHeight: maxHeightListOption,
        }}
        next={() => {
          setMetaData((prev) => ({
            ...prev,
            currentPage: prev.currentPage + 1,
          }));
          handleQueryChange(metaData.currentPage + 1, true);
        }}
        {...props.InfiniteScrollProps}
      >
        {suggestItems.map((item: any) => (
          <Box
            className={clsx("menuItem", renderOption ? "custom-item" : "", isSelectedItem(item) ? "selected-item" : "")}
            onClick={() => handleSelectItem(item)}
            key-event="true"
            key={item[uniqKey]}
            data-id={item[uniqKey]}
          >
            {renderOption ? (
              renderOption(item)
            ) : (
              <Fragment>
                {multiple && isArray(selected) && <CheckBox className="checkBox" checked={isSelectedItem(item)} />}
                {renderLabelItem(item)}
              </Fragment>
            )}
          </Box>
        ))}
      </InfiniteScroll>
    );
  };

  const renderContentSuggest = () => {
    return (
      <Fragment>
        {type === "select-search" && renderInputSearch()}
        {creatable && renderCreatableContent()}
        {!loading && suggestItems.length > 0 ? (
          <Fragment>
            {optionSelectAll && multiple && suggestItems.length > 0 && (
              <Box className={classes.menuItems}>
                <Box
                  className={clsx("menuItem", "optionAll", isCheckedOptionSelectAll() ? "selected-item" : "")}
                  onClick={handleClickOptionSelectAll}
                  key-event="true"
                >
                  <CheckBox className="checkBox" checked={isCheckedOptionSelectAll()} />
                  {textSelectAll}
                </Box>
              </Box>
            )}
            <Box overflow="auto" className={classes.menuItems}>
              {renderListOption()}
            </Box>
          </Fragment>
        ) : loading ? (
          <Box className={classes.loading}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <Box className={classes.noOptions}>{textNoOption}</Box>
        )}
      </Fragment>
    );
  };

  const renderInputSearch = () => (
    <Box className={clsx(classes.input, (inline || type === "select-search") && " inline")}>
      <InputBase
        autoFocus={type === "select-search"}
        onClick={() => {
          if (type !== "select-search") {
            if (open) {
              onClose?.();
            }
            setOpen(!open);
          }
        }}
        value={inputValue}
        InputProps={{
          startAdornment: <SearchIcon />,
          endAdornment: removeable && inputValue && inputValue.length > 0 && (
            <InputAdornment position="end" onClick={handleClickRemove}>
              <CancelIcon
                htmlColor={colorInk.base40}
                style={{ width: "24px", height: "24px", cursor: "pointer", marginLeft: "-35px" }}
              />
            </InputAdornment>
          ),
        }}
        height={inline || type === "select-search" ? "40px" : "36px"}
        width="100%"
        placeholder={placeholder}
        onKeyDown={(e) => handleKeyDown(e)}
        onChange={(event) => {
          setInputValue(event.target.value);
          setOpen(true);
        }}
      />
      {showResult && selected && isArray(selected) && selected.length > 0 && (
        <Tooltip title={selected.map((item) => renderLabelItem(item)).join(", ")} placement="left" arrow>
          <Chip
            label={`${textButtonShowResult} ${selected.length}`}
            onDelete={handleClickDeleteAllOptionSelected}
            className="delete-chip-button"
            deleteIcon={<ClearIcon />}
          />
        </Tooltip>
      )}
    </Box>
  );

  const inputWithResult = () => {
    return (
      <Box className={classes.wrapperInput}>
        <SearchIcon className="search-icon" />
        <MuiInputBase
          inputProps={{ onKeyDown: (e) => handleKeyDown(e) }}
          className={"show-result"}
          placeholder={placeholder}
          onClick={() => {
            if (type !== "select-search") {
              if (open) onClose?.();
              setOpen(!open);
            }
          }}
          onChange={(event) => {
            setInputValue(event.target.value);
            setOpen(true);
          }}
        />
        {isArray(selected) && selected.length > 0 && (
          <Tooltip title={selected.map((item) => renderLabelItem(item)).join(",")} placement="left" arrow>
            <Chip
              placeholder={placeholder}
              label={`${t("component:filter.selected")} ${selected.length}`}
              onDelete={() => {
                onChange?.([]);
                setOpen(false);
              }}
              onClick={() => {
                setOpen(!open);
                (referenceElement as any)?.querySelector("input")?.focus();
              }}
              className="delete-chip-button"
              deleteIcon={<ClearIcon />}
            />
          </Tooltip>
        )}
      </Box>
    );
  };

  const renderFakeSelectButton = () => {
    if (props.renderFakeSelectButton) {
      const BtnTemplate = props.renderFakeSelectButton;
      return (
        <BtnTemplate
          open={open}
          onClick={() => setOpen(!open)}
          className={clsx(
            classes.fakeSelectButton,
            props.className,
            { open: open },
            { [classes.inlineSelect]: isInlineDisplay }
          )}
        />
      );
    } else {
      return (
        <Fragment>
          <Box
            onClick={disabled ? undefined : (e) => setOpen(!open)}
            className={clsx(
              classes.fakeSelectButton,
              props.className,
              { open: open, disabled: disabled },
              { [classes.inlineSelect]: isInlineDisplay }
            )}
            onKeyDown={(e) => {
              if (e.keyCode === 13 || e.keyCode === 40) {
                setOpen(true);
              }
            }}
            tabIndex={0}
            style={
              disabled
                ? {
                    background: "#F3F4F5",
                    cursor: "not-allowed",
                    pointerEvents: "unset",
                    backgroundColor: "#F3F4F5",
                  }
                : {}
            }
          >
            {renderValueElement ? (
              renderValueElement(selected)
            ) : (
              <Typography color="textPrimary" className="label-select">
                {getLabelSelect && getLabelSelect(selected) ? getLabelSelect(selected) : `${placeholderSelect || ""}`}
              </Typography>
            )}
            {!disabled && !disabledDrillIcon ? <ArrowDropDownIcon className={"arrow-icon"} /> : ""}
          </Box>
          {props.helperText && props.error && (
            <FormHelperText classes={{ root: classes.helperTextRoot }}>{props.helperText}</FormHelperText>
          )}
        </Fragment>
      );
    }
  };

  const renderReferenceElement = () => {
    switch (type) {
      case "search":
        return renderInputSearch();
      case "filter":
        return inputWithResult();
      case "search-tags":
        return (
          <InputTags
            inputValue={inputValue}
            placeholder={placeholder}
            tags={isArray(selected) ? (selected as any) : []}
            onKeyDown={handleKeyDown}
            onClick={() => {
              if (open) {
                onClose?.();
              }
              setOpen(!open);
            }}
            onDelete={(value) => {
              if (isArray(selected)) {
                onChange?.(selected.filter((item) => item !== (value as any)));
              }
            }}
            onChange={(event) => {
              setInputValue(event.target.value.replace(",", ""));
              setOpen(true);
            }}
          />
        );
      case "search-reason":
        return (
          <InputTags
            inputValue={inputValue}
            placeholder={placeholder}
            tags={isArray(selected) ? (selected as any) : []}
            onKeyDown={handleKeyDown}
            onClick={() => {
              if (open) {
                onClose?.();
              }
              setOpen(!open);
            }}
            onDelete={(value) => {
              if (isArray(selected)) {
                onChange?.(selected.filter((item) => item !== (value as any)));
              }
            }}
            onChange={(event) => {
              setInputValue(event.target.value.replace(",", ""));
              setOpen(true);
            }}
            error={props.error}
          />
        );
      default:
        return renderFakeSelectButton();
    }
  };

  return (
    <Box width={width} className={isInlineDisplay ? classes.flex : classes.root} style={styleRoot}>
      {label && (
        <Box className={classes.label} width={isInlineDisplay ? 140 : "auto"}>
          <Typography style={{ color: isInlineDisplay ? "#182537" : "#46515F" }}>{label}</Typography>
          {required && (
            <Typography component="span" color="error">
              &nbsp;*
            </Typography>
          )}
        </Box>
      )}
      {isInlineDisplay && <>:</>}
      <RootRef rootRef={setReferenceElement}>{renderReferenceElement()}</RootRef>
      {inline ? (
        <Box wrapper-suggest={uniqIdComponent} className={classes.wrapperSuggestResult}>
          {renderContentSuggest()}
        </Box>
      ) : (
        <Popper
          open={open}
          width={widthPopper}
          referenceElement={referenceElement}
          onClose={() => {
            if (type === "search-tags") {
              if (isArray(selected) && inputValue && !selected.some((m) => compareItem(inputValue as any, m))) {
                onChange?.([...selected, inputValue.replace(",", "") as any]);
              }
              setInputValue("");
            }
            setOpen(false);
            onClose?.();
            if (!disableCloseOnSelect) {
              setInputValue("");
            }
          }}
          ignoreEventCloseInRootRef={true}
          {...props.popperProps}
          placement={placement}
        >
          <Box wrapper-suggest={uniqIdComponent}>{renderContentSuggest()}</Box>
        </Popper>
      )}
    </Box>
  );
}

export default SearchSuggestInfinite;
