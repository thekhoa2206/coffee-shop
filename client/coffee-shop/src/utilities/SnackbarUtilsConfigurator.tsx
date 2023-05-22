import { useSnackbar, WithSnackbarProps } from "notistack";
import React from "react";
import { SnackbarErrorProp, SnackbarSuccessProp } from "./SnackbarProps";

interface IProps {
  setUseSnackbarRef: (showSnackbar: WithSnackbarProps) => void;
}
const InnerSnackbarUtilsConfigurator: React.FC<IProps> = (props: IProps) => {
  props.setUseSnackbarRef(useSnackbar());
  return null;
};

let useSnackbarRef: WithSnackbarProps;
const setUseSnackbarRef = (useSnackbarRefProp: WithSnackbarProps) => {
  useSnackbarRef = useSnackbarRefProp;
};

export const SnackbarUtilsConfigurator = () => {
  return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />;
};

const SnackbarUtils = {
  success(msg: string) {
    this.toast(msg, SnackbarSuccessProp);
  },
  error(msg: string, sound?: boolean) {
    this.toast(msg, SnackbarErrorProp);
    sound && new Audio(`${process.env.REACT_APP_CDN_URL}file/media/beep-warning.mp3?v=20220527`)?.play();
  },
  toast(msg: string, variant: any) {
    useSnackbarRef.enqueueSnackbar(msg, variant);
  },
};

export default SnackbarUtils;
