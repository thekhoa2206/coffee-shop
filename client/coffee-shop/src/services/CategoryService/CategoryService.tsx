import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { CategoryFilterRequest, ListCategoryResponse } from "./types";

class CategoryService {
    static async filter(filter?: CategoryFilterRequest): Promise<AxiosResponse<ListCategoryResponse>> {
        return axios.get(`/category`, { ...getAxiosConfig(), params: filter });
    }
}
export default CategoryService;