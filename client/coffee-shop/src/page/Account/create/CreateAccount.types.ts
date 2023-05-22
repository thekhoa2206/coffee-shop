import { WithStyles } from "@material-ui/core";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./CreateAccount.styles";

export interface CreateAccountProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
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