import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { ListProductResponse, ProductFilterRequest } from "./types";
class ProductService {
    static async filter(filter?: ProductFilterRequest): Promise<AxiosResponse<ListProductResponse>> {
        return axios.get(`/products`, { ...getAxiosConfig(), params: filter});
    }
}
export default ProductService;