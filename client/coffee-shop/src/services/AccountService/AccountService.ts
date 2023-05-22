import axios, { AxiosResponse } from "axios";
import { ListLocationResponse } from "page/Account/create/CreateAccount.types";
import { getAxiosConfig } from "../config";
import { AccountChangePassword, AccountFilter, AccountRequest, AccountResponse, AccountUpdateRequest, FormLogin, JwtResponse, ListAccountResponse, ListRoleResponse } from "./types";

class AccountService {
    static async getProfiles(): Promise<AxiosResponse<{ account_response: AccountResponse }>> {
        return axios.get(`/accounts/profiles`, { ...getAxiosConfig() });
    }

    static async login(formLogin: FormLogin): Promise<AxiosResponse<{ JwtResponse: JwtResponse }>> {
        return axios.get(`/auth/login`, { ...getAxiosConfig(), params: formLogin  });
    }

    static async filter(filter: AccountFilter): Promise<AxiosResponse<{ list_accounts_response: ListAccountResponse }>> {
        return axios.get(`/accounts`, { ...getAxiosConfig(), params: filter});
    }
    static async create(account: AccountRequest): Promise<AxiosResponse<{ account_response: AccountResponse }>> {
        return axios.post(`/accounts`,{ ...account }, { ...getAxiosConfig()});
    }
    static async filterRoles(): Promise<AxiosResponse<{ list_roles: ListRoleResponse }>> {
        return axios.get(`/accounts/roles`, { ...getAxiosConfig()});
    }
    static async filterLocations(): Promise<AxiosResponse<{ list_locations: ListLocationResponse }>> {
        return axios.get(`/accounts/locations`, { ...getAxiosConfig()});
    }

    static async getById(id?: string): Promise<AxiosResponse<{ account_response: AccountResponse }>> {
        return axios.get(`/accounts/${id}`, { ...getAxiosConfig() });
    }
    static async delete(id?: string): Promise<AxiosResponse<any>> {
        return axios.delete(`/accounts/${id}`, { ...getAxiosConfig() });
    }

    static async update(id?: string, account?: AccountUpdateRequest): Promise<AxiosResponse<{ account_response: AccountResponse }>> {
        return axios.put(`/accounts/${id}`,{...account}, { ...getAxiosConfig() });
    }

    static async changePassword(id?: string, account?: AccountChangePassword): Promise<AxiosResponse<any>> {
        return axios.put(`/accounts/change_password/${id}`,{...account}, { ...getAxiosConfig() });
    }


}
export default AccountService;