import { WithStyles } from "@material-ui/styles";
import styles from "./ActivateLoyaltyPromptModal.styles";

export interface ActivateLoyaltyPromptModalProps extends WithStyles<typeof styles> {
  open: boolean;
  onConfirm?: Function;
  onClose?: Function;
}
