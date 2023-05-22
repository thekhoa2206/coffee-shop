import { Box, Button, withStyles, WithStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import styles from "./CustomSwitch.styles";
import clsx from "clsx";

export interface ButtonObj {
  name: string;
  value: any;
}

interface CustomSwitchProps extends WithStyles<typeof styles> {
  btnArr: ButtonObj[];
  defaultValue?: ButtonObj;
  onchange: (value: any) => void;
}

const CustmSwitch = (props: CustomSwitchProps) => {
  const { classes, btnArr, defaultValue, onchange } = props;
  useEffect(() => {
    if (defaultValue) setChooseItem(defaultValue);
  }, [defaultValue]);
  const [chooseItem, setChooseItem] = useState<ButtonObj>(defaultValue || btnArr[0]);
  return (
    <Box className={classes.root}>
      {React.Children.toArray(
        btnArr.map((item, index) => {
          return (
            <Button
              onClick={() => {
                setChooseItem(item);
                onchange(item);
              }}
              className={clsx(
                [classes.packageBtn],
                chooseItem.value === item.value ? classes.active : classes.inActive
              )}
              style={{ marginLeft: index > 0 ? "-10px" : "0px" }}
            >
              {item.name}
            </Button>
          );
        })
      )}
    </Box>
  );
};

export default withStyles(styles)(CustmSwitch);
