import { BaseFilterFixedModel } from "components/FilterFixed/FilterFixed";
import { BaseFilter, Metadata } from "../types";

export type StoreResponse = {
  id: number;
  districtId: number;
  wardId: number;
  cityId: number;
  address?: string;
  phoneNumber?: string;
  email?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  districtName?: string;
  wardName?: string;
  cityName?: string;
  totalRevenue?: number;
  totalShipFee?: number;
  label?: string;
};
export type ListStoreResponse = {
  stores: StoreResponse[];
  metadata?: Metadata;
}
export type CityResponse = {
  id: number;
  name?: string;
  number?: string;
  alias?: string;
  nameTransliteration: string;
  active: boolean;
  bigCity: boolean
};

export type DistrictResponse = {
  id: number;
  name: string;
  cityId: number;
  number: number;
  alias: string;
  nameTransliteration: string;
};

export type WardResponse = {
  id: number;
  name: string;
  cityId: number;
  districtId: number;
  nameTransliteration: string;
  status: string;
};

export type ListCityResponse = {
  city: CityResponse[];
  metadata: Metadata;
};

export type ListDistrictResponse = {
  district: DistrictResponse[];
  metadata: Metadata;
};

export type ListWardResponse = {
  ward: WardResponse[];
  metadata: Metadata;
};

export type DistrictRequestFilter={
  city_id?: number | null;
  name?: string;
  ids?: string;
}

export type StoreFilterRequest ={
  statuses?: string;
  limit?: number;
  page?: number;
  query?: string;
  created_on_max?: string;
  created_on_min?: string;
  ids?: string;
}

export interface StoresFilterRequest extends BaseFilter {
  statuses?: string;
  created_on_predefined?: string;
}
