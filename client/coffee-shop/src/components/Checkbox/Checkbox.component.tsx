import React, { memo } from "react";
import clsx from "clsx";
import { Checkbox as MuiCheckbox, CheckboxProps, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styles from "./Checkbox.style";


const Checkbox = memo(
  withStyles(styles)((props: CheckboxProps & WithStyles<typeof styles>) => {
    const { classes, ...remainProps } = props;
    return (
      <MuiCheckbox
        className={classes.root}
        checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
        indeterminateIcon={<span className={clsx(classes.icon, classes.indeterminateIcon)} />}
        icon={<span className={classes.icon} />}
        size="small"
        color="primary"
        {...remainProps}
        inputProps={{
          ...remainProps.inputProps,
          itemID: props.itemID,
        }}
      />
    );
  })
);

export default Checkbox;
