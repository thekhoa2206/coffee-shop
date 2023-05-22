import { OutlinedTextFieldProps, PopperProps, StandardProps } from "@material-ui/core";
import {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteClassKey,
  RenderInputParams,
  RenderOptionState,
} from "@material-ui/lab/Autocomplete";

export interface ComboBoxProps<T>
  extends StandardProps<
    React.HTMLAttributes<HTMLDivElement>,
    AutocompleteClassKey,
    "defaultValue" | "onChange" | "children"
  > {
  iconSearch?: boolean;
  placeholder?: string | undefined;
  textFieldProps?: OutlinedTextFieldProps;
  //override AutocompleteProps from "@material-ui/lab/Autocomplete"
  renderInput?: (params: RenderInputParams) => React.ReactNode;
  renderOption?: (option: T, state: RenderOptionState) => React.ReactNode;
  PopperComponent?: React.ComponentType<PopperProps>;
  PaperComponent?: React.ComponentType<React.HTMLAttributes<HTMLElement>>;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (
    event: React.ChangeEvent<{}>,
    value: T | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T>
  ) => void;
}
