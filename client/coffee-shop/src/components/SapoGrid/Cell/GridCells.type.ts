import { HeadCell } from "../SapoGrid.type";

export interface GridCellsProps {
  headCells: HeadCell[];
  row: any;
  onRowClick?: (e: any, data: any) => void;
  onMouseRowEnter?: (e: any, data: any, fieldHover: string) => void;
  onMouseRowLeave?: (e: any, data: any, fieldHover: string) => void;
  hasDrillDown?: boolean;
}
