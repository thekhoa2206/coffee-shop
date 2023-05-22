import React, { Fragment, useEffect, useRef, useState } from "react";

import Popper from "components/Popper/PopperBase";

import { Box, makeStyles, Theme } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import FilterFixedV2, { FilterFixedV2Props } from "components/FilterFixed/FilterFixedV2";
import QuickFilterButton from "components/QuickFilter/QuickFilterButton";
import Button from "components/Button";

const useStyles = makeStyles((theme: Theme) => ({
  rootPopover: {
    padding: 12,
    "& > div": {
      padding: 0,
      margin: 0,
    },
  },
}));

interface QuickFilterFixedV2Props<T> extends FilterFixedV2Props<T> {
  label: string;
  handleSubmit: (value: T | T[] | null | undefined) => void;
  widthPopper?: string | number;
}

function QuickFilterFixedV2<T>(props: QuickFilterFixedV2Props<T>) {
  const { t } = useTranslation(["component"]);
  const { label, handleSubmit, widthPopper = 250, ...remainProps } = props;
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
          setValues(props.value);
        }}
      >
        <Box className={classes.rootPopover}>
          <FilterFixedV2
            {...remainProps}
            value={values}
            onChange={(value) => {
              setValues(value);
            }}
          />
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
            {`${t("component:filter.filterBtnText")}`}
          </Button>
        </Box>
      </Popper>
    </Fragment>
  );
}

export default QuickFilterFixedV2;
