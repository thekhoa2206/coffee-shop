import { CustomerResponse } from "services/PartnerService";


export type DialogAddCustomerProps = {
    id?: string;
    open: boolean;
    onClose: () => void;
    customer?: CustomerResponse;
    initData?: (customer?: CustomerResponse) => void;
  }