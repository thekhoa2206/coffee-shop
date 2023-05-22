import SapoGrid from "components/SapoGrid/SapoGrid";
import { ReactNode } from "react";
import { GridColumnVariant } from "components/SapoGrid/GridColumn/GridColumn.type";

export interface SapoGridProps {
  children?: ReactNode;
  style?: React.CSSProperties;
  data: DataResult;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  disablePaging?: boolean;
  sortable?: boolean;
  sort?: SortDescriptor | null;
  selectedItems?: any[];
  pageable?: boolean;
  selectable?: boolean;
  selectBy?: string;
  shortPagination?: boolean;
  stickyHeader?: boolean;
  borderCell?: boolean;
  isMenuCollapse?: boolean;
  stickyHeaderTop?: number;
  onPageChange?: (event: GridPageChangeEvent) => void;
  onSortChange?: (event: GridSortChangeEvent) => void;
  onSelectionChange?: (event: GridSelectionChangeEvent) => void;
  onDataStateChange?: (event: GridDataStateChangeEvent) => void;
  onRowClick?: (event: any, data: any) => void;
  nameObjectSelected?: string;
  settingColumns?: Record<string, boolean>;
  toogleSettings?: () => void;
  tableDrillDown?: boolean;
  onMouseRowEnter?: (e: any, data: any, fieldHover: string) => void;
  onMouseRowLeave?: (e: any, data: any, fieldHover: string) => void;
  disablePageSizeChange?: boolean;
  withRowCountInSettingColumn?: (rowData: any) => JSX.Element;
  fixTopTableRow?: () => JSX.Element;
  staticScrollBar?: boolean;
}

export interface DataResult {
  data: any[];
  total: number;
}

export interface DataKey {
  type: string;
  title: string;
  value: string;
}

export interface BaseEvent<T> {
  syntheticEvent: React.SyntheticEvent<any>;
  nativeEvent: any;
  target: T;
}

export interface GridEvent extends BaseEvent<typeof SapoGrid> {}

export interface GridSortChangeEvent extends GridEvent {
  sort: SortDescriptor;
}

export interface GridDataStateChangeEvent extends GridEvent {
  dataState: GridState;
}

export interface GridSelectionChangeEvent extends GridEvent {
  dataItems: any;
}

export interface GridPageChangeEvent extends GridEvent {
  page: Page;
}

export interface Page {
  page: number;
  pageSize: number;
}

export interface SortDescriptor {
  field: string;
  dir?: SortDirection;
}

export interface GridState {
  page: number;
  pageSize: number;
  sort?: SortDescriptor | null;
}

export type SortDirection = "asc" | "desc";

export interface HeadCell {
  disablePadding: boolean;
  property: string;
  label: string;
  align: "right" | "left" | "center";
  width?: number;
  sortable?: boolean;
  template?: React.ComponentType<CellTemplateProps>;
  component?: React.ReactNode;
  style?: React.CSSProperties;
  colStyle?: React.CSSProperties;
  classname?: string;
  display?: boolean;
  disableTooltip?: boolean;
  variant?: GridColumnVariant;
  subCells?: HeadCell[];
}

export interface CellTemplateProps {
  dataItem: any;
  context?: any;
}

export interface CellTemplateDrillDownProps {
  dataItem: any;
  open: boolean;
  setOpen: (value: boolean) => void;
  setLoadingDrillDown: React.Dispatch<React.SetStateAction<boolean>>;
  loadingDrillDown: boolean;
  context: any;
}

export default SapoGridProps;
