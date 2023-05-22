import React, { ChangeEvent, useMemo, useState } from "react";
import { Box, IconButton, SvgIconProps } from "@material-ui/core";
import { PencilIcon } from "../../SVG";
import { IconButtonProps } from "@material-ui/core/IconButton";

interface TextFieldBlurProps {
  render: (props: {
    field: any & { value: any; onChange: React.ChangeEventHandler<HTMLTextAreaElement>; onBlur: () => void };
    fieldState: { setOpen: (open: boolean) => void };
  }) => React.ReactElement;
  style?: React.CSSProperties;
  className?: string;
  component?: {
    iconButtonProps?: IconButtonProps;
    iconProps?: SvgIconProps;
  };
  defaultValue?: unknown;
  fullWidth?: boolean;
}
const TextFieldBlur: React.FC<TextFieldBlurProps> = (props) => {
  const { render, children, style, className, defaultValue, fullWidth } = props;
  const [open, setOpen] = useState(false);
  const [valueState, setValueState] = useState<any>(defaultValue);
  const Element = useMemo(() => {
    return render({
      field: {
        onBlur: () => {
          setOpen(false);
        },
        onChange: (e: ChangeEvent<HTMLInputElement>) => setValueState(e?.target.value),
        value: valueState,
      },
      fieldState: {
        setOpen: setOpen,
      },
    });
  }, [defaultValue, valueState]);
  return (
    <Box
      width={fullWidth ? "100%" : undefined}
      display="flex"
      alignItems={"flex-start"}
      style={style}
      className={className}
    >
      {open ? Element : children}
      {!open && (
        <IconButton
          style={{ padding: 4, margin: "-4px -4px -4px 4px" }}
          onClick={() => {
            setValueState(defaultValue);
            setOpen(true);
          }}
          {...props.component?.iconButtonProps}
        >
          <PencilIcon style={{ fontSize: 15, color: "#A3A8AF" }} {...props.component?.iconProps} />
        </IconButton>
      )}
    </Box>
  );
};

export default TextFieldBlur;
