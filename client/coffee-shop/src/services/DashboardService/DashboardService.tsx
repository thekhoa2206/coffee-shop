import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import {
  AggregateRevenueResponse,
  DashboardRequest,
  DashboardResponse,
} from "./types";
class DashboardService {
  static async filter(filter: DashboardRequest): Promise<AxiosResponse<DashboardResponse>> {
    return axios.get(`/dashboard`, { ...getAxiosConfig(), params: filter });
  }
  static async reportAggregateRevenue(
    filter: DashboardRequest
  ): Promise<AxiosResponse<AggregateRevenueResponse[]>> {
    return axios.get(`/dashboard/aggregateRevenue`, {
      ...getAxiosConfig(),
      params: filter,
    });
  }
}
export default DashboardService;
