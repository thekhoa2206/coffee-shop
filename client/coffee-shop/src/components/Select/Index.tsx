import { Box, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, TooltipProps } from "@material-ui/core";
import MuiSelect, { SelectProps as MuiSelectProps } from "@material-ui/core/Select";
import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import { InfoCircle } from "components/SVG";
import TooltipComponent from "components/Tooltip";
import React from "react";
import { colorBorder, colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignSelf: "center",
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: "1px",
    },
    "& .placeholder .MuiSelect-root": {
      color: colorInk.primary,
      fontWeight: 400,
      "&.Mui-disabled": {
        color: colorInk.base40,
      },
    },
    maxWidth: "100%",
  },
  selectRoot: {
    overflow: "hidden",
    fontSize: "14px",
    boxSizing: "border-box",
    "&.Mui-disabled": {
      backgroundColor: colorInk.base20,
      color: colorInk.base60,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colorBorder.primary.main,
      },
    },
    "&.compact": {
      "& .MuiSelect-selectMenu": {
        paddingTop: 4,
        paddingBottom: 4,
        fontWeight: 400,
        fontSize: 12,
      },
    },
    "&.small": {
      "& .MuiSelect-selectMenu": {
        paddingTop: 8,
        paddingBottom: 8,
        fontWeight: 400,
        fontSize: 12,
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colorBorder.primary.main,
      top: -5,
    },
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colorBorder.primary.dark,
      },
    },
  },
  selectMenu: {
    lineHeight: "20px",
    paddingTop: 10,
    paddingBottom: 10,
    "&.Mui-disabled": {
      color: colorInk.base60,
    },
  },
  inputLabelRoot: {
    // top: "-24px",
    position: "unset",
    color: colorInk.base80,
    "&.Mui-focused": {
      color: colorInk.base80,
    },
    "&.MuiInputLabel-shrink": {
      transform: "none",
      fontSize: "14px",
      lineHeight: "17px",
    },
    "&.Mui-error": {
      color: colorInk.base80,
    },
    "& .MuiFormLabel-asterisk": {
      color: theme.palette.error.main,
    },
  },
  helperTextRoot: {
    fontSize: "12px",
    margin: "3px 0 0",
    paddingLeft: "12px",
  },
  labelRoot: {
    marginBottom: 7,
    height: 17,
    display: "flex",
  },
  tooltipLabel: {
    order: 1,
  },
}));

type Diff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } & { [P in U]: never } & {
  [x: string]: never;
})[T];
type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

interface ExtendedInterface extends Overwrite<TooltipProps, TooltipPropsCustom> {}

interface TooltipPropsCustom {
  children?: React.ReactElement;
}

interface SelectProps {
  size?: "compact" | "small" | "normal" | "large";
  helperText?: string;
  maxWidth?: string;
  styleDropdown?: React.CSSProperties;
  width?: string | number;
  tooltipProps?: ExtendedInterface;
  tooltipLabelProps?: ExtendedInterface;
  content?: string;
}

const Select = React.forwardRef((props: MuiSelectProps & SelectProps, ref: any) => {
  const classes = useStyles();
  const {
    size,
    error,
    label,
    style,
    value,
    required,
    maxWidth,
    children,
    fullWidth,
    className,
    width,
    helperText,
    placeholder,
    styleDropdown,
    tooltipProps,
    tooltipLabelProps,
    itemID,
    content,
    ...remainProps
  } = props;

  return (
    <Box className={className} style={{ maxWidth: maxWidth, width: fullWidth ? "100%" : "" }}>
      <FormControl
        variant="outlined"
        style={{ width: "100%", ...style }}
        error={error}
        fullWidth={fullWidth}
        classes={{ root: classes.root }}
      >
        {label && (
          <Box className={classes.labelRoot}>
            <InputLabel shrink className={classes.inputLabelRoot} required={required}>
              {label}
            </InputLabel>
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
          </Box>
        )}
        <MuiSelect
          ref={ref}
          value={value}
          error={error}
          required={required}
          displayEmpty
          classes={{ selectMenu: classes.selectMenu }}
          className={clsx(classes.selectRoot, { placeholder: !value && placeholder }, { [size || ""]: size })}
          MenuProps={{
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            transformOrigin: { vertical: "top", horizontal: "right" },
            getContentAnchorEl: null,
            PaperProps: { style: { marginTop: "4px", ...styleDropdown } },
            disableScrollLock: true,
          }}
          inputProps={{
            ...remainProps.inputProps,
            itemID: itemID,
          }}
          fullWidth={fullWidth}
          {...remainProps}
        >
          {placeholder && (
            <MenuItem value="" disabled style={{ display: "none" }}>
              {placeholder}
            </MenuItem>
          )}
          {children}
        </MuiSelect>
        {helperText && error && (
          <FormHelperText classes={{ root: classes.helperTextRoot }}>{helperText}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
});

export default Select;
