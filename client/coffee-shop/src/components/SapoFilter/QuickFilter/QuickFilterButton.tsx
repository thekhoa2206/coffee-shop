import { Button, ButtonProps, makeStyles, Theme } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { colorBlue } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "&.active": {
      borderColor: `${theme.palette.primary.main} !important`,
      "& .MuiButton-endIcon": {
        color: theme.palette.primary.main,
      },
    },
    "& .MuiButton-endIcon": {
      marginLeft: 12,
      marginRight: 0,
      "&>svg": {
        width: 24,
        height: 24,
      },
    },
  },
}));
export interface QuickFilterButtonProps extends ButtonProps {
  active?: boolean;
}
const QuickFilterButton = React.forwardRef((props: QuickFilterButtonProps, ref) => {
  const { active, ...remainProps } = props;
  let tempRef = useRef<HTMLButtonElement>(null);
  const classes = useStyles();

  useEffect(() => {
    let currentElement = (ref as React.RefObject<HTMLButtonElement>)?.current || tempRef?.current;
    if (active) {
      if (currentElement) {
        let nextElement = currentElement.nextElementSibling as HTMLElement;

        if (nextElement) {
          let indexLoop = 0;
          while (indexLoop < 2 && nextElement !== null && !nextElement.className.includes("MuiButtonGroup-grouped")) {
            nextElement = nextElement.nextElementSibling as HTMLElement;
            indexLoop++;
          }
        }

        if (nextElement) nextElement.style.borderLeftColor = `${colorBlue.primary.main}`;
        currentElement.classList.add("active");
      }
    } else {
      if (currentElement) {
        let nextElement = currentElement.nextElementSibling as HTMLElement;
        if (nextElement) {
          let indexLoop = 0;
          while (indexLoop < 2 && nextElement !== null && !nextElement.className.includes("MuiButtonGroup-grouped")) {
            nextElement = nextElement.nextElementSibling as HTMLElement;
            indexLoop++;
          }
        }
        if (nextElement) nextElement.style.borderLeftColor = "";
        currentElement.classList.remove("active");
      }
    }
  }, [active]);

  return (
    <Button
      className="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButtonGroup-grouped MuiButtonGroup-groupedHorizontal
      MuiButtonGroup-groupedOutlined MuiButtonGroup-groupedOutlinedHorizontal MuiButtonGroup-groupedOutlined"
      ref={(ref as any) || tempRef}
      endIcon={<ArrowDropDownIcon />}
      classes={{ root: classes.root }}
      {...remainProps}
    />
  );
});

export default QuickFilterButton;
