import { Metadata } from "../types";

export type CityResponse = {
  id: number;
  name: string;
  regional_id?: number;
  alias: string;
  country_id?: number;
  number: number;
  active: boolean;
  big_city?: boolean;
};

export type DistrictResponse = {
  id: number;
  name: string;
  number: number;
  city_id: number;
  alias: string;
};

export type WardResponse = {
  id: number;
  name: string;
  city: string;
  city_id: number;
  district: string;
  district_id: number;
};

export type ListCityDistrict = {
  metadata: Metadata;
  cityDistricts: Array<CityDistrict>;
};

export type CityDistrict = {
  id: string;
  district_id: number;
  city_id: number;
  city_name: string;
  district_name: string;
};

export type ListCityResponse = {
  metadata: Metadata;
  city: Array<CityResponse>;
};

export type ListDistrictResponse = {
  metadata: Metadata;
  districts: Array<DistrictResponse>;
};

export type ListWardResponse = {
  metadata: Metadata;
  wards: Array<WardResponse>;
};
export type Address = {
  id?: number;
  tenant_id?: number;
  created_on?: Date;
  modified_on?: Date;
  partner_id?: number;
  subject_id?: number;
  country?: string | null;
  city?: string | null;
  status?: string;
  district?: string | null;
  address1: string;
  address2?: string | null;
  zip_code?: string | null;
  email?: string | null;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  label?: string | null;
  phone_number?: string | null;
  ward?: string | null;
  full_address?: string | null;
};

export type IDistrictFilter = {
  ids?: Array<Number>;
  query?: string;
  limit?: number;
  page?: number;
  city_id?: number;
  country_id?: number;
};
