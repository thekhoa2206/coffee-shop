import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ListStockUnitResponse, StockUnitFilterRequest, StockUnitResponse } from "./types";
class StockUnitService {
    static async filter(filter?: StockUnitFilterRequest): Promise<AxiosResponse<ListStockUnitResponse>> {
        return axios.get(`/stock_unit`, { ...getAxiosConfig(), params: filter});
    }
    static async getById(id: string): Promise<AxiosResponse<StockUnitResponse>> {
        return axios.get(`/stock_unit/${id}`, { ...getAxiosConfig()});
    }
    static async delete(id: string): Promise<AxiosResponse<StockUnitResponse>> {
        return axios.delete(`/stock_unit/${id}`, { ...getAxiosConfig()});
    }
}
export default StockUnitService;