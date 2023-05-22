import { InputAdornment, InputBaseComponentProps, Paper, TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import { StyledProps } from "@material-ui/styles";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    input: {
      "& .MuiOutlinedInput-root": {
        "&:hover": {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D3D5D7 ",
          },
        },
        height: "36px",
      },
      "& .MuiOutlinedInput-input": {
        padding: "9.5px 14px 9.5px 0",
        color: colorInk.primary,
        "&::placeholder": {
          color: colorInk.base40,
          opacity: 1,
        },
      },
      "& .Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main + " !important",
        },
      },
      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderWidth: "1px",
      },
    },
  })
);

interface SearchBoxProps extends StyledProps {
  placeholder?: string;
  onChange?: (e: React.SyntheticEvent<HTMLElement>, value: any) => void;
  onSubmit?: (e: React.SyntheticEvent<HTMLElement>, value: any) => void;
  onBlur?: (value: string) => void;
  value?: string | null;
  removeable?: boolean;
  autoFocus?: boolean;
  inputProps?: InputBaseComponentProps;
}

const SearchBox = React.forwardRef<HTMLDivElement, SearchBoxProps>((props, ref) => {
  const classes = useStyles();
  const { placeholder = "", className, onChange, onSubmit, value, onBlur, removeable, autoFocus, inputProps } = props;
  const [_value, setValue] = useState<string>(value ? value : "");

  useEffect(() => {
    setValue(value ? value : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange) onChange(e, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e, _value);
  };

  const handleClickSearch = (e: React.MouseEvent<HTMLElement>) => {
    if (onSubmit) onSubmit(e, _value);
  };

  const handleClickRemove = (e: React.MouseEvent<HTMLElement>) => {
    if (onChange) onChange(e, "");
    else if (onSubmit) onSubmit(e, "");
  };

  return (
    <Paper component="form" className={clsx(classes.root, className)} onSubmit={handleSubmit}>
      <TextField
        className={classes.input}
        placeholder={placeholder}
        onChange={handleChange}
        value={_value}
        fullWidth
        ref={ref}
        autoFocus={autoFocus}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" onClick={handleClickSearch}>
              <SearchIcon htmlColor={colorInk.base40} style={{ width: "24px", height: "24px" }} />
            </InputAdornment>
          ),
          endAdornment: removeable && value && value.length > 0 && (
            <InputAdornment position="end" onClick={handleClickRemove}>
              <CancelIcon htmlColor={colorInk.base40} style={{ width: "24px", height: "24px", cursor: "pointer" }} />
            </InputAdornment>
          ),
        }}
        inputProps={inputProps}
        variant="outlined"
        onBlur={(e) => {
          if (onBlur) onBlur(e.target.value);
        }}
      />
    </Paper>
  );
});

export default SearchBox;
