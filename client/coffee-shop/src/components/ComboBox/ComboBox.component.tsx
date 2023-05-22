import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { UseAutocompleteProps } from "@material-ui/lab/useAutocomplete";
import { makeStyles } from "@material-ui/styles";
import SearchIcon from "components/SVG/SearchIcon";
import React from "react";
import styles from "./ComboBox.styles";
import { ComboBoxProps } from "./ComboBox.types";

const useStyles = makeStyles(styles);

export default function ComboBox<T>(props: UseAutocompleteProps<T> & ComboBoxProps<T>) {
  const { iconSearch, placeholder, renderInput, classes, textFieldProps, ...remainProps } = props;
  const classesDefault = useStyles();

  return (
    <Autocomplete
      freeSolo
      selectOnFocus
      classes={{
        option: classesDefault.option,
        listbox: classesDefault.listbox,
        endAdornment: classesDefault.endAdornment,
        clearIndicator: classesDefault.clearIndicator,
        ...classes,
      }}
      renderInput={(params) => {
        if (renderInput) {
          return renderInput(params);
        }
        return (
          <TextField
            InputProps={{
              ref: params.InputProps.ref,
              startAdornment: iconSearch && (
                <InputAdornment position="start">
                  <SearchIcon className={classesDefault.searchIcon} />
                </InputAdornment>
              ),
              endAdornment: params.InputProps.endAdornment,
              placeholder: placeholder,
            }}
            id={params.id}
            inputProps={params.inputProps}
            disabled={params.disabled}
            label=""
            helperText=""
            variant="outlined"
            classes={{ root: classesDefault.textFieldRoot }}
            {...textFieldProps}
          />
        );
      }}
      {...remainProps}
    />
  );
}
