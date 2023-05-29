import { Metadata } from "services/types";

export type CategoryResponse = {
    id: number;
    name: string;
    createdBy?: number;
    createdOn?: Date;
    modifiedBy?: number;
    modifiedOn?: Date;
}

export type CategoryFilterRequest = {
    ids?: number[];
    query?: string;
    page?: number;
    limit?: number;
    statuses?: string;
}

export type ListCategoryResponse = {
    data?: CategoryResponse[];
    metadata?: Metadata;
}
