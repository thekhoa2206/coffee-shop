export default interface GridColumnProps {
  field?: string;

  title?: string;

  editable?: boolean;

  sortable?: boolean;

  width?: string | number;

  cellTemplate?: React.ComponentType<any>;

  component?: React.ReactNode;

  align?: "left" | "right" | "center";

  className?: string;

  style?: React.CSSProperties;

  disablePadding?: boolean;

  variant?: GridColumnVariant;

  disableTooltip?: boolean;

  colStyle?: React.CSSProperties;
}

export type GridColumnVariant = "column" | "group";
