import { WithStyles } from "@material-ui/core";
import { OrdersResponse } from "services/OrdersService";
import { AccountResponse } from "services/types";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./AccountDetail.styles";

export interface AccountDetailProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
    history: any;
}
export type AccountRole = {
    id: number;
    locationIds?: number[];
    roleId: number;
}
export type LocationResponse = {
    id: number;
    createdOn?: Date;
    modifiedOn?: Date;
    status?: string;
    address?: string;
    city: number;
    label: string;
    code: string;
}
export type ListLocationResponse = {
    locations: LocationResponse[];
}

export type DialogUpdatePaymentOrdersProps = {
    open: boolean;
    onClose: () => void;
    authState: AuthState;
    id?: number;
    initOrder: () => void;
    order?: OrdersResponse;
}

export type DialogDeleteAccountProps = {
    id?: string;
    open: boolean;
    onClose: () => void;
}

export type DialogUpdateAccountProps = {
    id?: string;
    open: boolean;
    onClose: () => void;
    account?: AccountResponse;
    initAccount: (account: AccountResponse) => void;
}

export type DialogChangePasswordProps = {
    id?: string;
    open: boolean;
    onClose: () => void;
    account?: AccountResponse;
}