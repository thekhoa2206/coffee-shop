import { ClickAwayListener, makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { isBoolean } from "lodash";
import React, { useEffect, useState, Fragment, useMemo, useRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";

const useStyles = makeStyles(() => ({
  root: {
    zIndex: 9999,
    "& #arrow": {
      position: "absolute",
      width: "10px",
      height: "10px",
      "&:after": {
        content: "''",
        backgroundColor: "white",
        boxShadow: "-1px -1px 3px rgb(0 0 0 / 10%)",
        position: "absolute",
        top: -4,
        left: 0,
        transform: " rotate(45deg)",
        width: 8,
        height: 8,
      },
    },
    "&[data-popper-placement^='top'] > #arrow": {
      bottom: -10,
      "&:after": {
        boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)",
      },
    },
  },
}));

export interface PopperBaseProps {
  open?: boolean;
  referenceElement?: any;
  children?: any;
  modifiers?: Array<object>;
  placement?: string;
  width?: string | number;
  disablePortal?: boolean;
  ignoreEventCloseInRootRef?: boolean;
  onClose?: () => void;
  style?: React.CSSProperties;
  arrow?: boolean;
}

const Popper = React.forwardRef((props: PopperBaseProps, ref) => {
  const [arrowRef, setArrowRef] = useState(null);
  const {
    open,
    referenceElement,
    children,
    width,
    disablePortal,
    ignoreEventCloseInRootRef = false,
    arrow,
    modifiers,
    placement = "bottom",
    onClose,
    style,
  } = props;
  // const popperElement = useRef(null);
  const [popperElement, setPopperElement] = useState(null);
  let modifiersDefault = [
    {
      name: "offset",
      options: {
        offset: [0, 5],
      },
    },
    {
      name: "flip",
      options: {
        allowedAutoPlacements: ["bottom"],
         altBoundary: true,
      },
    },
    {
      name: "preventOverflow",
      options: {
        mainAxis: false,
        //altAxis: true,
      },
    },
  ];

  let _modifiers = useMemo(() => {
    if (modifiers) {
      let _modifiersDefault = modifiersDefault.filter((item) => !modifiers.find((m: any) => m.name === item.name));
      return [..._modifiersDefault, ...modifiers];
    } else {
      return modifiersDefault;
    }
  }, [modifiers]);

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    placement: placement as any,
    modifiers: [
      ..._modifiers,
      {
        name: "arrow",
        options: {
          element: arrowRef,
        },
      },
    ],
  });
  useImperativeHandle(ref, () => ({
    update: update,
  }));
  const classes = useStyles();
  let widthPopper = width || (referenceElement as any)?.offsetWidth || 0;

  useEffect(() => {
    isBoolean(open);
  }, [open]);

  const renderPopper = () => (
    <ClickAwayListener
      onClickAway={(e) => {
        if (!referenceElement.contains(e.target as any) || !ignoreEventCloseInRootRef) {
          onClose?.();
        }
      }}
      mouseEvent="onMouseDown"
    >
      <Paper
        elevation={3}
        ref={setPopperElement}
        style={{ width: widthPopper, ...styles.popper, ...style }}
        {...attributes.popper}
        className={classes.root}
      >
        <Fragment>
          {arrow && <div ref={setArrowRef as any} style={styles.arrow} id="arrow" />}
          {children}
        </Fragment>
      </Paper>
    </ClickAwayListener>
  );

  if (open && disablePortal) {
    return renderPopper();
  } else if (open) {
    return createPortal(renderPopper(), document.querySelector("body") as any);
  } else {
    return <> </>;
  }
});

export default Popper;
