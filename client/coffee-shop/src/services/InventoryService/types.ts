
import { Metadata } from "services/types";

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

