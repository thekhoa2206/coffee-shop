import { Box, FormHelperText, IconButton, InputLabel, TextField, Theme } from "@material-ui/core";
import { Autocomplete as MuiAutocomplete, AutocompleteChangeDetails, GetTagProps } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import ChipComponent from "components/Chip";
import { InfoCircle } from "components/SVG";
import ButtonCloseIcon from "components/SVG/ButtonCloseIcon";
import TooltipComponent from "components/Tooltip";
import { isString } from "lodash";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { colorInk } from "theme/palette";
import { SnackbarErrorProp } from "utilities";
import { v4 as uuidv4 } from "uuid";

type ReasonCustom = "clear" | "create-option" | "select-option" | "remove-option" | "blur" | "remove-in-chip";
interface AutocompleteBaseProps<T> {
  options: T[];
  value?: T[];
  getOptionLabel?: (option: T) => string;
  onChange?: (value: T[], reason: ReasonCustom, details?: AutocompleteChangeDetails<T>) => void;
  tooltipLabelProps?: {
    title: string;
  };
  label?: string;
  id?: string;
  required?: boolean;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  validateOnChange?: (value: string) => boolean;
  validateChangeValue?: (value: T) => boolean;
  errorTextNoti?: string;
}

function AutocompleteBaseV2<T>(props: AutocompleteBaseProps<T>) {
  const {
    id,
    label,
    style,
    error,
    options,
    required,
    onChange,
    className,
    helperText,
    placeholder,
    getOptionLabel,
    validateOnChange,
    tooltipLabelProps,
    errorTextNoti,
    validateChangeValue,
  } = props;
  let idInput = id ? id : uuidv4();
  const classes = useStyles(props)();
  const [text, setText] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  const handleOptionLabel = (option: T | string): string => {
    if (isString(option)) {
      return option;
    } else if (getOptionLabel) {
      return getOptionLabel(option);
    }
    return "";
  };
  const [_value, _setValue] = useState<T[]>(props.value || []);
  const handleChange = (value: T[], reason: ReasonCustom, details?: AutocompleteChangeDetails<T>) => {
    // if (reason === "remove-option") {
    //   return;
    // }
    if (validateChangeValue) {
      if (value && value.length > 0) {
        if (validateChangeValue(value[value.length - 1])) {
          _setValue(value);
          onChange && onChange(value, reason);
        } else {
          enqueueSnackbar(errorTextNoti || "", SnackbarErrorProp);
          value.splice(value.length - 1, 1);
          _setValue(value);
          onChange && onChange(value, reason);
        }
      } else {
        _setValue(value);
        onChange && onChange(value, reason);
      }
    } else {
      _setValue(value);
      onChange && onChange(value, reason);
    }
  };

  useEffect(() => {
    _setValue(props.value || []);
  }, [props.value]);

  return (
    <Box style={style}>
      <MuiAutocomplete
        style={style}
        className={className}
        multiple
        limitTags={3}
        options={options}
        getOptionLabel={getOptionLabel}
        value={_value}
        onChange={(e, val, reason) => handleChange(val, reason)}
        freeSolo
        onBlur={() => {
          setText("");
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            setText("");
          }
        }}
        inputValue={text}
        classes={{ root: classes.root, tag: classes.tag, paper: classes.paper }}
        renderInput={(params) => {
          return (
            <Fragment>
              {label && (
                <InputLabel shrink className={classes.inputLabelRoot} htmlFor={idInput} required={required}>
                  {label}
                  {tooltipLabelProps?.title && (
                    <TooltipComponent
                      placement="top"
                      arrow
                      classes={{ tooltip: classes.tooltipLabel }}
                      {...tooltipLabelProps}
                      children={
                        <IconButton style={{ padding: 0, marginLeft: 6 }}>
                          <InfoCircle
                            style={{
                              width: 12,
                              height: 12,
                              cursor: "pointer",
                            }}
                            color="primary"
                          />
                        </IconButton>
                      }
                    />
                  )}
                </InputLabel>
              )}
              <TextField
                classes={{ root: classes.textFieldRoot }}
                variant="outlined"
                {...params}
                value={text}
                placeholder={_value?.length === 0 ? placeholder : ""}
                onChange={(e) => {
                  const value = e.target.value as string;
                  if (validateOnChange) {
                    if (validateOnChange(value)) {
                      setText(value);
                    }
                  } else {
                    setText(value);
                  }
                }}
                onBlur={(e) => {
                  const newTag = e.target.value as any;
                  if (!newTag || newTag.trim() === "") return;
                  let cloneVal = [..._value];

                  if (_value.includes(newTag)) {
                    _setValue(cloneVal);
                  } else {
                    if (validateChangeValue) {
                      if (validateChangeValue(newTag)) {
                        cloneVal = [..._value, newTag];
                        _setValue(cloneVal);
                        onChange && onChange(cloneVal, "create-option");
                        setTimeout(() => {
                          _setValue(cloneVal);
                        }, 10);
                      } else {
                        enqueueSnackbar(errorTextNoti || "", SnackbarErrorProp);
                        _setValue(cloneVal);
                      }
                    } else {
                      cloneVal = [..._value, newTag];
                      _setValue(cloneVal);
                      onChange && onChange(cloneVal, "create-option");
                      setTimeout(() => {
                        _setValue(cloneVal);
                      }, 10);
                    }
                  }
                }}
                style={{ minHeight: "inherit" }}
              />
            </Fragment>
          );
        }}
        closeIcon={null}
        renderTags={(value: T[], getTagProps: GetTagProps) => {
          return value.map((option, index) => {
            const tagsProps = getTagProps({ index });
            return (
              <ChipComponent
                key={index}
                type="info"
                size="medium"
                label={handleOptionLabel(option)}
                style={{ fontSize: 14 }}
                deleteIcon={<ButtonCloseIcon className={classes.closeTagIcon} />}
                {...tagsProps}
                onDelete={(e) => {
                  const newVal = [...value];
                  newVal.splice(index, 1);
                  handleChange(newVal, "remove-in-chip");
                }}
              />
            );
          });
        }}
      />
      {helperText && error ? (
        <FormHelperText classes={{ root: classes.helperTextRoot }}>{helperText}</FormHelperText>
      ) : null}
    </Box>
  );
}

