import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import {  ReportCustomer, ReportCustomerResponse, ReportFilterRequest, ReportProductFilter, ReportProductResponse, ReportSaleResponse, Revenue } from "./types";
import { IOInventoryFilter } from "services/InventoryService/types";
class ReportOrderService {
    static async getRevenues(filter?: ReportFilterRequest): Promise<AxiosResponse<Revenue[]>> {
        return axios.get(`/reports/order/revenues`, { ...getAxiosConfig(), params: filter});
    }
    static async getReportTopProduct(filter?: ReportFilterRequest): Promise<AxiosResponse<ReportProductResponse[]>> {
        return axios.get(`/reports/order/products`, { ...getAxiosConfig(), params: filter});
    }
    static async getReportTopCustomer(filter?: ReportProductFilter): Promise<AxiosResponse<ReportCustomer>> {
        return axios.get(`/reports/order/customers`, { ...getAxiosConfig(), params: filter});
    }
    static async reportSale(filter?: IOInventoryFilter): Promise<AxiosResponse<ReportSaleResponse>> {
        return axios.get(`/reports/order/sales`, { ...getAxiosConfig(), params: filter});
    }
}
export default ReportOrderService;