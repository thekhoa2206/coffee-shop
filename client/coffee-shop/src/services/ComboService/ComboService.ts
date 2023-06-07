import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ComboFilterRequest, ComboRespone, CreateComboRequest, ListComboRespone } from "./types";

class ComboService {
    static async filter(filter: ComboFilterRequest): Promise<AxiosResponse<ListComboRespone>> {
        return axios.get(`/combo`, { ...getAxiosConfig(), params: filter});
    }
    static async create(request: CreateComboRequest): Promise<AxiosResponse<ComboRespone>> {
        return axios.post(`/combo`,request , { ...getAxiosConfig()});
    }
    static async update(request: CreateComboRequest, id: string): Promise<AxiosResponse<ComboRespone>> {
        return axios.put(`/combo/${id}`,request, { ...getAxiosConfig()});
    }
    static async getById(id: string): Promise<AxiosResponse<ComboRespone>> {
        return axios.get(`/combo/${id}`, { ...getAxiosConfig()});
    }
    static async delete(id: string): Promise<AxiosResponse<ComboRespone>> {
        return axios.delete(`/combo/${id}`, { ...getAxiosConfig()});
    }
}
export default ComboService;