import { CategoryResponse } from "services/CategoryService";
import { IngredientResponse } from "services/IngredientsService";
import { StockUnitResponse } from "services/StockUnitService";
import { Metadata } from "services/types";

export type ItemResponse = {
    id: number;
    name: string;
    imageUrl: string;
    description: string;
    discountPercentage: number;
    status?: string;
    category: CategoryResponse;
    stockUnitResponse: StockUnitResponse
    variant: VariantResponse[];
    ingredient: IngredientResponse[];
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
    variantRequest?: VariantRequest[];
    ingredient?: IngredientItemRequest[];
}

export type VariantRequest = {
    id: number;
    name?: string;
    price?: number;
    type?: string;
}

export type IngredientItemRequest = {
    id?: number;
    name?: string;
    ingredientId?: number; 
    amountConsume: number;
    type?: string;
}

export type VariantResponse = {
    name: string;
    status: string;
    price: number;
   itemId?: number;
}