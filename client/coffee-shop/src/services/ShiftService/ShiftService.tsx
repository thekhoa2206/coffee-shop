import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import {  ShiftRequest, ShiftResponse } from "./types";
class ShiftService {
    static async getById(id?: number): Promise<AxiosResponse<ShiftResponse>> {
        return axios.get(`/shift/${id}`, { ...getAxiosConfig()});
    }
    static async delete(id: number): Promise<AxiosResponse<ShiftResponse>> {
        return axios.delete(`/shift/${id}`, { ...getAxiosConfig()});
    }
    static async create(id?: number): Promise<AxiosResponse<ShiftResponse>> {
        return axios.post(`/shift/${id}`, { ...getAxiosConfig()});
    }
 
}
export default ShiftService;