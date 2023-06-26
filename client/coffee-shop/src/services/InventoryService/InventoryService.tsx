import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ListReportInventoryResponse, ReportInventoryRequest } from "./types";
class InventoryService {
    static async filter(filter?: ReportInventoryRequest): Promise<AxiosResponse<ListReportInventoryResponse>> {
        return axios.get(`/report/inventory`, { ...getAxiosConfig(), params: filter});
    }
}
export default InventoryService;