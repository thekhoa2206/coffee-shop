import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { CustomerResponse, ListPartnerResponse, PartnerFilterRequest } from "./types";

class PartnerService {
    static async filter(filter: PartnerFilterRequest): Promise<AxiosResponse<{ list_partner: ListPartnerResponse }>> {
        return axios.get(`/partners/filter`, { ...getAxiosConfig(), params: filter});
    }
    static async create(): Promise<AxiosResponse<{ CustomerResponse: CustomerResponse }>> {
        return axios.post(`/partners`,{ }, { ...getAxiosConfig()});
    }
    static async getById(id?: string): Promise<AxiosResponse<{ CustomerResponse: CustomerResponse }>> {
        return axios.get(`/partners/${id}`, { ...getAxiosConfig() });
    }
    static async delete(id?: string): Promise<AxiosResponse<any>> {
        return axios.delete(`/partners/${id}`, { ...getAxiosConfig() });
    }
    static async update(id?: string): Promise<AxiosResponse<{ CustomerResponse: CustomerResponse }>> {
        return axios.put(`/partners/${id}`,{}, { ...getAxiosConfig() });
    }

}
export default PartnerService;