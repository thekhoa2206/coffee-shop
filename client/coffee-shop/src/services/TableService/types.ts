import { CategoryResponse } from "services/CategoryService";
import { IngredientResponse } from "services/IngredientsService";
import { OrderResponse } from "services/OrderService";
import { StockUnitResponse } from "services/StockUnitService";
import { Metadata } from "services/types";

export type TableResponse = {
    id: string;
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

export type OrderTableResponse = {
    order: OrderResponse;
    tables: TableResponse[];
}

export type ListTableOrderResponse = {
    data?: OrderTableResponse[];
    metadata?: Metadata;
}
export interface OrderResponseV2 extends OrderResponse {
    isShow?: boolean;
}
export type TableOrderResponses = {
    data?: OrderResponseV2[];
    metadata?: Metadata;
}

