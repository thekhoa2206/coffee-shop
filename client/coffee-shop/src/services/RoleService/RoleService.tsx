import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ItemFilterRequest } from "services/ItemsService";
import { ListRoleResponse, RoleResponse, RoleResquest } from "./types";
class RoleService {
    static async filter(filter?: ItemFilterRequest): Promise<AxiosResponse<ListRoleResponse>> {
        return axios.get(`/role`, { ...getAxiosConfig(), params: filter});
    }
    static async getById(id?: string): Promise<AxiosResponse<RoleResponse>> {
        return axios.get(`/role/${id}`, { ...getAxiosConfig()});
    }
    static async delete(id: string): Promise<AxiosResponse<RoleResponse>> {
        return axios.delete(`/role/${id}`, { ...getAxiosConfig()});
    }
    static async create(request?: RoleResquest): Promise<AxiosResponse<RoleResponse>> {
        return axios.post(`/role`,request, { ...getAxiosConfig()});
    }
    static async update(request: RoleResquest, id: string): Promise<AxiosResponse<RoleResponse>> {
        return axios.put(`/role/${id}`,request, { ...getAxiosConfig()});
    }
}
export default RoleService;