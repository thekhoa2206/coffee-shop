import { WithStyles } from "@material-ui/styles";
import styles from "./Options.styles";

export interface OptionsProp extends WithStyles<typeof styles> {
  svg: JSX.Element;
  title: string;
}
