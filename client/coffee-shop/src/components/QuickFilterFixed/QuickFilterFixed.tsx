import React, { Fragment, useEffect, useRef, useState } from "react";

import Popper from "components/Popper/PopperBase";

import { Box, makeStyles, Theme } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import FilterFixed, { FilterFixedProps } from "components/FilterFixed/FilterFixed";
import QuickFilterButton from "components/QuickFilter/QuickFilterButton";
import Button from "components/Button";

const useStyles = makeStyles((theme: Theme) => ({
  rootPopover: {
    padding: 12,
    "& > div": {
      padding: 0,
      margin: "0 -5px",
    },
  },
  isFileMission: {
    maxHeight: 400,
    overFlowY: "auto",
  },
}));

interface QuickFilterFixedProps<T> extends FilterFixedProps<T> {
  label: string;
  handleSubmit: (value: T | T[] | null | undefined) => void;
  widthPopper?: string | number;
  isFileMission?: boolean;
}

function QuickFilterFixed<T>(props: QuickFilterFixedProps<T>) {
  const { t } = useTranslation(["component"]);
  const { label, handleSubmit, isFileMission, widthPopper = 250, ...remainProps } = props;
  const [open, setOpen] = useState(false);
  const refPopper = useRef(null);
  const classes = useStyles();
  const [values, setValues] = useState<any>(props.value);

  useEffect(() => {
    setValues(props.value);
  }, [props.value]);

  return (
    <Fragment>
      <QuickFilterButton
        ref={refPopper}
        active={open}
        onClick={() => {
          setOpen(!open);
        }}
      >
        {label}
      </QuickFilterButton>
      <Popper
        referenceElement={refPopper.current}
        width={widthPopper}
        open={open}
        ignoreEventCloseInRootRef={true}
        onClose={() => {
          setOpen(false);
        }}
        style={isFileMission ? { maxHeight: 400, overflowY: "auto" } : {}}
      >
        <Box className={classes.rootPopover}>
          <FilterFixed
            {...remainProps}
            onChange={(value) => {
              setValues(value);
            }}
          />
          {isFileMission ? (
            <Button
              size="small"
              color="primary"
              variant="contained"
              style={{ width: "100%", position: "sticky", bottom: 5 }}
              onClick={() => {
                handleSubmit(values);
                setOpen(false);
              }}
            >
              {`Lọc`}
            </Button>
          ) : (
            <Button
              size="small"
              color="primary"
              variant="contained"
              style={{ width: "100%", marginTop: 16 }}
              onClick={() => {
                handleSubmit(values);
                setOpen(false);
              }}
            >
              {`Lọc`}
            </Button>
          )}
        </Box>
      </Popper>
    </Fragment>
  );
}

export default QuickFilterFixed;
