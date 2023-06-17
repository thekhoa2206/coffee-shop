import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { CustomerFilterRequest, CustomerRequest, CustomerResponse, ListCustomerResponse } from "./types";

class CustomerService {
    static async filter(filter?: CustomerFilterRequest): Promise<AxiosResponse<ListCustomerResponse>> {
        return axios.get(`/customers`, { ...getAxiosConfig(), params: filter});
    }
    static async create(request: CustomerRequest): Promise<AxiosResponse<CustomerResponse>> {
        return axios.post(`/customers`,request , { ...getAxiosConfig()});
    }
    static async update(request: CustomerRequest, id?: number): Promise<AxiosResponse<CustomerResponse>> {
        return axios.put(`/customers/${id}`,request, { ...getAxiosConfig()});
    }
    static async getById(id: string): Promise<AxiosResponse<CustomerResponse>> {
        return axios.get(`/customers/${id}`, { ...getAxiosConfig()});
    }
    static async delete(id?: number): Promise<AxiosResponse<CustomerResponse>> {
        return axios.delete(`/customers/${id}`, { ...getAxiosConfig()});
    }
}
export default CustomerService;