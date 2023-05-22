import { WithStyles } from "@material-ui/styles";
import styles from "./HeaderAction.styles";
export interface HeaderActionProps extends WithStyles<typeof styles> {
  groupAction?: React.ReactNode;
  title?: string;
  linkTo?: string;
  onClick?: () => void;
  maxWidthContent?: string | number;
}
export default HeaderActionProps;
