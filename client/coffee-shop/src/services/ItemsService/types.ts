import { Metadata } from "services/types";

export type ItemResponse = {
    id: number;
    name: string;
}

export type ItemFilterRequest = {
    ids?: number[];
    query?: string;
    page?: number;
    limit?: number;
    statuses?: string;
}

export type ListItemResponse = {
    data?: ItemResponse[];
    metadata?: Metadata;
}

export type ItemRequest = {
    name?: string;
    imageUrl?: string;
    description?: string;
    discountPercentage?: number;
    stockUnitId?: number;
    categoryId?: number;
    variantRequest?: string;
}

export type VariantRequest = {
    name?: string;
    price?: number;
    variantId?: number;
}