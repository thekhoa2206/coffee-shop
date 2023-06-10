import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ListOrderResponse, OrderFilterRequest, OrderRequest, OrderResponse } from "./types";
class OrderService {
    static async filter(filter?: OrderFilterRequest): Promise<AxiosResponse<ListOrderResponse>> {
        return axios.get(`/orders`, { ...getAxiosConfig(), params: filter});
    }
    static async create(request?: OrderRequest): Promise<AxiosResponse<OrderResponse>> {
        return axios.post(`/orders`,request, { ...getAxiosConfig()});
    }
    static async getById(id?: string): Promise<AxiosResponse<OrderResponse>> {
        return axios.get(`/orders/${id}`, { ...getAxiosConfig() });
    }
    static async addPayment(id?: string): Promise<AxiosResponse<OrderResponse>> {
        return axios.put(`/orders/${id}/payment`,{}, { ...getAxiosConfig() });
    }
    static async update(request?: OrderRequest, id?: string): Promise<AxiosResponse<OrderResponse>> {
        return axios.put(`/orders/${id}`,request, { ...getAxiosConfig()});
    }
}
export default OrderService;