import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { CreateStocktakingRequest, ListStocktakingReponse, StocktakingReponse, StoctakingFilterRequest } from "./type";
class StocktakingService {
    static async filter(filter: StoctakingFilterRequest): Promise<AxiosResponse<ListStocktakingReponse>> {
        return axios.get(`/stocktaking`, { ...getAxiosConfig(), params: filter});
    }
    static async create(request: CreateStocktakingRequest): Promise<AxiosResponse<StocktakingReponse>> {
        return axios.post(`/stocktaking`,request , { ...getAxiosConfig()});
    }
    static async update(request: CreateStocktakingRequest, id: string): Promise<AxiosResponse<StocktakingReponse>> {
        return axios.put(`/stocktaking/${id}`,request, { ...getAxiosConfig()});
    }
    static async getById(id: string): Promise<AxiosResponse<StocktakingReponse>> {
        return axios.get(`/stocktaking/${id}`, { ...getAxiosConfig()});
    }
    static async delete(id: string): Promise<AxiosResponse<StocktakingReponse>> {
        return axios.delete(`/stocktaking/${id}`, { ...getAxiosConfig()});
    }
}
export default StocktakingService;