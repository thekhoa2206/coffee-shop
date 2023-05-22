import {
  Box,
  RootRef,
  Typography,
  InputBase as MuiInputBase,
  ClickAwayListener,
  IconButton,
  Chip,
} from "@material-ui/core";
import Popper from "components/Popper/PopperBase";
import React, { FocusEvent, useEffect, useMemo, useRef, useState } from "react";
import { TagSuggestProps } from "./types";
import useStyles from "./styles";
import { v4 as uuidv4 } from "uuid";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import clsx from "clsx";
import useDebounce from "hocs/useDebounce";
import { isArray, isEqual } from "lodash";
import { removeAscent } from "utilities";
import CircularProgress from "components/Loading/CircularProgress";
import { ArrowLeftIcon, ArrowRightIcon } from "components/SVG";
import ClearIcon from "@material-ui/icons/Clear";

function TagSuggest<T>(props: TagSuggestProps<T>) {
  const {
    uniqKey,
    open,
    width = 300,
    label,
    options,
    debounce = 0,
    value,
    loading = false,
    paging,
    clearInputBtn,
    maxHeightListOption,
    disableCloseOnSelect,
    placeholder,
    openOnFocus,
    onChange,
    onClose,
    onOpen,
    onBlur,
    onRemoveTag,
    onInputChange,
    getOptionLabel,
    renderOption,
    checkActivePagingBtn,
    handlePagingChange,
    error,
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
        onClose?.();
        _setOptionSuggest(options || []);
        if (inputValue.trim()) {
          if (!optionsSelected.some((m) => compareOption(inputValue as any, m))) {
            onChange?.([...optionsSelected, ...(inputValue.trim().split(",") as any)]);
            setInputValue("");
          }
        }
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
    if (inputValue.trim() && _optionsSuggest.length <= 0 && _open) {
      if (!optionsSelected.some((m) => compareOption(inputValue as any, m))) {
        onChange?.([...optionsSelected, ...(inputValue.trim().split(",") as any)]);
        onBlur?.([...optionsSelected, ...(inputValue.trim().split(",") as any)]);
        _setOpen(false);
        setInputValue("");
      } else onBlur?.(null);
    } else onBlur?.(null);
  };

  const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsInputFocus(true);
    if (openOnFocus) {
      _setOpen(true);
    }
  };

  const handleCloseDropdown = () => {
    _setOpen(false);
    onClose?.();
  };

  const _onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    _setOpen(true);
    let _inputValue = event.target.value;
    if (_inputValue.indexOf(",") === 0) {
      _inputValue = _inputValue.slice(1, _inputValue.length);
    }
    setInputValue(_inputValue);
  };

  const compareOption = (item: T, other: T) => {
    if (uniqKey && typeof item === "object" && (item as any).hasOwnProperty(uniqKey)) {
      return (item as any)[uniqKey] === (other as any)[uniqKey];
    } else if (uniqKey && typeof item === "object" && !(item as any).hasOwnProperty(uniqKey)) {
    }
    return isEqual(item, other);
  };

  const isSlectedOption = (item: T) => {
    return optionsSelected.some((m) => compareOption(item, m));
  };

  const handleSelectOption = (item: T, event: React.MouseEvent<HTMLElement>) => {
    if (!optionsSelected.some((m) => compareOption(item, m))) {
      onChange?.([...optionsSelected, item]);
    }
    setInputValue("");

    if (!disableCloseOnSelect) {
      _setOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputValue && inputValue.trim() && (event.key === "Enter" || event.key === ",")) {
      if (!optionsSelected.some((m) => compareOption(inputValue as any, m))) {
        onChange?.([...optionsSelected, ...(inputValue.trim().split(",") as any)]);
      }
      setInputValue("");
      _setOpen(false);
    } else if (event.key === "Backspace" && inputValue === "") {
      let newOptions = [...optionsSelected];
      newOptions.pop();
      onChange?.(newOptions);
      _setOpen(false);
    }
  };

  const onDeleteTag = (item: T) => {
    let newOptions = optionsSelected.filter((m) => !compareOption(m, item));
    onChange?.(newOptions);
    onRemoveTag?.(newOptions);
    _setOpen(false);
  };

  return (
    <Box className={classes.root} width={width}>
      <RootRef rootRef={setReferencePopper}>
        <Box className={clsx(classes.wrapperParentElement)}>
          {label && <Typography color="textSecondary">{label}</Typography>}
          <ClickAwayListener onClickAway={() => setIsInputFocus(false)} mouseEvent="onMouseDown">
            <Box
              style={{ border: error ? "1px solid red" : "" }}
              className={clsx(classes.rootInputSearch, "root-input-tags", isInputFocus ? "focused" : "")}
              onClick={() => {
                setIsInputFocus(true);
                _setOpen(true);
                inputRef?.current?.querySelector("input")?.focus();
              }}
            >
              {React.Children.toArray(
                optionsSelected.map((item) => (
                  <Chip
                    label={item}
                    onDelete={(e) => onDeleteTag(item)}
                    onClick={() => {}}
                    className="chip-tag"
                    deleteIcon={<ClearIcon />}
                  />
                ))
              )}
              <MuiInputBase
                input-type="sapo-autocomplete-input"
                placeholder={placeholder}
                value={inputValue}
                onChange={_onInputChange}
                className="input-tags"
                ref={inputRef}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
              />
              {inputValue && clearInputBtn && (
                <IconButton onClick={() => setInputValue("")} style={{ padding: 0 }}>
                  <HighlightOffIcon className="clear-icon" />
                </IconButton>
              )}
            </Box>
          </ClickAwayListener>
        </Box>
      </RootRef>
      {options && _optionsSuggest.length > 0 && (
        <Popper
          open={_open}
          referenceElement={referencePopper}
          onClose={handleCloseDropdown}
          ignoreEventCloseInRootRef={true}
        >
          <Box id={idWrapperDropdownSuggest} className={classes.wrapperDropdownSuggest}>
            {loading ? (
              <Box className={classes.loading}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <Box>
                <Box maxHeight={maxHeightListOption} className="wrapper-list-option">
                  {_optionsSuggest.length > 0
                    ? React.Children.toArray(
                        _optionsSuggest.map((item) => (
                          <Box
                            className={classes.rootSuggestItem}
                            onClick={(e) => {
                              handleSelectOption(item, e);
                            }}
                          >
                            {renderOption ? (
                              renderOption(item, isSlectedOption(item))
                            ) : (
                              <Box className="suggest-item">
                                <Typography color="textPrimary">{_getOptionLabel(item)}</Typography>
                              </Box>
                            )}
                          </Box>
                        ))
                      )
                    : null}
                </Box>
                <Box borderTop="1px solid #E8EAEB">
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
        </Popper>
      )}
    </Box>
  );
}

export default React.memo(TagSuggest);
