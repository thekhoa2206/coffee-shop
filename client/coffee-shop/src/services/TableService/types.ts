import { CategoryResponse } from "services/CategoryService";
import { IngredientResponse } from "services/IngredientsService";
import { StockUnitResponse } from "services/StockUnitService";
import { Metadata } from "services/types";

export type TableResponse = {
    id: number;
    name: string;
    status: number;
    orderId: number;
    createdOn?: string;
    createdBy?: string;
    modifiedOn?: string;
    modifiedBy?: string;
}


export type TableFilterRequest = {
    ids?: number[];
    query?: string;
    page?: number;
    limit?: number;
    statuses?: string;
}

export type ListTableResponse = {
    data?: TableResponse[];
    metadata?: Metadata;
}

export type TableRequest = {
    name?: string;
    status?: number;
    id?:string;
}
