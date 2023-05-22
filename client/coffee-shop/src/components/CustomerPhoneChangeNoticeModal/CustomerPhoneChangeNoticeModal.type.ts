import { WithStyles } from "@material-ui/styles";
import styles from "./CustomerPhoneChangeNoticeModal.styles";

export interface CustomerPhoneChangeNoticeModalProps extends WithStyles<typeof styles> {
  open: boolean;
  onConfirm?: Function;
  onCancel?: Function;
}
