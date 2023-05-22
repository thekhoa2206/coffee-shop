import { Box, FormHelperText, IconButton, InputBase as MuiInputBase, Typography } from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import CircularProgress from "components/Loading/CircularProgress";
import { ArrowLeftIcon, ArrowRightIcon } from "components/SVG";
import useDebounce from "hocs/useDebounce";
import { isArray, isEqual, isNil, uniqWith } from "lodash";
import React, { Children, Fragment, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { removeAscent } from "utilities/Helpers";
import { v4 as uuidv4 } from "uuid";
import CheckBox from "../Checkbox/index";
import InputBase from "../InputBase";
import Chip from "@material-ui/core/Chip";
import useStyles from "./SearchSuggest.styles";
import Popper, { PopperBaseProps } from "components/Popper/PopperBase";
import ClearIcon from "@material-ui/icons/Clear";
import Tooltip from "components/Tooltip";
import InputTags from "./components/InputTags";
import { useTranslation } from "react-i18next";

export interface SearchSuggestProps<T> {
  open?: boolean;
  inline?: boolean;
  type?: "search" | "select-search" | "select" | "search-tags" | "filter";
  options: T[];
  allOptions?: T[];
  multiple?: boolean;
  optionSelectAll?: boolean;
  value?: T | T[] | null;
  loading?: boolean;
  debounce?: number;
  inputId?: string;
  width?: string;
  paging?: boolean;
  uniqKey?: string;
  creatable?: boolean;
  creatableText?: string;
  CreatableComponent?: any;
  placeholder?: string;
  placeholderSelect?: string;
  disableCloseOnSelect?: boolean;
  textNoOption?: string;
  textSelectAll?: string;
  label?: string;
  maxHeightListOption?: number | string;
  widthPopper?: number | string;
  getLabelSelect?: (optionsSelected: T | T[] | null) => string;
  renderOption?: (option: T) => ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
  onChange?: (value: T | T[] | null) => void;
  getOptionLabel: (option: T) => string;
  onInputChange?: (value: string) => void;
  checkActivePagingBtn?: (type: string) => boolean;
  handlePagingChange?: (type: string) => void;
  handleClickCreatable?: (inputValue: string) => void;
  style?: React.CSSProperties;
  error?: boolean;
  helperText?: string;
  className?: string;
  renderFakeSelectButton?: React.ComponentType<BtnTemplateProps>;
  popperProps?: PopperBaseProps;
  defaultOpen?: boolean;
  placement?: string;
  required?: boolean;
  showResult?: boolean;
  textButtonShowResult?: string;
  inputSearchClassRoot?: string;
  popperStyle?: React.CSSProperties;
  isInlineDisplay?: boolean;
  isDisable?: boolean;
}

export interface BtnTemplateProps {
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
  className?: string | undefined;
  open: boolean;
}

function SearchSuggest<T>(props: SearchSuggestProps<T>) {
  const { t } = useTranslation(["customer"]);
  const {
    inline,
    options,
    multiple,
    loading,
    value,
    paging,
    uniqKey,
    optionSelectAll,
    debounce = 0,
    width = 300,
    maxHeightListOption = 300,
    creatable,
    creatableText = `${t("component:button.addNew")}`,
    CreatableComponent,
    placeholder,
    placeholderSelect,
    type = "search",
    disableCloseOnSelect,
    textNoOption = `Không có kết quả`,
    textSelectAll = `${t("component:filter.selectAll")}`,
    label,
    getLabelSelect,
    renderOption,
    onClose,
    onOpen,
    getOptionLabel,
    onChange,
    onInputChange,
    checkActivePagingBtn,
    handlePagingChange,
    placement,
    handleClickCreatable,
    defaultOpen = false,
    required,
    textButtonShowResult = `${t("component:filter.selected")}`,
    showResult,
    inputSearchClassRoot,
    popperStyle,
    isInlineDisplay,
    isDisable,
  } = props;
  const classes = useStyles(props)();
  const [suggestItems, setSuggestItems] = useState<T[]>(options);
  const didMountRef = useRef(false);
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, debounce);
  const [open, setOpen] = useState(defaultOpen);
  let uniqIdComponent = useMemo(() => uuidv4(), []);
  const [referenceElement, setReferenceElement] = useState(null);
  let optionsSelected = useMemo(() => (value ? value : multiple || type === "search-tags" ? [] : null), [value]);

  const compareItem = (item: T, other: T) => {
    return uniqKey ? (item as any)[uniqKey] === (other as any)[uniqKey] : isEqual(item, other);
  };

  const renderLabelItem = (option: T) => (isNil(getOptionLabel?.(option)) ? option : getOptionLabel(option));

  useEffect(() => {
    if (didMountRef.current) {
      if (onInputChange) {
        onInputChange(debouncedSearchTerm);
      } else {
        let newSuggestItems = options.filter((item) =>
          removeAscent(getOptionLabel(item)).includes(removeAscent(debouncedSearchTerm))
        );
        setSuggestItems(newSuggestItems);
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setSuggestItems(options);
  }, [options, open]);

  useEffect(() => {
    if (open) {
      onOpen?.();
    }
  }, [open]);

  useEffect(() => {
    didMountRef.current = true;
  }, []);

  const handleSelectItem = (item: T) => {
    if (type !== "search-tags") {
      if (multiple && isArray(optionsSelected)) {
        let hasItemSelected = optionsSelected.some((m) => compareItem(item, m));
        if (hasItemSelected) {
          onChange?.([...optionsSelected.filter((m) => !compareItem(item, m))]);
        } else {
          onChange?.([...optionsSelected, item]);
        }
      } else {
        onChange?.(item);
        if (!disableCloseOnSelect) {
          setOpen(false);
          onClose?.();
          setInputValue("");
        }
      }
    } else {
      if (isArray(optionsSelected)) {
        if (!optionsSelected.some((m) => compareItem(item, m))) {
          onChange?.([...optionsSelected, item]);
        }
        if (!disableCloseOnSelect) {
          setOpen(false);
          onClose?.();
          setInputValue("");
        }
      }
    }
  };
  useEffect(() => {}, [open]);

  const isCheckedOptionSelectAll = () => {
    let allOptions = props.allOptions || suggestItems;
    return (
      isArray(optionsSelected) &&
      allOptions.every((item) => isArray(optionsSelected) && optionsSelected.some((m) => compareItem(m, item)))
    );
  };

  const handleClickOptionSelectAll = () => {
    if (isArray(optionsSelected)) {
      if (isCheckedOptionSelectAll()) {
        let allOptions = props.allOptions || suggestItems;
        let newListItemSelected = optionsSelected.filter((item) => !allOptions.some((m) => compareItem(m, item)));
        onChange?.(newListItemSelected);
      } else {
        let allOptions = props.allOptions || suggestItems;
        onChange?.(uniqWith([...optionsSelected, ...allOptions], compareItem));
      }
    }
  };

  const handleClickDeleteAllOptionSelected = () => {
    onChange?.([]);
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
              indexFocus = i !== 0 ? i - 1 : sizeItems - 1;
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
          setInputValue("");
          setOpen(false);
          return;
        }
        if (!idFocus || !uniqKey) return;
        const itemFocus = suggestItems.find((e) => (e as any)[uniqKey]?.toString() === idFocus);
        if (!itemFocus) return;
        if (multiple && isArray(optionsSelected)) {
          let hasItemSelected = optionsSelected.some((m) => compareItem(itemFocus, m));
          if (hasItemSelected) {
            onChange?.([...optionsSelected.filter((m) => !compareItem(itemFocus, m))]);
          } else {
            onChange?.([...optionsSelected, itemFocus]);
          }
        } else {
          onChange?.(itemFocus);
          if (!disableCloseOnSelect) {
            setOpen(false);
            onClose?.();
            setInputValue("");
          }
        }
      } else if (type === "search-tags" && isArray(optionsSelected) && inputValue) {
        if (!optionsSelected.some((m) => compareItem(inputValue as any, m))) {
          onChange?.([...optionsSelected, inputValue.replace(",", "") as any]);
        }
        setOpen(false);
        setInputValue("");
      }
    } else if (
      e.key === "Backspace" &&
      type === "search-tags" &&
      inputValue === "" &&
      isArray(optionsSelected) &&
      optionsSelected.length > 0
    ) {
      let newOptions = [...optionsSelected];
      newOptions.pop();
      onChange?.(newOptions);
      setOpen(false);
    }
  };

  const renderCreatableContent = () => {
    if (CreatableComponent) {
      return (
        <CreatableComponent
          onClick={() => {
            handleClickCreatable?.(inputValue);
            onClose?.();
            setOpen(false);
          }}
          key-event="true"
          data-id="-1"
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
          }}
          key-event="true"
          data-id="-1"
        >
          <AddCircleIcon />
          {creatableText}
        </Box>
      );
    }
  };

  const isSelectedItem = (item: T) => {
    if (multiple && isArray(optionsSelected)) {
      return optionsSelected.some((m) => compareItem(m, item));
    } else if (!multiple && optionsSelected && !isArray(optionsSelected)) {
      return compareItem(item, optionsSelected);
    } else {
      return false;
    }
  };

  const renderListOption = () => {
    return Children.toArray(
      suggestItems.map((item) => (
        <Box
          className={clsx("menuItem", renderOption ? "custom-item" : "", isSelectedItem(item) ? "selected-item" : "")}
          onClick={() => handleSelectItem(item)}
          key-event="true"
          data-id={uniqKey && (item as any)[uniqKey]}
        >
          {renderOption ? (
            renderOption(item)
          ) : (
            <>
              {multiple && isArray(optionsSelected) && <CheckBox className="checkBox" checked={isSelectedItem(item)} />}
              {renderLabelItem(item)}
            </>
          )}
        </Box>
      ))
    );
  };

  const renderPaging = () => {
    return (
      paging && (
        <Box className={classes.paginate}>
          <Box>
            <IconButton
              className="paging-btn prev"
              disabled={checkActivePagingBtn?.("prev")}
              onClick={() => handlePagingChange?.("prev")}
            >
              <ArrowRightIcon />
            </IconButton>
            <IconButton
              className="paging-btn next"
              disabled={checkActivePagingBtn?.("next")}
              onClick={() => handlePagingChange?.("next")}
            >
              <ArrowLeftIcon />
            </IconButton>
          </Box>
        </Box>
      )
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
            <Box maxHeight={maxHeightListOption} overflow="auto" className={classes.menuItems}>
              {renderListOption()}
            </Box>
            {renderPaging()}
          </Fragment>
        ) : !loading ? (
          <Box className={classes.noOptions}>{textNoOption}</Box>
        ) : (
          <Box className={classes.loading}>
            <CircularProgress size={30} />
          </Box>
        )}
      </Fragment>
    );
  };

  const renderInputSearch = () => (
    <Box className={clsx(classes.input, (inline || type === "select-search") && " inline", inputSearchClassRoot)}>
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
        InputProps={{ startAdornment: <SearchIcon /> }}
        height={inline || type === "select-search" ? "40px" : "36px"}
        width="100%"
        placeholder={placeholder}
        onKeyDown={(e) => handleKeyDown(e)}
        onChange={(event) => {
          setInputValue(event.target.value);
          setOpen(true);
        }}
      />
      {showResult && optionsSelected && isArray(optionsSelected) && optionsSelected.length > 0 && (
        <Tooltip title={optionsSelected.map((item) => renderLabelItem(item)).join(", ")} placement="left" arrow>
          <Chip
            label={`${textButtonShowResult} ${optionsSelected.length}`}
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
        {isArray(optionsSelected) && optionsSelected.length > 0 && (
          <Tooltip title={optionsSelected.map((item) => renderLabelItem(item)).join(",")} placement="left" arrow>
            <Chip
              placeholder={placeholder}
              label={`${t("component:filter.selected")} ${optionsSelected.length}`}
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
          onClick={(e) => setOpen(!open)}
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
            onClick={(e) => {
              if (!isDisable) setOpen(!open);
            }}
            className={clsx(
              classes.fakeSelectButton,
              props.className,
              { open: open },
              { [classes.inlineSelect]: isInlineDisplay }
            )}
            onKeyDown={(e) => {
              if (e.keyCode === 13 || e.keyCode === 40) {
                setOpen(true);
              }
            }}
            style={isDisable ? { cursor: "default", backgroundColor: "F3F4F5 !important#" } : {}}
            tabIndex={0}
          >
            <Typography color="textPrimary" className="label-select">
              {getLabelSelect && getLabelSelect(optionsSelected)
                ? getLabelSelect(optionsSelected)
                : `${placeholderSelect || ""}`}
            </Typography>
            <ArrowDropDownIcon />
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
            tags={isArray(optionsSelected) ? (optionsSelected as any) : []}
            onKeyDown={handleKeyDown}
            onClick={() => {
              if (open) {
                onClose?.();
              }
              setOpen(!open);
            }}
            onDelete={(value) => {
              if (isArray(optionsSelected)) {
                onChange?.(optionsSelected.filter((item) => item !== (value as any)));
              }
            }}
            onChange={(event) => {
              setInputValue(event.target.value.replace(",", ""));
              setOpen(true);
            }}
          />
        );
      default:
        return renderFakeSelectButton();
    }
  };

  return (
    <Box width={width} className={isInlineDisplay ? classes.flex : classes.root}>
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
          referenceElement={referenceElement}
          onClose={() => {
            if (type === "search-tags") {
              if (
                isArray(optionsSelected) &&
                inputValue &&
                !optionsSelected.some((m) => compareItem(inputValue as any, m))
              ) {
                onChange?.([...optionsSelected, inputValue.replace(",", "") as any]);
              }
              setOpen(false);
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
          style={popperStyle}
        >
          <Box wrapper-suggest={uniqIdComponent}>{renderContentSuggest()}</Box>
        </Popper>
      )}
    </Box>
  );
}

export default SearchSuggest;
