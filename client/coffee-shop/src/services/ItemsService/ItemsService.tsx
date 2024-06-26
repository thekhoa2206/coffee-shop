import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ListItemResponse, ItemFilterRequest, ItemRequest, ItemResponse, FileResponse } from "./types";
class ItemsService {
    static async filter(filter?: ItemFilterRequest): Promise<AxiosResponse<ListItemResponse>> {
        return axios.get(`/item`, { ...getAxiosConfig(), params: filter});
    }
    static async getById(id?: string): Promise<AxiosResponse<ItemResponse>> {
        return axios.get(`/item/${id}`, { ...getAxiosConfig()});
    }
    static async delete(id: string): Promise<AxiosResponse<ItemResponse>> {
        return axios.delete(`/item/${id}`, { ...getAxiosConfig()});
    }
    static async create(request: ItemRequest): Promise<AxiosResponse<ItemResponse>> {
        return axios.post(`/item`,request, { ...getAxiosConfig()});
    }
    static async update(request: ItemRequest, id: string): Promise<AxiosResponse<ItemResponse>> {
        return axios.put(`/item/${id}`,request, { ...getAxiosConfig()});
    }
    static async uploadImg(data?: FormData): Promise<AxiosResponse<FileResponse>> {
        return axios.post("/item/image",data,{
            ...getAxiosConfig(),
            headers: {
              ...getAxiosConfig().headers,
              "Content-Type": "multipart/form-data",
            },
          });
    }
}
export default ItemsService;