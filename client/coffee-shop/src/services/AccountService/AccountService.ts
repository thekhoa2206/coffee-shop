import axios, { AxiosResponse } from "axios";
import { getAxiosConfig } from "../config";
import { AccountChangePassword, AccountFilter, AccountRequest, UserResponse, AccountUpdateRequest, FormLogin, JwtResponse, ListUserResponse, ListRoleResponse, AccountFilterRequest } from "./types";

class AccountService {
    static async getProfiles(): Promise<AxiosResponse<UserResponse>> {
        return axios.get(`/profiles`, { ...getAxiosConfig() });
    }

    static async login(formLogin: FormLogin): Promise<AxiosResponse<JwtResponse>> {
        return axios.get(`/login`, { ...getAxiosConfig(), params: formLogin  });
    }

    // static async filter(filter: AccountFilterRequest): Promise<AxiosResponse<ListUserResponse>> {
    //     return axios.get(`/user`, { ...getAxiosConfig(), params: filter  });
    // }


}
export default AccountService;