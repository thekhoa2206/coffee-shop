import { IngredientResponse } from "services/IngredientsService";

export type DashboardRequest ={
  createdOnMin?: string;
  createdOnMax?: string;
  createdOnPredefined?:string;
  startDate?: Date | null;
  endDate?: Date | null;
}
export type DashboardResponses = {
  data?: DashboardResponse;
}

export type DashboardResponse = {
   //Số khách hàng
    customers:number;
   // Doanh thu
   totalSale:number;
   // Tổng số đơn hàng
   orderCount:number;
   //Tổng số đơn hủy
  orderCancel:number;
   // trung bình mặt hàng trên hóa đơn
    averageItemQuantity :number;
   // trung bình doanh thu / hóa đơn
    averageOrderValue:number;
  // Tiền hủy
   cancelMoney:number;
   // Tổng doanh thu
   totalRevenue :number;
   // tiền xuất kho
  exportMoneyl:number;
   // tiền nhập kho
    BigDecimal:number;
     // tiền xuất kho
     exportMoney:number;
     // tiền nhập kho
     importMoney:number;
     ingredients: IngredientResponse[]
}

export type AggregateRevenueResponse = {
  aggregateRevenue:number;
  cancelMoney:number;
  date:string;
}
