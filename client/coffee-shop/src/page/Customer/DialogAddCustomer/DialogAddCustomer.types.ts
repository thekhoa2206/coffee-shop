import { CustomerResponse } from "services/CustomerService";



export type DialogAddCustomerProps = {
    id?: string;
    open: boolean;
    onClose: () => void;
    customer?: CustomerResponse;
    initData?: (customer?: CustomerResponse) => void;
  }