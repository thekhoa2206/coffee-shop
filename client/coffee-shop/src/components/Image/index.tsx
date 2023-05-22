import React from "react";

export interface ImageProps {
  src: string;
  width?: string;
  height?: string;
  alt?: string;
  className?: string;
  style?: object;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const { src, style } = props;
  const getUrl = () => {
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
  return (
    <img
      className={props.className}
      src={`${getUrl()}`}
      width={props.width}
      height={props.height}
      alt={props.alt}
      style={style}
      ref={ref}
    />
  );
});

export default Image;
