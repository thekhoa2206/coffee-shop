import { HeadCell } from "../SapoGrid.type";

export interface SapoGridRowProps {
  isItemSelected?: boolean;
  settingColumns?: Record<string, boolean>;
  isSettingColumns?: boolean;
  drillDown?: any;
  headCells: HeadCell[];
  row: any;
  handleSelectionClick: (event: React.ChangeEvent<HTMLInputElement>, row: any) => void;
  onRowClick?: (e: any, data: any) => void;
  selectable?: boolean;
  withRowCountInSettingColumn?: (rowData: any) => JSX.Element;
  onMouseRowEnter?: (e: any, data: any, fieldHover: string) => void;
  onMouseRowLeave?: (e: any, data: any, fieldHover: string) => void;
}

export interface SapoGridRowV2Props {
  isItemSelected?: boolean;
  settingColumns?: Record<string, boolean>;
  isSettingColumns?: boolean;
  drillDown?: any;
  headCells: HeadCell[];
  row: any;
  handleSelectionClick: (event: React.ChangeEvent<HTMLInputElement>, row: any) => void;
  onRowClick?: (e: any, data: any) => void;
  selectable?: boolean;
  onMouseRowEnter?: (e: any, data: any, fieldHover: string) => void;
  onMouseRowLeave?: (e: any, data: any, fieldHover: string) => void;
  showSetting?: boolean;
  heightRowReport?: boolean;
}
