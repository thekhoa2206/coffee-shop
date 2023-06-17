import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ListUserResponse, UserFilterRequest, UserRequest, UserResponse } from "./types";
class UsersService {
    static async filter(filter?: UserFilterRequest): Promise<AxiosResponse<ListUserResponse>> {
        return axios.get(`/user`, { ...getAxiosConfig(), params: filter});
    }
    static async getById(id?: string): Promise<AxiosResponse<UserResponse>> {
        return axios.get(`/user/${id}`, { ...getAxiosConfig()});
    }
    static async delete(id: string): Promise<AxiosResponse<UserResponse>> {
        return axios.delete(`/user/${id}`, { ...getAxiosConfig()});
    }
    static async create(request: UserRequest): Promise<AxiosResponse<UserResponse>> {
        return axios.post(`/user`,request, { ...getAxiosConfig()});
    }
    static async update(request: UserRequest, id: string): Promise<AxiosResponse<UserResponse>> {
        return axios.put(`/user/${id}`,request, { ...getAxiosConfig()});
    }
}
export default UsersService;