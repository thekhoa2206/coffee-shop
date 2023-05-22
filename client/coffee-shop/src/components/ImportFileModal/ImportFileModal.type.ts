import { WithStyles } from "@material-ui/styles";
import React from "react";
import styles from "./ImportFileModal.styles";

export interface ImportFileModalProps extends WithStyles<typeof styles> {
  open: boolean;
  title: string;
  description: React.ReactElement;
  onClose: Function;
  onOk: Function;
  isComplete?: boolean;
  isLoading?: boolean;
  email?: string;
  isCustomTitle?: boolean
}

export interface FileModel {
  name: string;
  base64String: string;
}
