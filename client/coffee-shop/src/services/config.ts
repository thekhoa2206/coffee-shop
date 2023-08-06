import { AxiosRequestConfig } from "axios";
import qs from "qs";
import { getCookie } from "utilities";

export const REACT_APP_API_BASE_URL = `http://localhost:8888/api`;
export const getAxiosConfig = (): AxiosRequestConfig => {
    let jwt = getCookie("jwt");
    return {
      baseURL: REACT_APP_API_BASE_URL,
      timeout: 100000,
      responseType: "json",
      maxContentLength: 10000,
      validateStatus: (status: number) => status >= 200 && status < 300,
      maxRedirects: 5,
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: "comma" });
      },
      headers: {
        "Authorization": jwt ? jwt : "",
        "Access-Control-Allow-Origin": "http://localhost:8888",
      },
    };
  };