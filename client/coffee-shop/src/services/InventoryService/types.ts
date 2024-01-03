
import { BaseFilter, BaseResponse, Metadata } from "services/types";

export type ReportInventoryResponse = {
     ingredientName : string;
     ingredientId: number;
    //số lượng bắt đầu kỳ theo thời gian  khi xem report
    startAmount: number;
    //số lượng kết thúc kỳ theo thời gian khi xem report
    endAmount: number;
    // Số lượng bán
    amountDecrease:number;
    // Số lượng nhập
    amountIncrease:number;
    // Số lượng xuất
    amountPurchase:number;
    //đơn vị
     unitName :string;
    //tổng tiền
     totalCode:number;
}


export type ReportInventoryRequest = {
    startDate?:string;
    endDate?:string;
    page?: number;
    limit?: number;
    createdOnPredefined?: string;
}

export type ListReportInventoryResponse = {
    data?: ReportInventoryResponse[];
    metadata?: Metadata;
}
export interface IOInventoryFilter extends BaseFilter{
    ids?: string;
    statuses?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
    createdOnPredefined?: string;
}
export type InventoryFilterModel = {
    startDate?: Date | null;
    endDate?: Date | null;
    createdOnPredefined?: string;

}
export type ReportInventoryDetailResponse = {
    ingredientName?: string;
    stockEvents :StockEvents;
}
export type StockEvents = {
    data?: StockEvent[];
    metadata?: Metadata;
}
export type StockEvent = {
    amountChargeInUnit?: string;
    createdOn?:number;
    objectId?:number;
    name?:string;
    code?:string;
    type?:string;
    notes?:string;
    stockRemain?:string;
}

export interface IngredientOnhandResponse extends BaseResponse {
    name?: string;
    price?: number;
    quantityOnhand?: number;
}

export type ListIngredientOnHand = {
    data?: IngredientOnhandResponse[];
    metadata?: Metadata;
}