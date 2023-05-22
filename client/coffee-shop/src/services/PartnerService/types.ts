import { CustomerResponse } from "services/OrdersService/types";
import { Metadata } from "services/types";

export type PartnerFilterRequest ={
  ids?:  number[];
  query?: string;
  page: number;
  limit: number;
  status?: string;
  created_on_min?: string;
  created_on_max?: string;
  store_id?: number;
}

export type ListPartnerResponse = {
  partnerResponses: CustomerResponse[];
  metadata?: Metadata;
}