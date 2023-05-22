import { HeadCell, SortDirection } from "../SapoGrid.type";
import useStyles from "./SapoGridHeader.style";

export interface SapoGridHeaderProps {
  headCells: HeadCell[];
  classes?: ReturnType<typeof useStyles>;
  sortable?: boolean;
  selectable?: boolean;
  nameObjectSelected?: string;
  onRequestSort: (event: React.SyntheticEvent<HTMLElement>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: SortDirection;
  orderBy: string;
  rowCount: number;
  toolbar?: any;
  settingable?: boolean;
  toogleSettings?: () => void;
  selectedItems?: any[];
  drillDown?: any;
}

export interface SapoGridToolbarProps {
  selectedItems?: any[];
}
