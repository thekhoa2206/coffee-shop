import React, { Fragment, useMemo } from "react";
import PopperJs, { ReferenceObject } from "popper.js";
import { PortalProps } from "@material-ui/core/Portal";
import { PopperPlacementType } from "@material-ui/core/Popper/Popper";
import Popper from "components/Popper";

export interface ImageZoomProps {
  src: string;
  width?: string;
  height?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  PopperProps?: {
    anchorEl?: null | ReferenceObject | (() => ReferenceObject);
    container?: PortalProps["container"];
    disablePortal?: PortalProps["disablePortal"];
    keepMounted?: boolean;
    modifiers?: object;
    placement?: PopperPlacementType;
    popperOptions?: object;
    popperRef?: React.Ref<PopperJs>;
    transition?: boolean;
    className?: string;
    style?: React.CSSProperties;
  };
  BiggerProps?: {
    src?: string;
    width?: string;
    height?: string;
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
  };
}

const ImageZoom = (props: ImageZoomProps) => {
  const { style, PopperProps, BiggerProps } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const getUrl = (src: string) => {
    if (
      (process.env.NODE_ENV === "development" && src.search(process.env.PUBLIC_URL) >= 0) ||
      src.search(process.env.PUBLIC_URL) < 0
    ) {
      return src;
    } else {
      let url = process.env.REACT_APP_CDN_URL;
      let newSrcIndex = src.search("static");
      if (newSrcIndex < 0) {
        return src;
      } else {
        return url + src.substring(newSrcIndex);
      }
    }
  };
  const src = useMemo(() => getUrl(props.src), [props.src]);

  return (
    <Fragment>
      <img
        className={props.className}
        src={src}
        width={props.width}
        height={props.height}
        alt={props.alt}
        style={style}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      />
      <Popper
        placement="left"
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        disablePortal={false}
        {...PopperProps}
      >
        <img src={src} alt={props.alt} {...BiggerProps} />
      </Popper>
    </Fragment>
  );
};

export default ImageZoom;
