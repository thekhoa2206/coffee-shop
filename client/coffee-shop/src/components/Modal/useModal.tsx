import React from "react";
import { ModalContext, ModalState } from "./ModalProvider";

export default (): ModalState => {
  const { openModal, closeModal, dismissModal, confirm, modalStack } = React.useContext<ModalState>(ModalContext);

  return { openModal, closeModal, dismissModal, confirm, modalStack };
};
