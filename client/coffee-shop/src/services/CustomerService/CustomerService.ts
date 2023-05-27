import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { CustomerFilterRequest, ListCustomerResponse } from "./types";

class CustomerService {
    static async filter(filter: CustomerFilterRequest): Promise<AxiosResponse<ListCustomerResponse>> {
        return axios.get(`/customers`, { ...getAxiosConfig(), params: filter});
    }

}
export default CustomerService;