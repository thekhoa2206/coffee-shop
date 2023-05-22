import {
  Box,
  FormHelperText,
  IconButton,
  InputLabel,
  TextareaAutosize as MuiTextareaAutosize,
  TooltipProps,
} from "@material-ui/core";
import { ClassNameMap } from "@material-ui/styles";
import clsx from "clsx";
import { InfoCircle } from "components/SVG";
import TooltipComponent from "components/Tooltip";
import _ from "lodash";
import React, { memo } from "react";
import useStyles from "./TextareaAutosize.styles";

export interface TextareaAutosizeProps {
  classes?: ClassNameMap<"root">;
  style?: React.CSSProperties;
  className?: string;
  required?: boolean;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  label?: React.ReactNode;
  width?: number;
  placeholder?: string;
  error?: boolean;
  helperText?: string | false;
  tooltipLabelProps?: TooltipProps;
  disabled?: boolean;
  value?: string | "";
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  maxLength?: number;
  refProps?: React.Ref<HTMLTextAreaElement> | null;
  autoFocus?: boolean;
}


const TextareaAutosize = memo(
  React.forwardRef((props: TextareaAutosizeProps) => {
    const {
      style,
      className,
      height,
      minHeight,
      maxHeight,
      value,
      maxLength,
      label,
      error,
      disabled,
      required,
      helperText,
      tooltipLabelProps,
      onBlur,
      onChange,
      placeholder,
      refProps,
      autoFocus,
    } = props;
    const classes = useStyles(props)();

    return (
      <Box className={clsx(classes.root, props.classes?.root, className)} style={style}>
        {label && (
          <InputLabel shrink className={classes.inputLabelRoot} required={required}>
            {label}
            {tooltipLabelProps?.title && (
              <TooltipComponent
                placement="top"
                arrow
                classes={{ tooltip: classes.tooltipLabel }}
                {...tooltipLabelProps}
              >
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
              </TooltipComponent>
            )}
          </InputLabel>
        )}
        <MuiTextareaAutosize
          disabled={disabled}
          value={_.isNil(value) ? "" : value}
          onChange={onChange}
          onBlur={onBlur}
          style={{ height: height, minHeight: minHeight, maxHeight: maxHeight, overflow: "auto" }}
          className={clsx(classes.input, "TextareaAutosize-Input", { disabled: disabled })}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          ref={refProps}
        />
        {helperText && error ? (
          <FormHelperText classes={{ root: classes.helperTextRoot }}>{helperText}</FormHelperText>
        ) : (
          ""
        )}
      </Box>
    );
  })
);

TextareaAutosize.displayName = "TextareaAutosize";
export default TextareaAutosize;
