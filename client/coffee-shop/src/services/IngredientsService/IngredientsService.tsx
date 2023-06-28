import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { IngredientFilterRequest, IngredientRequest, IngredientResponse, ListIngredientResponse } from "./types";
class IngredientsService {
    static async filter(filter: IngredientFilterRequest): Promise<AxiosResponse<ListIngredientResponse>> {
        return axios.get(`/ingredient`, { ...getAxiosConfig(), params: filter});
    }
    static async create(request: IngredientRequest): Promise<AxiosResponse<IngredientResponse>> {
        return axios.post(`/ingredient`,request , { ...getAxiosConfig()});
    }
    static async update(request: IngredientRequest, id: number): Promise<AxiosResponse<IngredientResponse>> {
        return axios.put(`/ingredient/${id}`,request, { ...getAxiosConfig()});
    }
    static async getById(id: string): Promise<AxiosResponse<IngredientResponse>> {
        return axios.get(`/ingredient/${id}`, { ...getAxiosConfig()});
    }
    static async delete(id?: number): Promise<AxiosResponse<IngredientResponse>> {
        return axios.delete(`/ingredient/${id}`, { ...getAxiosConfig()});
    }
}
export default IngredientsService;