import { StoreResponse } from "services/StoreService";
import { StoreContext } from "store/StoreContext/types";

export type DetailStores = {};

export type DialogDeleteStoreProps = {
    open: boolean;
    onClose: () => void;
    id: string;
  }
export type DialogUpdateStoreProps = {
  open: boolean;
  onClose: () => void;
  id?: string;
  store?: StoreResponse;
  initData: () => void;
}