const useStyles = (props: AutocompleteBaseProps<any>) =>
  makeStyles((theme: Theme) => ({
    root: {
      "& .MuiInputBase-root": {
        minHeight: "inherit",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: props.style?.minHeight === 36 ? "4px 37px 4px 4px" : "6px 37px 6px 4px",
        "& .MuiInputBase-input": {
          marginTop: props.style?.minHeight === 36 ? -4 : -6,
          marginBottom: props.style?.minHeight === 36 ? -4 : -6,
        },
        "&:hover": {
          "& fieldset.MuiOutlinedInput-notchedOutline": {
            borderColor: props.error ? theme.palette.error.main : "",
          },
        },
      },
      '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input': {
        padding: props.style?.minHeight === 36 ? "10px 8px 10px 6px" : "11.5px 8px 11.5px 6px",
        height: "unset",
      },
      "&.Mui-focused": {
        "& fieldset.MuiOutlinedInput-notchedOutline": {
          borderColor: props.error ? theme.palette.error.main : "",
        },
      },
      "& fieldset.MuiOutlinedInput-notchedOutline": {
        borderColor: props.error ? theme.palette.error.main : "",
      },
    },
    helperTextRoot: {
      fontSize: "12px",
      paddingLeft: "12px",
      color: props.error ? theme.palette.error.main : "",
    },
    paper: {
      margin: 0,
      boxShadow:
        "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)",
      "& .MuiAutocomplete-option": {
        borderRadius: 3,
        margin: "6px 0",
      },
      "& .MuiAutocomplete-option[aria-selected='true']": {
        backgroundColor: "#E6F4FF",
      },
      "& .MuiAutocomplete-option[data-focus='true']": {
        backgroundColor: "#E6F4FF",
        color: theme.palette.primary.main,
      },
      "& .MuiAutocomplete-listbox": {
        padding: "3px 5px",
        maxHeight: 324,
        "&::-webkit-scrollbar": {
          width: 6,
          height: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#bcbcbc",
          borderRadius: 6,
          "&:hover": {
            backgroundColor: "#A3A8AF",
          },
        },
      },
    },
    textFieldRoot: {
      "& input": {
        color: colorInk.primary,
        "&::placeholder": {
          color: colorInk.base40,
          opacity: 1,
        },
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: 3,
        color: colorInk.primary,
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderWidth: "1px",
        },
      },
    },
    inputLabelRoot: {
      top: 0,
      marginTop: 0,
      marginBottom: 7,
      display: "flex",
      alignItems: "center",
      color: colorInk.base80,
      "&.MuiInputLabel-shrink": {
        transform: "none",
        fontSize: 14,
        lineHeight: "17px",
      },
      "&.Mui-error": {
        color: colorInk.base80,
      },
      "& .MuiFormLabel-asterisk": {
        color: theme.palette.error.main,
      },
    },
    tooltipLabel: {
      order: 1,
    },
    tag: {
      margin: 2,
      backgroundColor: "#E6F4FF",
      color: "#2B4263",
      padding: "2px 0px",
      whiteSpace: "normal",
      height: "unset",
      minHeight: 24,
      "&>.MuiChip-label": {
        whiteSpace: "normal",
      },
      "&:not(.MuiChip-deletable)": {
        minHeight: 24,
        borderRadius: 16,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 15px",
      },
    },
    closeTagIcon: {
      width: 12,
      height: 12,
      marginTop: -2,
      marginRight: 12,
      color: theme.palette.primary.main,
    },
  }));

export default React.memo(AutocompleteBaseV2);
