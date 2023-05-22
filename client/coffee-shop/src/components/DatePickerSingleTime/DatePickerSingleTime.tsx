import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import TextField from "components/TextField/TextFieldWithForwardRef";
import useStyles from "./DatePickerSingleTime.styles";
import clsx from "clsx";
import PopperBase from "components/Popper/PopperBase";
import DatePicker from "components/DateRangePicker/components/DatePicker/DatePicker.component";
import moment from "moment";
import { Box, IconButton, InputAdornment } from "@material-ui/core";
import Button from "components/Button";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import CalendarIcon from "components/SVG/CalendarIcon";

interface DatePickerSingleTimeProps {
  label?: string;
  value?: Date | null;
  onChange: (value: Date | null) => void;
  disable?: boolean;
  disablePortal?: boolean;
}

const DatePickerSingleTime = (props: DatePickerSingleTimeProps) => {
  const { label, value, onChange, disable, disablePortal } = props;
  const classes = useStyles();
  const [openPopper, setOpenPopper] = useState(false);
  const refTextField = useRef(null);
  const [date, setDate] = useState<Date | null>(value || null);
  const [inputValue, setInputValue] = useState("");
  const refWrapperSelectTime = useRef<HTMLDivElement>(null);
  const [timeSelect, setTimeSelect] = useState("");
  const times = useMemo(() => {
    let times: any[] = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 2; j++) {
        if (j === 0) {
          times.push(`${("0" + i).slice(-2)}:00`);
        } else {
          times.push(`${("0" + i).slice(-2)}:30`);
        }
      }
    }
    return times;
  }, []);

  useEffect(() => {
    if (date?.getTime() !== value?.getTime() || (value === null && date !== null)) {
      onChange(date);
    }
  }, [date]);

  useEffect(() => {
    if (value) {
      setInputValue(moment(value).format("DD/MM/YYYY HH:mm"));
      setDate(value);
    } else {
      setInputValue("");
      setDate(null);
    }
  }, [value]);

  useEffect(() => {
    if (openPopper && date) {
      scrollTimeIntoView(moment(date).format("HH:mm"));
    } else if (openPopper && !date) {
      let date = moment(moment().format("DD/MM/YYYY HH:mm"), "DD/MM/YYYY HH:mm").toDate();
      scrollTimeIntoView(moment(date).format("HH:mm"));
      setInputValue(moment(date).format("DD/MM/YYYY HH:mm"));
      setDate(date);
    }
    if (!openPopper) {
      setTimeSelect("");
    }
  }, [openPopper]);

  const handleClickButtonScroll = (type: "up" | "down") => {
    if (refWrapperSelectTime.current) {
      if (type === "down") {
        refWrapperSelectTime.current.scrollTop = refWrapperSelectTime.current.scrollTop + 44;
      } else {
        refWrapperSelectTime.current.scrollTop = refWrapperSelectTime.current.scrollTop - 44;
      }
    }
  };

  const checkActiveTime = (item: string) => {
    if (date && timeSelect === "") {
      let time = moment(date).format("HH:mm");
      let timeArr = time.split(":");
      if (timeArr[0] === item.split(":")[0]) {
        if (Number(item.split(":")[1]) === 30 && Number(timeArr[1]) >= 15) {
          return true;
        } else if (Number(item.split(":")[1]) === 0 && Number(timeArr[1]) < 15) {
          return true;
        }
      }
    }
    return false;
  };

  const scrollTimeIntoView = (currentTime: string) => {
    for (let i = 0; i < times.length; i++) {
      let item = times[i];
      let timeArr = currentTime.split(":");
      if (timeArr[0] === item.split(":")[0]) {
        let wrapper = document.getElementById("select-time-custom");
        if (Number(item.split(":")[1]) === 30 && Number(timeArr[1]) >= 15) {
          wrapper?.getElementsByClassName(item)?.[0].scrollIntoView();
        } else if (Number(item.split(":")[1]) === 0 && Number(timeArr[1]) < 15) {
          wrapper?.getElementsByClassName(item)?.[0].scrollIntoView();
        }
      }
    }
  };

  const handleBlurInput = () => {
    if (inputValue === "" && date) {
      setDate(null);
    } else {
      let isValidDate = true;
      let regexCheckDate = /^([1-9]|([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/\d\d\d\d [012]{0,1}[0-9]:[0-6][0-9]$/;
      if (regexCheckDate.test(inputValue.trim())) {
        let date = moment(inputValue.trim(), "DD/MM/YYYY HH:mm");
        if (date.isValid()) {
          setDate(date.toDate());
        } else {
          isValidDate = false;
        }
      } else {
        isValidDate = false;
      }
      if (!isValidDate) {
        if (date) {
          setInputValue(moment(date).format("DD/MM/YYYY HH:mm"));
        } else {
          setInputValue("");
        }
      }
    }
  };

  return (
    <Fragment>
      <TextField
        className={clsx(classes.textField)}
        fullWidth
        label={label}
        ref={refTextField}
        onClick={() => (disable ? setOpenPopper(false) : setOpenPopper(true))}
        value={inputValue}
        onBlur={handleBlurInput}
        disabled={disable}
        onChange={(event: any) => {
          setInputValue(event.target.value);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <CalendarIcon style={{ marginRight: 4, cursor: "pointer" }} />
            </InputAdornment>
          ),
        }}
      />
      <PopperBase
        referenceElement={refTextField.current}
        open={openPopper}
        onClose={() => setOpenPopper(false)}
        width={425}
        placement="bottom-end"
        disablePortal={disablePortal}
      >
        <Box className={classes.wrapperDateTimePicker}>
          <DatePicker
            variant="static"
            onChange={(value) => {
              if (value) {
                let currentTime = timeSelect ? timeSelect : moment().format("HH:mm");
                let dateSelect = moment(value).format("YYYY-MM-DD");
                let dateTime = moment(dateSelect + " " + currentTime).toDate();
                setTimeSelect("");
                setDate(dateTime);
                setInputValue(dateTime ? moment(dateTime).format("DD/MM/YYYY HH:mm") : "");
                scrollTimeIntoView(currentTime);
              } else {
                setDate(null);
                setInputValue("");
              }
            }}
            value={date}
          />
          <Box className={classes.wrapperSelectTimes}>
            <IconButton
              className={classes.buttonScrollTimes}
              onClick={() => handleClickButtonScroll("up")}
              style={{ marginBottom: 16 }}
            >
              <KeyboardArrowUpIcon />
            </IconButton>
            <div className={classes.selectTimes} ref={refWrapperSelectTime} id="select-time-custom">
              {times.map((item, index) => (
                <Button
                  key={index}
                  className={clsx(
                    classes.timeButtonItem,
                    timeSelect === item || checkActiveTime(item) ? classes.activeTime : "",
                    item
                  )}
                  onClick={() => {
                    setTimeSelect(item);
                    let newDate = !date ? moment().format("YYYY-MM-DD") : moment(date).format("YYYY-MM-DD");
                    setDate(moment(newDate + " " + item).toDate());
                    setInputValue(moment(newDate + " " + item).format("DD/MM/YYYY HH:mm"));
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
            <IconButton
              className={classes.buttonScrollTimes}
              onClick={() => handleClickButtonScroll("down")}
              style={{ marginTop: 16 }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>
        </Box>
      </PopperBase>
    </Fragment>
  );
};

export default DatePickerSingleTime;
