import { CustomerResponse } from "services/CustomerService";
import { BaseResponse, Metadata, UserResponse } from "services/types";

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
}

export type ListOrderResponse = {
    data?: OrderResponse[];
    metadata?: Metadata;
}

export type OrderFilterRequest = {
    ids?: number[];
    query?: string;
    page?: number;
    limit?: number;
    statuses?: string;
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
}

export type OrderRequest = {
    code?: string | null;
    customerId: number;
    note?: string | null;
    discountTotal: number;
    orderItemRequest?: OrderItemRequest[];
    total?: number;
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