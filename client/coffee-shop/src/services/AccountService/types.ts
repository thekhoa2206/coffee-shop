import { BaseFilterFixedModel } from "components/FilterFixed/FilterFixed";
import { BaseFilter, Metadata } from "../types";

export type UserResponse = {
  id: number;
  username: string;
  name?: string;
  phoneNumber?: string;
  password?: string;
  email?: string;
  dob?: string;
  status?: string;
  roleResponses?: RolesResponse[];
  createdOn?: string;
  createdBy?: string;
  modifiedOn?: string;
  modifiedBy?: string;
  authorities: string[];
};
export type RolesResponse = {
  id: number;
  code: string;
  createdOn?: string;
  createdBy?: string;
  modifiedOn?: string;
  modifiedBy?: string;
  name: string;
  status: string;
}
export type ListUserResponse = {
  account_response: UserResponse[];
  metadata: Metadata;
}
export type FormLogin = {
  username?: string;
  password?: string;
}

export type JwtResponse = {
  token?: string;
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
  ) { }
}
export type AccountFilterModel = {
  status?: string;
  created_on_max?: Date | null;
  created_on_min?: Date | null;
  created_on_predefined?: string;
};
export type AccountFilter = {
  ids?: number[];
  query?: string;
  page: number;
  limit: number;
  status?: string;
  location_ids?: number[];
  created_on_min?: string;
  created_on_max?: string;
  typeAccount?: string;
};


export type AccountRequest = {
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