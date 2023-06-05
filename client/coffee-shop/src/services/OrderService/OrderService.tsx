import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ListOrderResponse, OrderFilterRequest } from "./types";
class OrderService {
    static async filter(filter?: OrderFilterRequest): Promise<AxiosResponse<ListOrderResponse>> {
        return axios.get(`/orders`, { ...getAxiosConfig(), params: filter});
    }
}
export default OrderService;