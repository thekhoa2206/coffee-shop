import { type } from "os";
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
    variants: VariantResponse[];
    createdOn?: string;
    createdBy?: string;
    modifiedOn?: string;
    modifiedBy?: string;
}
export type ItemResponses = {
    id: number;
    name: string;
    imageUrl: string;
    description: string;
    discountPercentage: number;
    status?: string;
    category: CategoryResponse;
    stockUnitResponse: StockUnitResponse
    variants: VariantResponse;
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
}

export type VariantRequest = {
    id: number;
    name?: string;
    price?: number;
    ingredients?: IngredientItemRequest[];
}

export type IngredientItemRequest = {
    id?: number;
    name?: string;
    ingredientId?: number; 
    amountConsume: number;
    stockUnitId?: number;
}

export type VariantResponse = {
    id: number;
    name: string;
    status: string;
    price: number;
   itemId?: number;
   ingredients: IngredientItemResponse[];
   createdOn?: string;
   createdBy?: string;
   modifiedOn?: string;
   modifiedBy?: string;
}

export type IngredientItemResponse = {
    id?: number;
    amountConsume?: number;
    ingredientId?: number;
    name?: string;
    createdOn?: Date;
    createdBy?: number;
    modifiedOn?: Date;
    modifiedBy?: number;
    stockUnitResponse?: StockUnitResponse;
}
export type FileResponse={
    id?: number;
    fileName?:string;
    fileUrl?:string;
    path?:string;
    size?:number;
}