import { WithStyles } from "@material-ui/styles";
import styles from "./Popover.styles";

export interface UserOptionPopoverProp extends WithStyles<typeof styles> {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  children: JSX.Element | null;
  width?: number;
  height?: number;
  right?: number;
  onClose: () => void;
}
