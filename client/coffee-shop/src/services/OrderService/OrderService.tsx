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
}
export default OrderService;