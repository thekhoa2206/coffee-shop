import { makeStyles, TextField, TextFieldProps, Theme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { colorInk } from "theme/palette";

const useStyles = (props: TextFieldProps) =>
  makeStyles((theme: Theme) => ({
    root: {
      "& .MuiInputBase-root.Mui-error:not(.Mui-focused):hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.error.main,
      },
      "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.error.main,
      },
      "& .MuiInputBase-root": {
        height: props.style?.height || "100%",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderWidth: 1,
        },
        "&:not(.Mui-focused):hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(0, 0, 0, 0.23)",
        },
      },
      "& > .MuiOutlinedInput-adornedStart": {
        paddingLeft: "12px",
        "& svg": {
          marginRight: 4,
          color: "#A3A8AF",
        },
      },
      "& input": {
        height: props.style?.height === 36 ? "initial" : "100%",
        boxSizing: "border-box",
        color: colorInk.primary,
        padding: 12,
        "&::placeholder": {
          color: colorInk.base40,
          opacity: 1,
        },
      },
      "& .MuiOutlinedInput-notchedOutline": {
        top: 0,
        borderColor: "#D3D5D7",
        "& legend": {
          display: "none",
        },
      },
    },
  }));

const InputBase = React.forwardRef(
  (
    props: TextFieldProps & {
      height?: string | number;
      width?: string | number;
      isNumber?: boolean;
      min?: number;
      max?: number;
      allowFormat?: boolean;
      allowSyncVal?: boolean;
      allowDecimal?: boolean;
      onChangeNumber?: (value: string) => void;
    },
    ref
  ) => {
    const {
      value,
      allowDecimal,
      isNumber,
      onChange,
      onChangeNumber,
      min,
      max,
      allowFormat = false,
      allowSyncVal = true,
      ...remainProps
    } = props;
    const classes = useStyles(props)();
    const { height = "40px", width = "unset" } = props;
    const [valFormated, setValFormated] = useState<string>("");

    const convertNumber = (value: string) => {
      var num = 0;
      if (value.length > 0) {
        num = parseFloat(value.replace(/[,]/g, ""));
      }
      return num;
    };

    const handleChange = (event: any, callBack?: (event?: any) => void) => {
      let _e = { ...event };
      let val = event.target.value?.toString() || "";

      if (isNumber) {
        //clear
        if (val.length === 0) {
          setValFormated("");
          _e.target.value = "";
          callBack && callBack(_e);
          return;
        }

        //validate
        let reg = allowDecimal ? /^[0-9][0-9 -,.]*$/ : /^[0-9][0-9 -,]*$/;
        if (!reg.test(val)) {
          return;
        }
        if (allowDecimal && val.lastIndexOf(".") > 0 && val.length - val.lastIndexOf(".") > 4) {
          return;
        }

        let num = convertNumber(val);
        if (min !== undefined && num < min) {
          return;
        } else if (max !== undefined && num > max) {
          return;
        }

        //change
        _e.target.value = num;
        callBack && callBack(_e);

        if (allowDecimal && val && val.endsWith(".")) {
          setValFormated(val);
        } else {
          val = allowFormat ? new Intl.NumberFormat("en-US").format(num).toString() : num;
          setValFormated(val);
        }
      } else {
        callBack && callBack(event);
      }
    };

    useEffect(() => {
      //sync value
      if (allowSyncVal) {
        handleChange({
          target: {
            value: value,
          },
        });
      }
    }, [value]);

    let localVal = value !== null && value !== undefined ? value : "";
    if (isNumber) {
      localVal = valFormated;
    }

    return (
      <TextField
        style={{ height: height, width: width }}
        variant="outlined"
        classes={{ root: classes.root }}
        ref={ref as any}
        onChange={(e) => handleChange(e, onChange)}
        {...remainProps}
        value={localVal}
      />
    );
  }
);

export default InputBase;
