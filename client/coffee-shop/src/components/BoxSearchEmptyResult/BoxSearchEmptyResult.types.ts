import { WithStyles } from "@material-ui/core";
import styles from "./BoxSearchEmptyResult.styles";

export interface BoxSearchEmptyResultProps extends WithStyles<typeof styles> {
  label: React.ReactNode;
}
