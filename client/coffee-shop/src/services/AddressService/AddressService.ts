import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { IDistrictFilter, ListCityResponse, ListDistrictResponse, ListWardResponse } from "./types";
class AddressService {
  static async getCities(): Promise<AxiosResponse<ListCityResponse>> {
    return axios.get(`/cities.json`, { ...getAxiosConfig() });
  }
  static async getDistricts(filter?: IDistrictFilter): Promise<AxiosResponse<ListDistrictResponse>> {
    return axios.get(`/districts.json`, { ...getAxiosConfig(), params: filter });
  }
  static async getWardsByDistrictId(districtId: number): Promise<AxiosResponse<ListWardResponse>> {
    return axios.get(`/districts/${districtId}/wards.json`, { ...getAxiosConfig() });
  }
  static async getCitiesByCountryId(countryId: number): Promise<AxiosResponse<ListCityResponse>> {
    return axios.get(`/countries/${countryId}/cities.json`, { ...getAxiosConfig() });
  }
}

export default AddressService;
