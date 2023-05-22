import { Chip as MuiChip, ChipProps as MuiChipProps, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import styles from "./Chip.styles";

interface ChipProps extends WithStyles<typeof styles> {
  type?: string;
}


const Chip = withStyles(styles)((props: ChipProps & MuiChipProps) => {
  const { type, ...remainProps } = props;

  return <MuiChip className={type} {...remainProps} />;
});

Chip.displayName = "Chip";
export default Chip;
