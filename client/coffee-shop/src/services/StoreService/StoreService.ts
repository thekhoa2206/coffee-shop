import axios, { AxiosResponse } from "axios";
import { CreateStoreRequest } from "page/Partner/createStore/CreateStore.types";
import { getAxiosConfig } from "../config";
import { DistrictRequestFilter, ListCityResponse, ListDistrictResponse, ListStoreResponse, ListWardResponse, StoreFilterRequest, StoreResponse } from "./types";

class AccountService {
    static async getStore(): Promise<AxiosResponse<{ store: StoreResponse }>> {
        return axios.get(`/stores`, { ...getAxiosConfig() });
    }
    static async getCites(): Promise<AxiosResponse<{ list_city: ListCityResponse }>> {
        return axios.get(`/areas/city`, { ...getAxiosConfig() });
    }
    static async getDistricts(filter: DistrictRequestFilter): Promise<AxiosResponse<{ list_district: ListDistrictResponse }>> {
        return axios.get(`/areas/district`, { ...getAxiosConfig(), params: filter });
    }
    static async getWards(id?: number): Promise<AxiosResponse<{ list_ward: ListWardResponse }>> {
        return axios.get(`/areas/ward`, { ...getAxiosConfig(), params: {districtId: id} });
    }
    static async getStoreById(id?: string): Promise<AxiosResponse<{ store: StoreResponse }>> {
        return axios.get(`/stores/${id}`, { ...getAxiosConfig() });
    }
    static async filter(filter?: StoreFilterRequest): Promise<AxiosResponse<{ list_store: ListStoreResponse }>> {
        return axios.get(`/stores/filter`, { ...getAxiosConfig(), params: filter });
    }
    static async create(request?: CreateStoreRequest): Promise<AxiosResponse<{ store: StoreResponse }>> {
        return axios.post(`/stores`,{...request}, { ...getAxiosConfig() });
    }
    static async update(request?: CreateStoreRequest, id?: string): Promise<AxiosResponse<{ store: StoreResponse }>> {
        return axios.put(`/stores/${id}`,{...request}, { ...getAxiosConfig() });
    }
    static async delete(id?: string): Promise<AxiosResponse<{ store: StoreResponse }>> {
        return axios.delete(`/stores/${id}`, { ...getAxiosConfig() });
    }
}
export default AccountService;