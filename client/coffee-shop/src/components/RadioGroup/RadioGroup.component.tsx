import {
  FormControl,
  FormControlProps,
  FormLabel,
  makeStyles,
  RadioGroup as MuiRadioGroup,
  RadioGroupProps,
  Theme,
} from "@material-ui/core";
import React, { memo } from "react";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& .MuiFormControlLabel-root": {
      margin: "1px 0 3px",
    },
  },
  inputLabelRoot: {
    color: "#182537",
    paddingBottom: 6,
    "&.Mui-focused": {
      color: "#182537",
    },
  },
  helperTextRoot: {
    fontSize: 12,
    paddingLeft: 12,
  },
}));

const RadioGroup = memo(
  React.forwardRef(
    (props: RadioGroupProps & FormControlProps & { label?: string; stylelabel?: React.CSSProperties }, ref) => {
      const { label, style, id, fullWidth, stylelabel, ...remainProps } = props;
      const classes = useStyles();
      let idInput = id ? id : uuidv4();

      return (
        <FormControl classes={{ root: classes.root }} style={style} fullWidth={fullWidth} component="fieldset">
          {label && (
            <FormLabel component="legend" className={classes.inputLabelRoot} style={stylelabel}>
              {label}
            </FormLabel>
          )}
          <MuiRadioGroup id={idInput} ref={ref} {...remainProps} />
        </FormControl>
      );
    }
  )
);

RadioGroup.displayName = "RadioGroup";
export default RadioGroup;
