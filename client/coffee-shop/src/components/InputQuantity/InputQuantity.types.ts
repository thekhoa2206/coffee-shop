export interface InputQuantityProps {
  onChange: (value: number) => void;
  max: number;
  value: number;
  decimalScale?: number;
  decimalSeparator?: boolean;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  autoHidden?: boolean;
  disabled?: boolean;
  styleInput?: React.CSSProperties;
}
