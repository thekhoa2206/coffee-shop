export default interface GridColumnProps {
  field?: string;

  title?: string;

  width?: string | number;

  cellTemplate?: React.ComponentType<any>;

  sortable?: boolean;

  align?: "left" | "right" | "center";

  className?: string;

  style?: React.CSSProperties;

  rowSpan?: number;

  sticky?: "left";
}
