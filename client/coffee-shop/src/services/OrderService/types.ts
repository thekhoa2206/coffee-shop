import { BaseFilterFixedModel } from "components/FilterFixed/FilterFixed";
import { CustomerResponse } from "services/CustomerService";
import { BaseFilter, BaseResponse, Metadata, UserResponse } from "services/types";

export interface OrderResponse extends BaseResponse {
    code: string;
    customerResponse?: CustomerResponse;
    status: number;
    total: number;
    discountTotal?: number | null;
    note?: string;
    orderItemResponses?: OrderItemResponse[];
    userResponse?: UserResponse;
    paymentStatus?: number;
    tableResponses?:any[],
}

export type ListOrderResponse = {
    data?: OrderResponse[];
    metadata?: Metadata;
}


export interface OrderItemResponse extends BaseResponse {
    status?: number;
    combo?: boolean;
    quantity: number;
    name: string;
    price: number;
    productId: number;
    orderItemComboResponses?: OrderItemComboResponse[];
}

export interface OrderItemComboResponse extends BaseResponse {
    name?: string;
    status?: number;
    orderId?: number;
    orderItemId?: number;
    price?: number;
    quantity?: number;
    comboItemId?: number;
    variantId?: number;
}

export type OrderRequest = {
    id?: number;
    code?: string | null;
    customerId: number;
    note?: string | null;
    discountTotal: number;
    orderItemRequest?: OrderItemRequest[];
    total?: number;
    tableIds?: any[];
    status?: number;
    paymentStatus?: number;
}

export type OrderItemRequest = {
    id?: number;
    name?: string;
    productId?: number;
    combo?: boolean;
    quantity: number;
    price: number;
}
export type OrderPrintFormFilter = {
    orderId?: number;
}

export type OrderPrintForm = {
    orderId: number;
    htmlContent?: string;
}

export interface IOOrderFilter extends BaseFilter{
    ids?: string;
    statuses?: string;
    paymentStatus?: string;
    modifiedOnMax?: string;
    modifiedOnMin?: string;
    modifiedOnPredefined?: string;
    createdOnMin?: string;
    createdOnMax?: string;
    createdOnPredefined?: string;
}
export type OrderFilterModel = {
    statuses?: BaseFilterFixedModel<number>[];
    paymentStatus?: BaseFilterFixedModel<number>[];
    createdOnMax?: Date | null;
    createdOnMin?: Date | null;
    createdOnPredefined?: string;
    modifiedOnMax?: Date | null;
    modifiedOnMin?: Date | null;
    modifiedOnPredefined?: string;
}

export class OrderFilter implements IOOrderFilter {
    constructor(
      public query?: string,
      public page?: number,
      public limit?: number,
      public ids?: string,
      public statuses?: string,
      public paymentStatus?: string,
      public modifiedOnMax?: string,
      public modifiedOnMin?: string,
      public modifiedOnPredefined?: string,
      public createdOnMin?: string,
      public createdOnMax?: string,
      public createdOnPredefined?: string,
      public tableIds?: string,
    ) {}
  }