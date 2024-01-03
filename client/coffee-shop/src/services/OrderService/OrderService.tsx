import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ListOrderResponse, OrderFilter, OrderPrintForm, OrderPrintFormFilter, OrderRequest, OrderResponse } from "./types";
import { IOInventoryFilter } from "services/InventoryService/types";
class OrderService {
    static async filter(filter?: OrderFilter): Promise<AxiosResponse<ListOrderResponse>> {
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
    static async updateStatus(id?: string, status?: number): Promise<AxiosResponse<OrderResponse>> {
        return axios.put(`/orders/${id}/update_status/${status}`,{}, { ...getAxiosConfig()});
    }
    static async printForm(print?: OrderPrintFormFilter): Promise<AxiosResponse<OrderPrintForm>> {
        return axios.get(`/orders/print_forms`, { ...getAxiosConfig(), params: print});
    }
    static async updateStatusItem(orderId: number, itemIds: String): Promise<AxiosResponse<OrderPrintForm>> {
        return axios.put(`/orders/${orderId}/update_item/${itemIds}`,{}, { ...getAxiosConfig()});
    }

    static async splitOrder(requests?: OrderRequest[], id?: string): Promise<AxiosResponse<OrderResponse>> {
        return axios.put(`/orders/${id}/split_order`,requests, { ...getAxiosConfig()});
    }
    static async joinOrder(requests?: OrderRequest[], id?: string): Promise<AxiosResponse<OrderResponse>> {
        return axios.put(`/orders/${id}/join_order`,requests, { ...getAxiosConfig()});
    }
}
export default OrderService;