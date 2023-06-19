import { CustomerResponse } from "services/CustomerService";
import { RoleResponse } from "services/types";



export type DialogAddRoleProps = {
    id?: string;
    open: boolean;
    onClose: () => void;
    role?: RoleResponse;
  }