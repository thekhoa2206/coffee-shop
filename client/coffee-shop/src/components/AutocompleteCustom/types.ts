export interface BaseAutocompleteProps<T> {
  error?: boolean;
  open?: boolean;
  label?: string;
  value?: T | T[] | null;
  options?: T[];
  uniqKey?: string;
  debounce?: number;
  width?: number | string;
  placeholderInput?: string;
  disableCloseOnSelect?: boolean;
  loading?: boolean;
  paging?: boolean;
  placeholder?: string;
  clearInputBtn?: boolean;
  maxHeightListOption?: number | string;
  openOnFocus?: boolean;
  checkActivePagingBtn?: (type: "next" | "prev") => boolean;
  handlePagingChange?: (type: "next" | "prev") => void;
  onOpen?: () => void;
  onClose?: () => void;
  onBlur?: (value: T | T[] | null) => void;
  onRemoveTag?: (value: T | T[] | null) => void;
  getOptionLabel?: (options: T) => string;
  onChange?: (values: T | T[] | null) => void;
  onInputChange?: (inputValue: string) => void; // override event change => handle suggest outside component
  renderOption?: (item: T, isActive: boolean) => React.ReactNode;
  placementPopper?: string;
}

export interface SearchSuggestProps<T> extends BaseAutocompleteProps<T> {
  multiple?: boolean;
  showResult?: boolean;
  textButtonShowResult?: string;
  textSelectAll?: string;
  textNoOption?: string;
  optionSelectAll?: boolean;
  variant?: "default" | "inline";
  autoFocus?: boolean;
}

export interface TagSuggestProps<T> extends BaseAutocompleteProps<T> {}
