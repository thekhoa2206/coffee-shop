import React from "react";
import { ModalContext, ModalState } from "./ModalProvider";

const ModalStack = () => {
  const { modalStack } = React.useContext<ModalState>(ModalContext);
  return (
    <React.Fragment>
      {modalStack.map((modalInstance, index) => (
        <React.Fragment key={index}>{modalInstance.component}</React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default ModalStack;
