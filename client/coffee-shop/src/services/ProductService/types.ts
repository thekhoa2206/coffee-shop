import { type } from "os";
import { CategoryResponse } from "services/CategoryService";
import { BaseResponse, Metadata } from "services/types";

export interface ProductResponse extends BaseResponse {
    name?: string;
    status?: number;
    description?: string;
    price?: number;
    discountPercentage?: number;
    imageUrl?: string;
    combo?: boolean;
    categoryResponse?: CategoryResponse;
    variants: ProductVariantResponse[];
    available?: number;
}

export interface ProductVariantResponse extends BaseResponse {
    name?: string;
    available?: number;
    price?: number;
    ingredients?: ProductIngredientResponse[];
    productItemId?: number;
    quantity?: number;
}

export interface ProductIngredientResponse extends BaseResponse {
    amountConsume?: number;
    name?: string;
    quantityInventory?: number;
    status?: number;
    ingredientId?: number;
}

export type ProductFilterRequest = {
    ids?: number[];
    query?: string;
    page?: number;
    limit?: number;
    statuses?: string;
    combo?: boolean;
}

export type ListProductResponse = {
    data?: ProductResponse[];
    metadata?: Metadata;
}