import { Metadata } from "services/types";

export type RoleResponse = {
    id: number;
    name: string;
    createdOn?: string;
    createdBy?: string;
    modifiedOn?: string;
    modifiedBy?: string;
}


export type ItemFilterRequest = {
    ids?: number[];
    query?: string;
    page?: number;
    limit?: number;
    statuses?: string;
}

export type ListRoleResponse = {
    data?: RoleResponse[];
    metadata?: Metadata;
}

export type RoleResquest= {
 name?: string;
 scopes?: string;
}

