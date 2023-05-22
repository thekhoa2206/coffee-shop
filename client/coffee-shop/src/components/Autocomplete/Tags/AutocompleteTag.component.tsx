import { InputBaseComponentProps, InputLabel, TextField, Typography, WithStyles } from "@material-ui/core";
import { Autocomplete as MuiAutocomplete, AutocompleteChangeDetails, GetTagProps } from "@material-ui/lab";
import { withStyles } from "@material-ui/styles";
import ChipComponent from "components/Chip";
import { InfoCircle } from "components/SVG";
import ButtonCloseIcon from "components/SVG/ButtonCloseIcon";
import TooltipComponent from "components/Tooltip";
import { isNil, isString, uniqWith } from "lodash";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./AutocompleteTag.styles";
import useDebounce from "hocs/useDebounce";
import { TooltipProps } from "../../Tooltip/Tooltip.component";
import SnackbarUtils from "../../../utilities/SnackbarUtilsConfigurator";

type ReasonCustom = "clear" | "create-option" | "select-option" | "remove-option" | "blur" | "remove-in-chip";

interface AutocompleteTagProps {
  options: string[];
  defaultValue?: string[];
  getOptionLabel?: (option: string) => string;
  onChange?: (value: string[], reason: ReasonCustom, details?: AutocompleteChangeDetails) => void;
  tooltipLabelProps?: Omit<TooltipProps, "children">;
  label?: string;
  id?: string;
  required?: boolean;
  style?: React.CSSProperties;
  className?: string;
  inputChange?: (value: string) => void;
  placeholder?: string;
  onOpen?: (e: any) => void;
  inputStyle?: React.CSSProperties;
  inputProps?: InputBaseComponentProps;
  splitRegex?: any;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
}

function Autocomplete(props: AutocompleteTagProps & WithStyles<typeof styles>) {
  const {
    options,
    getOptionLabel,
    classes,
    defaultValue,
    tooltipLabelProps,
    id,
    label,
    required,
    onChange,
    style,
    className,
    inputChange,
    placeholder,
    onOpen,
    inputStyle,
    inputProps,
    splitRegex = /^.{1,255}$/g,
    disabled,
  } = props;
  let idInput = id ? id : uuidv4();
  const [text, setText] = useState<string>("");
  const _text = useDebounce(text, 300);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>(defaultValue || []);
  const [oldDefaultValue, setOldDefaultValue] = useState<string[]>();

  useEffect(() => {
    if (!oldDefaultValue && defaultValue && defaultValue.length > 0) {
      setValue(defaultValue);
      setOldDefaultValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (inputChange && open) inputChange(text);
  }, [_text, open]);

  const handleOptionLabel = useCallback((option: string): string => {
    if (isString(option)) {
      return option;
    } else if (getOptionLabel) {
      return getOptionLabel(option);
    }
    return "";
  }, []);

  const handleOpen = useCallback((e: any) => {
    setOpen(true);
    onOpen?.(e);
  }, []);

  const handleChange = useCallback((_value: string[], reason: ReasonCustom) => {
    // if (reason === "remove-option") {
    //   return;
    // }
    let newValue = _value;
    let isInValid = false;
    try {
      newValue = _value.flatMap((e) => {
        if (e.trim() === ",") return;
        let splitComma = e.match(/([^,]+)/g)?.filter((e) => e.trim() !== "");
        if (!splitComma || splitComma.length === 0) return [];
        return splitComma.flatMap((e) => {
          if (e?.match(splitRegex)) {
            return e;
          }
          isInValid = true;
          return null;
        });
      }) as string[];
      newValue = uniqWith(
        newValue.filter((e) => !isNil(e) && e.length > 0),
        (a: any, b: any) => a?.toLocaleLowerCase() === b?.toLocaleLowerCase()
      );
    } catch (e) {}

    if (isInValid && props.helperText) {
      SnackbarUtils.error(props.helperText);
    }
    setValue(newValue);
    onChange?.(newValue, reason);
  }, []);

  return (
    <Fragment>
      <MuiAutocomplete
        disabled={disabled}
        style={style}
        className={className}
        multiple
        limitTags={3}
        options={options}
        getOptionLabel={getOptionLabel}
        value={value}
        onChange={(e, val, reason) => handleChange(val, reason)}
        freeSolo
        onBlur={() => setText("")}
        classes={{ root: classes.root, tag: classes.tag, paper: classes.paper }}
        renderInput={(params) => {
          return (
            <Fragment>
              {label && (
                <InputLabel shrink className={classes.inputLabelRoot} htmlFor={idInput} required={required}>
                  {label}
                  {tooltipLabelProps?.title && (
                    <TooltipComponent
                      placement={tooltipLabelProps?.placement || "top"}
                      arrow
                      classes={{ tooltip: classes.tooltipLabel }}
                      {...tooltipLabelProps}
                      children={
                        <Typography variant="caption" style={{ order: 1 }}>
                          <InfoCircle
                            style={{
                              width: 12,
                              height: 12,
                              marginLeft: 6,
                              cursor: "pointer",
                            }}
                            color="primary"
                          />
                        </Typography>
                      }
                    />
                  )}
                </InputLabel>
              )}
              <TextField
                classes={{ root: classes.textFieldRoot }}
                variant="outlined"
                {...params}
                inputProps={{
                  ...params.inputProps,
                  ...inputProps,
                  style: {
                    ...inputStyle,
                  },
                }}
                value={text}
                error={props.error}
                onChange={(e) => {
                  let text = e.target.value;
                  if (text.includes(",")) {
                    handleChange([...value, text], "create-option");
                  } else {
                    setText(text);
                  }
                }}
                onBlur={(e) => {
                  const newTag = e.target.value as any;
                  if (!newTag || newTag.trim() === "") return;
                  let cloneVal = [...value];
                  if (value.includes(newTag)) {
                    setValue(cloneVal);
                  } else {
                    if (!splitRegex.test(newTag)) {
                      if (props.helperText) {
                        SnackbarUtils.error(props.helperText);
                      }
                      setValue(cloneVal);
                      return;
                    }
                    cloneVal = [...value, newTag];
                    setValue(cloneVal); // rerender input
                    onChange && onChange(cloneVal, "create-option");
                    setTimeout(() => {
                      setValue(cloneVal);
                    }, 10);
                  }
                }}
                placeholder={placeholder}
              />
            </Fragment>
          );
        }}
        onOpen={handleOpen}
        closeIcon={null}
        renderTags={(value: string[], getTagProps: GetTagProps) => {
          return value.map((option, index) => {
            const tagsProps = getTagProps({ index });
            return (
              <ChipComponent
                key={index}
                type="info"
                size="medium"
                label={handleOptionLabel(option)}
                style={{ fontSize: 14 }}
                deleteIcon={disabled ? <Fragment /> : <ButtonCloseIcon className={classes.closeTagIcon} />}
                {...tagsProps}
                disabled={false}
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
    </Fragment>
  );
}

export default React.memo(withStyles(styles)(Autocomplete));
