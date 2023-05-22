import axios, { AxiosResponse } from "axios";
import { OrderRequest, OrderUpdateStatusRequest } from "page/Order/create/CreateOrder.types";
import { getAxiosConfig } from "../config";
import { AnalyticsCODShipperResponse, FeeRequest, FeeResponse, ListAccountAnalyticsTopShipper, ListAnalyticsOrderResponse, ListOrdersResponse, ListRevenueResponse, OrdersFilter, OrdersFilterRequest, OrdersResponse, PaymentRequest, PaymentResponse, PrintFormRequest, PrintFormResponse, RevenueCurrentDate } from "./types";

class OrdersService {
    static async filter(filter: OrdersFilter): Promise<AxiosResponse<{list_orders: ListOrdersResponse}>> {
        return axios.get(`/orders`, { ...getAxiosConfig(), params: filter });
    }
    static async getFee(filter: FeeRequest): Promise<AxiosResponse<{fee_response: FeeResponse}>> {
        return axios.get(`/orders/fee`, { ...getAxiosConfig(), params: filter });
    }
    static async create(orderRequest: OrderRequest): Promise<AxiosResponse<{OrderResponse: OrdersResponse}>> {
        return axios.post(`/orders`,{...orderRequest}, { ...getAxiosConfig() });
    }
    static async getById(id?: string): Promise<AxiosResponse<{OrderResponse: OrdersResponse}>> {
        return axios.get(`/orders/${id}`, { ...getAxiosConfig() });
    }
    static async reFindShipper(id?: string): Promise<AxiosResponse<{OrderResponse: OrdersResponse}>> {
        return axios.put(`/orders/${id}/re_find_shipper`,{}, { ...getAxiosConfig() });
    }
    static async update(orderRequest: OrderRequest): Promise<AxiosResponse<{OrderResponse: OrdersResponse}>> {
        return axios.put(`/orders/${orderRequest.id}`,{...orderRequest}, { ...getAxiosConfig() });
    }
    static async updateStatus(orderRequest: OrderUpdateStatusRequest): Promise<AxiosResponse<{OrderResponse: OrdersResponse}>> {
        return axios.put(`/orders/update_status`,{...orderRequest}, { ...getAxiosConfig() });
    }
    static async printOrder(filter?: PrintFormRequest): Promise<AxiosResponse<{order_print_form: PrintFormResponse}>> {
        return axios.get(`/orders/print_forms`, { ...getAxiosConfig(), params: filter });
    }
    static async countOrders(filter: OrdersFilter): Promise<AxiosResponse<{list_analytics_order_response: ListAnalyticsOrderResponse}>> {
        return axios.get(`/orders/count_orders`, { ...getAxiosConfig(), params: filter });
    }
    static async getRevenueAnalytics(filter: OrdersFilter): Promise<AxiosResponse<{list_revenue: ListRevenueResponse}>> {
        return axios.get(`/orders/analytics`, { ...getAxiosConfig(), params: filter });
    }
    static async addPayment(input: PaymentRequest): Promise<AxiosResponse<{PaymentResponse: PaymentResponse}>> {
        return axios.post(`/orders/payments`,{...input}, { ...getAxiosConfig() });
    }
    static async getPayment(id?: string): Promise<AxiosResponse<{PaymentResponse: PaymentResponse}>> {
        return axios.get(`/orders/payments/${id}`, { ...getAxiosConfig() });
    }
    static async getRevenueAnalyticsCODShipper(filter: OrdersFilter): Promise<AxiosResponse<{analytics_cod_shipper: AnalyticsCODShipperResponse}>> {
        return axios.get(`/orders/analytics_cod_shipper`, { ...getAxiosConfig(), params: filter });
    }
    static async updatePayment(id?: string): Promise<AxiosResponse<{OrderResponse: OrdersResponse}>> {
        return axios.put(`/orders/payments/${id}`,{}, { ...getAxiosConfig() });
    }

    static async analyticsTopShipper(filter: OrdersFilter): Promise<AxiosResponse<{list_analytics_top: ListAccountAnalyticsTopShipper}>> {
        return axios.get(`/orders/analytics_top_shipper`,{ ...getAxiosConfig(), params: filter });
    }

    static async analyticsTopStore(filter: OrdersFilter): Promise<AxiosResponse<{list_analytics_top: ListAccountAnalyticsTopShipper}>> {
        return axios.get(`/orders/analytics_top_store`,{ ...getAxiosConfig(), params: filter });
    }
    static async delete(id?: string): Promise<AxiosResponse<void>> {
        return axios.delete(`/orders/${id}`, { ...getAxiosConfig() });
    }
    static async getDashboard(): Promise<AxiosResponse<{RevenueCurrentDate: RevenueCurrentDate}>> {
        return axios.get(`/orders/dashboard`, { ...getAxiosConfig() });
    }
}
export default OrdersService;