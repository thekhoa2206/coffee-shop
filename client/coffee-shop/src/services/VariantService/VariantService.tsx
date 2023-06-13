import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ListVariantResponse, VariantFilterRequest } from "./types";
class VariantService {
    static async filter(filter?: VariantFilterRequest): Promise<AxiosResponse<ListVariantResponse>> {
        return axios.get(`/variants`, { ...getAxiosConfig(), params: filter});
    }
}
export default VariantService;