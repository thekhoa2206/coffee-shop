import { BaseFilterFixedModel } from "components/FilterFixed/FilterFixed";
import { BaseFilter, Metadata } from "../types";

export type AccountResponse = {
  id: number;
  username: string;
  firstName: number;
  lastName: string;
  fullName?: string;
  email?: string;
  accountOwner?: boolean;
  locationId?: number;
  avatarUrl?: number;
  phoneNo?: string;
  mobile?: string;
  description?: string;
  dob?: Date;
  website?: string;
  sex?: string;
  address?: string;
  status?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  roles?: RolesResponse[];
  authorities: string[];
  typeAccount?: string;
  totalDebt?: number;
};
export type RolesResponse = {
  accountId: number;
  code: string;
  createdOn: Date;
  locationId: number;
  modifiedOn: Date;
  name: string;
  roleId: number;
}
export type ListAccountResponse = {
  account_response: AccountResponse[];
  metadata: Metadata;
}
export type FormLogin = {
  username?: string;
  password?: string;
}

export type JwtResponse = {
  token?: string;
  type?: string;
}

export interface AccountFilterRequest extends BaseFilter {
  status?: string;
  created_on_predefined?: string;
}
export class AccountsFilter implements AccountFilterRequest {
  constructor(
    public query?: string,
    public page?: number,
    public limit?: number,
    public ids?: string,
    public status?: string,
    public created_on_predefined?: string,
  ) {}
}
export type AccountFilterModel = {
  status?: string;
  created_on_max?: Date | null;
  created_on_min?: Date | null;
  created_on_predefined?: string;
};
export type AccountFilter = {
  ids?:  number[];
  query?: string;
  page: number;
  limit: number;
  status?: string;
  location_ids?: number[];
  created_on_min?: string;
  created_on_max?: string;
  typeAccount?:string;
};


export type AccountRequest ={
  username?: string;
  email?: string;
  fullName?: string;
  password?: string;
  phoneNo?: string;
  description?: string;
  dob?: Date | null;
  website?: string;
  sex?: string;
  address?: string;
  locationId?: number;
  roleIds?: number[];
}

export type RoleResponse = {
  id: number;
  createOn: Date;
  modifiedon: Date;
  note: string;
  name: string;
  code: string;
}

export type ListRoleResponse = {
  roles: RoleResponse[];
}

export type AccountUpdateRequest = {
  username?: string;
  email?: string;
  fullName?: string;
  phoneNo?: string;
  description?: string;
  dob?: Date | null;
  sex?: string;
  address?: string;
}

export type AccountChangePassword = {
  password: string;
  passwordOld?: string;
}