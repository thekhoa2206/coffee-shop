import { Box, Button, makeStyles, Theme, Typography } from "@material-ui/core";
import React, { useRef } from "react";
import clsx from "clsx";
import CalendarIcon from "components/SVG/CalendarIcon";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    fontWeight: 400,
    border: "1px solid #D3D4D5",
    borderRadius: 3,
    width: "100%",
    justifyContent: "space-between",
    padding: "0 12px",
    minHeight: "40px",
    "&:hover": {
      backgroundColor: "transparent",
      ":not(.active)": {
        borderColor: "#7A8086",
      },
    },
    "& .MuiButton-endIcon": {
      "& svg": {
        color: "#A3A8AF",
      },
    },
    "&.focus, &.active": {
      borderColor: `${theme.palette.primary.main} !important`,
      "&.active": {
        "& .MuiButton-endIcon": {
          "& svg": {
            color: theme.palette.primary.main,
            // transform: "rotate(180deg)",
          },
        },
      },
    },
  },
}));

export interface QuickFilterButtonProps {
  active?: boolean;
  focus?: boolean;
  label?: string;
  placeholder?: string;
  onClick?: () => void;
  fillColorEndIcon?: string;
}

/**
 * @deprecated Use DatePickerPlus in @sapo-ui-components instead
 */
const ButtonFilterDatePredefined = React.forwardRef((props: QuickFilterButtonProps, ref) => {
  const { label, placeholder, active, focus, onClick } = props;
  let tempRef = useRef<HTMLButtonElement>(null);
  const classes = useStyles();

  return (
    <Box>
      {label && <Typography style={{ marginBottom: 4 }}>{label}</Typography>}
      <Button
        className={clsx(classes.root, { active: active, focus: focus })}
        ref={(ref as any) || tempRef}
        endIcon={<CalendarIcon style={{color: `${active ? props.fillColorEndIcon : null}`}}/>}
        onClick={onClick}
        disableElevation
        disableRipple
      >
        {placeholder}
      </Button>
    </Box>
  );
});

export default ButtonFilterDatePredefined;
