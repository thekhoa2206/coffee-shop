import { Metadata } from "services/types";

export type CustomerFilterRequest ={
  ids?:  number[];
  query?: string;
  page?: number;
  limit?: number;
  statuses?: string;
}

export type ListCustomerResponse = {
    data?: CustomerResponse[];
    metadata?: Metadata;
}

export type CustomerRequest = {
  name?: string;
  phoneNumber?: string;
  dob?: Date;
  sex?: string;
}

export type CustomerResponse = {
  createdBy?: number;
  createdOn?: Date;
  dob?: Date;
  id?: number;
  modifiedBy?: number;
  modifiedOn?: Date;
  name?: string;
  phoneNumber?: string;
  sex?: string;
  status?: string;
}