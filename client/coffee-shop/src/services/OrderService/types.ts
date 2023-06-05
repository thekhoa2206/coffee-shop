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
}