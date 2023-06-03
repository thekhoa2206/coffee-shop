import { Metadata } from "services/types";

export type StockUnitResponse = {
    id: number;
    name: string;
    createdOn?: string;
    createdBy?: string;
    modifiedOn?: string;
    modifiedBy?: string;
}

export type StockUnitFilterRequest = {
    ids?: number[];
    query?: string;
    page?: number;
    limit?: number;
    statuses?: string;
}

export type ListStockUnitResponse = {
    data?: StockUnitResponse[];
    metadata?: Metadata;
}
