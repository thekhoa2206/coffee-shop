import React from "react";
import { Chip, Grid, WithStyles, withStyles } from "@material-ui/core";
import styles from "./ChipTag.style";
import ClearIcon from "@material-ui/icons/Clear";

interface ChipTagProps extends WithStyles<typeof styles> {
  onDelete: (value: string) => void;
  value?: string[];
}
const ChipTag = (props: ChipTagProps) => {
  const { classes, onDelete, value } = props;
  return (
    <Grid className={classes.root}>
      {React.Children.toArray(
        value?.map((item) => (
          <Chip
            label={item}
            onDelete={(e) => {
              onDelete(item);
            }}
            onClick={() => {}}
            className="chip-tag"
            deleteIcon={<ClearIcon />}
          />
        ))
      )}
    </Grid>
  );
};
export default withStyles(styles)(ChipTag);
