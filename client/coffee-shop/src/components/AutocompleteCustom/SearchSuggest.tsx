import {
  Box,
  Chip,
  ClickAwayListener,
  IconButton,
  InputBase as MuiInputBase,
  RootRef,
  Typography,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import CircularProgress from "components/Loading/CircularProgress";
import Popper from "components/Popper/PopperBase";
import { ArrowLeftIcon, ArrowRightIcon } from "components/SVG";
import Tooltip from "components/Tooltip";
import useDebounce from "hocs/useDebounce";
import { isArray, isEqual, uniqWith } from "lodash";
import React, { FocusEvent, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { colorInk } from "theme/palette";
import { removeAscent } from "utilities";
import { v4 as uuidv4 } from "uuid";
import Checkbox from "../Checkbox";
import useStyles from "./styles";
import { SearchSuggestProps } from "./types";
import i18next from "i18next";
const t = i18next.getFixedT(null, "component");
function SearchSuggest<T>(props: SearchSuggestProps<T>) {
  const {
    uniqKey,
    open,
    width = 300,
    label,
    options,
    debounce = 0,
    value,
    multiple,
    textNoOption = `${t("component:filter.searchEmpty")}`,
    loading = false,
    optionSelectAll,
    textSelectAll = `${t("component:filter.selectAll")}`,
    paging,
    clearInputBtn,
    showResult,
    textButtonShowResult = `${t("component:filter.selected")}`,
    maxHeightListOption,
    placeholder,
    disableCloseOnSelect,
    openOnFocus,
    variant = "default",
    autoFocus,
    onChange,
    onClose,
    onOpen,
    onInputChange,
    getOptionLabel,
    renderOption,
    checkActivePagingBtn,
    handlePagingChange,
    placementPopper,
  } = props;
  const [referencePopper, setReferencePopper] = useState(null);
  const [_open, _setOpen] = useState(open);
  const idWrapperDropdownSuggest = useMemo(() => uuidv4(), []);
  const classes = useStyles();
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>();
  const [_optionsSuggest, _setOptionSuggest] = useState(options || []);
  const debouncedSearchTerm = useDebounce(inputValue, debounce);
  const didMountRef = useRef(false);

  let optionsSelected = useMemo(() => (isArray(value) ? value : []), [value]);
  let optionSelected = useMemo(() => (value && !isArray(value) ? value : null), [value]);

  useEffect(() => {
    if (didMountRef.current) {
      if (onInputChange) {
        onInputChange(debouncedSearchTerm);
      } else if (options) {
        let newOptionsSuggest = options.filter((item) => {
          return removeAscent(_getOptionLabel(item)).includes(removeAscent(debouncedSearchTerm));
        });
        _setOptionSuggest(newOptionsSuggest);
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    _setOptionSuggest(options || []);
  }, [options]);

  useEffect(() => {
    if (didMountRef.current) {
      if (_open) {
        onOpen?.();
      } else {
        setInputValue("");
        onClose?.();
        _setOptionSuggest(options || []);
      }
    }
  }, [_open]);

  useEffect(() => {
    didMountRef.current = true;
  }, []);

  const _getOptionLabel = (option: T) => {
    if (getOptionLabel) {
      return getOptionLabel(option);
    } else if (typeof option === "string") {
      return option;
    } else {
      return "";
    }
  };

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    // setIsInputFocus(false);
  };

  const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsInputFocus(true);
    if (openOnFocus && variant === "default") {
      _setOpen(true);
    }
  };

  const handleCloseDropdown = () => {
    _setOpen(false);
    onClose?.();
  };

  const _onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    _setOpen(true);
    setInputValue(event.target.value);
  };

  const compareOption = (item: T, other: T) => {
    if (uniqKey && typeof item === "object" && (item as any).hasOwnProperty(uniqKey)) {
      return (item as any)[uniqKey] === (other as any)[uniqKey];
    } else if (uniqKey && typeof item === "object" && !(item as any).hasOwnProperty(uniqKey)) {
    }
    return isEqual(item, other);
  };

  const isSlectedOption = (item: T) => {
    if (multiple) {
      return optionsSelected.some((m) => compareOption(item, m));
    } else if (optionSelected) {
      return compareOption(item, optionSelected);
    }
    return false;
  };

  const handleSelectOption = (item: T, event: React.MouseEvent<HTMLElement>) => {
    if (multiple) {
      if (!optionsSelected.some((m) => compareOption(item, m))) {
        onChange?.([...optionsSelected, item]);
      } else {
        onChange?.(optionsSelected.filter((m) => !compareOption(m, item)));
      }
    } else {
      onChange?.(item);
      if (!disableCloseOnSelect) {
        _setOpen(false);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {};

  const isCheckedOptionSelectAll = () => {
    return _optionsSuggest.every((item) => optionsSelected.some((m) => compareOption(m, item)));
  };

  const handleClickOptionSelectAll = () => {
    if (isArray(optionsSelected)) {
      if (isCheckedOptionSelectAll()) {
        let newListItemSelected = optionsSelected.filter(
          (item) => !_optionsSuggest.some((m) => compareOption(m, item))
        );
        onChange?.(newListItemSelected);
      } else {
        onChange?.(uniqWith([...optionsSelected, ..._optionsSuggest], compareOption));
      }
    }
  };

  const handleClickDeleteAllOptionSelected = () => {
    onChange?.([]);
    _setOpen(false);
    setIsInputFocus(false);
  };

  const renderInput = () => {
    return (
      <Box
        className={clsx(classes.rootInputSearch, isInputFocus ? "focused" : "")}
        onClick={() => {
          setIsInputFocus(true);
          variant === "default" && _setOpen(true);
          inputRef?.current?.querySelector("input")?.focus();
        }}
      >
        <SearchIcon className="search-icon" />
        <MuiInputBase
          autoFocus={autoFocus}
          input-type="sapo-autocomplete-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={_onInputChange}
          className="input-element"
          ref={inputRef}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
        />
        {inputValue && clearInputBtn && !showResult && (
          <IconButton onClick={() => setInputValue("")} style={{ padding: 0 }}>
            <HighlightOffIcon className="clear-icon" />
          </IconButton>
        )}
        {showResult && optionsSelected.length > 0 && (
          <Tooltip title={optionsSelected.map((item) => _getOptionLabel(item)).join(", ")} placement="left" arrow>
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
  };

  const renderContentSuggest = () => {
    return (
      <Box id={idWrapperDropdownSuggest} className={classes.wrapperDropdownSuggest}>
        {loading ? (
          <Box className={classes.loading}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <Box>
            {optionSelectAll ? (
              <Box borderBottom="1px solid #E8EAEB">
                {optionSelectAll && multiple && _optionsSuggest.length > 0 ? (
                  <Box className="select-all-option" onClick={handleClickOptionSelectAll}>
                    <Checkbox className="check-box" checked={isCheckedOptionSelectAll()} />
                    <Typography color="textPrimary">{textSelectAll}</Typography>
                  </Box>
                ) : null}
              </Box>
            ) : null}
            <Box maxHeight={maxHeightListOption} className="wrapper-list-option">
              {_optionsSuggest.length > 0 ? (
                React.Children.toArray(
                  _optionsSuggest.map((item) => (
                    <Box className={classes.rootSuggestItem} onClick={(e) => handleSelectOption(item, e)}>
                      {renderOption ? (
                        renderOption(item, isSlectedOption(item))
                      ) : (
                        <Box className="suggest-item">
                          {multiple && <Checkbox className="check-box" checked={isSlectedOption(item)} />}
                          <Typography color="textPrimary">{_getOptionLabel(item)}</Typography>
                        </Box>
                      )}
                    </Box>
                  ))
                )
              ) : (
                <Typography className={classes.noResultText}>{textNoOption}</Typography>
              )}
            </Box>
            <Box borderTop="1px soli" borderColor={colorInk.base30}>
              {paging && _optionsSuggest.length > 0 ? (
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
              ) : null}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box className={classes.root} width={width}>
      {variant === "default" ? (
        <Fragment>
          <RootRef rootRef={setReferencePopper}>
            <Box className={clsx(classes.wrapperParentElement)}>
              {label && <Typography color="textSecondary">{label}</Typography>}
              <ClickAwayListener onClickAway={() => setIsInputFocus(false)} mouseEvent="onMouseDown">
                {renderInput()}
              </ClickAwayListener>
            </Box>
          </RootRef>
          {options && (
            <Popper
              open={_open}
              referenceElement={referencePopper}
              onClose={handleCloseDropdown}
              ignoreEventCloseInRootRef={true}
              placement={placementPopper}
            >
              {renderContentSuggest()}
            </Popper>
          )}
        </Fragment>
      ) : (
        <Fragment>
          {renderInput()} <div style={{ height: 4 }}> </div> {renderContentSuggest()}
        </Fragment>
      )}
    </Box>
  );
}

export default SearchSuggest;
