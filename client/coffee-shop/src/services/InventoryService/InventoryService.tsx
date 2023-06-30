import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { IOInventoryFilter, ListReportInventoryResponse, ReportInventoryDetailResponse, ReportInventoryRequest } from "./types";
class InventoryService {
    static async filter(filter?: IOInventoryFilter): Promise<AxiosResponse<ListReportInventoryResponse>> {
        return axios.get(`/report/inventory`, { ...getAxiosConfig(), params: filter});
    }
    static async detail(filter?: IOInventoryFilter,id?: string): Promise<AxiosResponse<ReportInventoryDetailResponse>> {
        return axios.get(`/report/inventory/${id}`, { ...getAxiosConfig(), params: filter});
    }
}
export default InventoryService;