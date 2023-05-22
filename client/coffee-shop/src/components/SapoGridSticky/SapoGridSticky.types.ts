import { DataResult, GridDataStateChangeEvent, GridPageChangeEvent } from "components/SapoGrid/SapoGrid.type";

export interface SapoGridStickyProps {
  selectBy?: string;
  data: DataResult;
  maxHeight?: number;
  width?: number | string;
  settingColumns?: SettingColumns;
  size?: number;
  stickyHeader?: boolean;
  stickyHeaderTop?: number;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  disablePaging?: boolean;
  disablePageSizeChange?: boolean;
  onPageChange?: (event: GridPageChangeEvent) => void;
  onDataStateChange?: (event: GridDataStateChangeEvent) => void;
}

export type SettingColumns = Record<string, boolean> | null | undefined;
export interface HeadCell {
  property: string;
  label?: string;
  align?: "right" | "left" | "center";
  template?: React.ComponentType<CellTemplateProps>;
  style?: React.CSSProperties;
  classname?: string;
  childrens?: HeadCell[];
  width: number;
  rowSpan: number;
  sticky?: "left";
  type?: "rowSpan";
  display?: boolean;
}
export interface BodyCell {
  disablePadding: boolean;
  property: string;
  label: string;
  align: "right" | "left" | "center";
  width?: number;
  sortable?: boolean;
  template?: React.ComponentType<CellTemplateProps>;
  style?: React.CSSProperties;
  classname?: string;
  sticky?: "left";
  display?: boolean;
}
export interface CellTemplateProps {
  dataItem: any;
}

export default SapoGridStickyProps;
