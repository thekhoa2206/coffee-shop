import { CustomerResponse } from "services/OrdersService";
import { StoreContext } from "store/StoreContext/types";

export type DialogAddCustomerProps = {
    id?: string;
    open: boolean;
    onClose: () => void;
    customer?: CustomerResponse;
    initData?: (customer?: CustomerResponse) => void;
    storeContext?: StoreContext;
  }