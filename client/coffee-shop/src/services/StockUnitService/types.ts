import { Metadata } from "services/types";

export type StockUnitResponse = {
    id: number;
    name: string;
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
