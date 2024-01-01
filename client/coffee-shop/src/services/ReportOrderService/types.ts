import { CustomerResponse } from "services/CustomerService";
import { VariantResponse } from "services/VariantService";
import { BaseFilter, Metadata } from "services/types";

export interface Revenue {
    totalRevenue: number;
    totalDiscount: number;
    date: string;
}
export interface ReportFilterRequest extends BaseFilter {
    createdOnMax?: string;
    createdOnMin?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    createdOnPredefined?: string;
}

export interface ReportCustomerResponse {
    customer?: CustomerResponse;
    total?: number;
    totalDiscount?: number;
    quantity?: number;
}
export interface ReportCustomer {
    data: ReportCustomerResponse[];
    metadata?: Metadata;
}
export interface ReportProductResponse {
    variant?: VariantResponse;
    totalQuantity?: number;
    totalRevenue?: number;
}

export interface ReportProductFilter extends ReportFilterRequest {
    top?: number;
}

export interface ReportSaleResponse {
    quantityOrder?: number;
    quantityOrderCancel?: number;
    totalOrder?: number;
    totalOrderCancel?: number;
    // Tổng tiền nguyên liệu đã dùng
    totalIngredient?: number;
    // Tổng tiền nguyên liệu bị huỷ
    totalIngredientCancel?: number;
}