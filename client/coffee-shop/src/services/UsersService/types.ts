import { CategoryResponse } from "services/CategoryService";
import { IngredientResponse } from "services/IngredientsService";
import { StockUnitResponse } from "services/StockUnitService";
import { Metadata } from "services/types";

export type UserResponse = {
    id: number;
    name: string;
    username: string;
    phoneNumber: number;
    email?: string;
    passWord:string;
    status: number;
    role: string;
    createdOn?: string;
    createdBy?: string;
    modifiedOn?: string;
    modifiedBy?: string;
}


export type UserFilterRequest = {
    ids?: number[];
    query?: string;
    page?: number;
    limit?: number;
    statuses?: string;
}

export type ListUserResponse = {
    data?: UserResponse[];
    metadata?: Metadata;
}

export type UserRequest = {
    name: string;
    username: string;
    phoneNumber: number;
    email?: string;
    password:string;
    roleId: number;
}
