import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ListTableResponse, TableFilterRequest, TableRequest, TableResponse } from "./types";
class UsersService {
    static async filter(filter?: TableFilterRequest): Promise<AxiosResponse<ListTableResponse>> {
        return axios.get(`/table`, { ...getAxiosConfig(), params: filter});
    }
    static async getById(id?: string): Promise<AxiosResponse<TableResponse>> {
        return axios.get(`/table/${id}`, { ...getAxiosConfig()});
    }
    static async delete(id: string): Promise<AxiosResponse<TableResponse>> {
        return axios.delete(`/table/${id}`, { ...getAxiosConfig()});
    }
    static async create(request: TableRequest): Promise<AxiosResponse<TableResponse>> {
        return axios.post(`/table`,request, { ...getAxiosConfig()});
    }
    static async update(request: TableRequest, id: string): Promise<AxiosResponse<TableResponse>> {
        return axios.put(`/table/${id}`,request, { ...getAxiosConfig()});
    }
}
export default UsersService;