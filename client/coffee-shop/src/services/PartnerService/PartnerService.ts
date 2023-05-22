import axios, { AxiosResponse } from "axios";
import { CustomerRequest } from "page/Order/create/CreateOrder.types";
import { CustomerResponse } from "services/OrdersService";
import { getAxiosConfig } from "../config";
import { ListPartnerResponse, PartnerFilterRequest } from "./types";

class PartnerService {
    static async filter(filter: PartnerFilterRequest): Promise<AxiosResponse<{ list_partner: ListPartnerResponse }>> {
        return axios.get(`/partners/filter`, { ...getAxiosConfig(), params: filter});
    }
    static async create(account: CustomerRequest): Promise<AxiosResponse<{ CustomerResponse: CustomerResponse }>> {
        return axios.post(`/partners`,{ ...account }, { ...getAxiosConfig()});
    }
    static async getById(id?: string): Promise<AxiosResponse<{ CustomerResponse: CustomerResponse }>> {
        return axios.get(`/partners/${id}`, { ...getAxiosConfig() });
    }
    static async delete(id?: string): Promise<AxiosResponse<any>> {
        return axios.delete(`/partners/${id}`, { ...getAxiosConfig() });
    }
    static async update(id?: string, customer?: CustomerRequest): Promise<AxiosResponse<{ CustomerResponse: CustomerResponse }>> {
        return axios.put(`/partners/${id}`,{...customer}, { ...getAxiosConfig() });
    }

}
export default PartnerService;