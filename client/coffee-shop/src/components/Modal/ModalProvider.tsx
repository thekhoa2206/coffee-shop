import React, { ComponentType, ReactNode, useCallback } from "react";
import Modal from "./ModalStack";
import ConfirmDialog, { ConfirmDialogProps } from "../Dialog/ConfirmDialog/ConfirmDialog";
import { LocalizeProvider } from 'react-localize-redux'

export interface ModalOptions {
  // TODO
}

export interface ModalInstance {
  component: ReactNode;
  options?: ModalOptions;
  resolve: any;
  reject: any;
}

export interface ModalRef {
  modalInstance: React.ReactElement;
  result: Promise<any>;
}

export interface ModalState {
  openModal: (content: ComponentType<any>, data?: any, options?: ModalOptions) => ModalRef;
  closeModal: (result?: any) => void;
  dismissModal: (reason?: any) => void;
  confirm: (options?: ConfirmDialogProps) => ModalRef;
  modalStack: ModalInstance[];
}

const initState = {} as ModalState;

const ModalContext = React.createContext<ModalState>(initState);
const { Provider } = ModalContext;

const ModalProvider = ({ children }: any) => {
  const [modalStack, setModalStack] = React.useState<ModalInstance[]>([]);

  const openModal = useCallback((content: ReactNode, data?: any, options?: ModalOptions): ModalRef => {
    const ContentComponent = content as ComponentType;
    let resolve: any;
    let reject: any;
    const resultPromise = new Promise((resolutionFunc, rejectFunc) => {
      resolve = resolutionFunc;
      reject = rejectFunc;
    });
    setModalStack((prev) =>
      prev.concat([
        {
          component: <ContentComponent {...data} />,
          options: options,
          resolve: resolve,
          reject: reject,
        },
      ])
    );
    return {
      modalInstance: <ContentComponent {...data} />,
      result: resultPromise,
    };
  }, []);

  const confirm = useCallback((options?: ConfirmDialogProps): ModalRef => {
    let resolve: any;
    let reject: any;
    const resultPromise = new Promise((resolutionFunc, rejectFunc) => {
      resolve = resolutionFunc;
      reject = rejectFunc;
    });
    setModalStack((prev) =>
      prev.concat([
        {
          component: <ConfirmDialog {...options} />,
          options: options,
          resolve: resolve,
          reject: reject,
        },
      ])
    );
    return {
      modalInstance: <ConfirmDialog {...options} />,
      result: resultPromise,
    };
  }, []);

  const closeModal = useCallback((result: any) => {
    setModalStack((prev) => {
      let _modalStack = [...prev];
      const instance = _modalStack.pop();
      instance?.resolve(result);
      return _modalStack;
    });
  }, []);

  const dismissModal = useCallback((reason: any) => {
    setModalStack((prev) => {
      let _modalStack = [...prev];
      const instance = _modalStack.pop();
      instance?.reject(reason);
      return _modalStack;
    });
  }, []);

  return (
    <Provider value={{ openModal, closeModal, dismissModal, confirm, modalStack }}>
      <LocalizeProvider>
        <Modal />
        {children}
      </LocalizeProvider>
    </Provider>
  );
};

export { ModalContext, ModalProvider };
