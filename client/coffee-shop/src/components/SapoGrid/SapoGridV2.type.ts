import {
  DataResult,
  GridDataStateChangeEvent,
  GridPageChangeEvent,
  GridSelectionChangeEvent,
  GridSortChangeEvent,
  SortDescriptor,
} from "components/SapoGrid/SapoGrid.type";

export interface SapoGridV2Props {
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
  isMenuCollapse?: boolean;
  stickyHeaderTop?: number;
  onPageChange?: (event: GridPageChangeEvent) => void;
  onSortChange?: (event: GridSortChangeEvent) => void;
  onSelectionChange?: (event: GridSelectionChangeEvent) => void; // Phải truyền func là 1 useCallback tránh rerender lại hết các line
  onDataStateChange?: (event: GridDataStateChangeEvent) => void;
  onRowClick?: (event: any, data: any) => void;
  nameObjectSelected?: string;
  settingColumns?: Record<string, boolean>;
  toogleSettings?: () => void;
  tableDrillDown?: boolean;
  onMouseRowEnter?: (e: any, data: any, fieldHover: string) => void;
  onMouseRowLeave?: (e: any, data: any, fieldHover: string) => void;
  disablePageSizeChange?: boolean;
  context?: any /* dependency khiến cho cả bảng rerender thường dùng trong trường hợp dùng state ngoài trong gird column, nên hạn chế sử dụng */;
  headerVersion?: number;
  summary?: any;
  totalPage?: number;
  showSetting?: boolean;
  heightRowReport?: boolean;
}
