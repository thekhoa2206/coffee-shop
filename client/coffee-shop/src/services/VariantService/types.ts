import { IngredientItemResponse } from "services/ItemsService";
import { Metadata } from "services/types";

export type VariantResponse = {
    id: number;
    name: string;
    status: number;
    price: number;
    available:number;
    itemId: number;
    ingredients: IngredientItemResponse[];
    createdOn?: Date;
    createdBy?: number;
    modifiedOn?: Date;
    modifiedBy?: number;
}

export type VariantFilterRequest = {
    ids?: number[];
    query?: string;
    page?: number;
    limit?: number;
    statuses?: string;
    comboIds?: number[];
}

export type ListVariantResponse = {
    data?: VariantResponse[];
    metadata?: Metadata;
}
