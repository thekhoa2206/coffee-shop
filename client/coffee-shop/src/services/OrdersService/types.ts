import { BaseFilterFixedModel } from "components/FilterFixed/FilterFixed";
import { BaseFilter, Metadata } from "../types";

export type OrdersFilterModel = {
  status?: string;
  created_on_max?: Date | null;
  created_on_min?: Date | null;
  created_on_predefined?: string;
};

export type OrdersFilter = {
  ids?:  number[];
  query?: string;
  page: number;
  limit: number;
  status?: string;
  location_ids?: number[];
  created_on_min?: string;
  created_on_max?: string;
  shipperId?: number;
  type?: string;
  year?: string;
  store_id?: number;
};

export interface OrdersFilterRequest extends BaseFilter {
  status?: string;
  created_on_predefined?: string;
}
export class OrderssFilter implements OrdersFilterRequest {
  constructor(
    public query?: string,
    public page?: number,
    public limit?: number,
    public ids?: string,
    public status?: string,
    public created_on_predefined?: string,
  ) {}
}
export type ListOrdersResponse = {
  orders: OrdersResponse[];
  metadata: Metadata;
}
export type OrdersResponse = {
  id: number;
  createdOn: Date;
  modifiledOn: Date;
  storeId: number;
  code: string;
  fee: number;
  cod: number;
  total: number;
  note: string;
  high?: number;
  width?: number;
  height?: number;
  packsizeWeightValue: number;
  status: string;
  shipStatus: string;
  lineItem: OrderLineItemResponse[];
  //người gửi
  receiptPersonal: CustomerResponse;
  sendPersonal: CustomerResponse;
  // người nhận
  // fulfillment
  completedOn: Date;
  shipper: ShipperResponse;
  paymentStatus?: string;
  paymentResponse?: PaymentResponse;
}

export type OrderLineItemResponse = {
  id: number;
  createOn: Date;
  modifiledOn: Date;
  storeId: number;
  code: string;
  weightValue: number;
  quantity: number;
  lineAmount: number;
  price: number;
  name: string;
}

export type FeeResponse = {
  fee: number;
}

export type FeeRequest = {
  districtReceiptId?: number;
  totalWeightValue?: number;
  districtShipId?: number;
}

export type CustomerResponse = {
  id?: number;
  code?: string;
  name?: string;
  storeId?: number;
  address?: string;
  districtId?: number;
  wardId?: number;
  cityId?: number;
  status?: string;
  phone?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  districtName?: string;
  wardName?: string;
  cityName?: string;
  email?: string;
}

export type ShipperResponse = {
  id?: number;
  phone?: string;
  name?: string;
}

export type PrintFormResponse = {
  htmlContent: string;
  orderId: number;
}
export type PrintFormRequest = {
  orderId: number;
}

export type AnalyticsOrderResponse = {
  count: number;
  status: string;
}

export type ListAnalyticsOrderResponse = {
  listAnalytics?: AnalyticsOrderResponse[];
}

export type RevenueResponse = {
  date?: string;
  revenue?: number;
}

export type ListRevenueResponse = {
  revenue_response?: RevenueResponse[];
}

export type PaymentRequest = {
  orderId?: number;
  amount?: number;
  freightPayer?: string;
}

export type PaymentResponse = {
  id?: number;
  orderId?: number;
  amount?: number;
  freightPayer?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  status?: string;
}

export type AnalyticsCODShipperResponse = {
  paidCOD?: number;
  unpaidCOD?: number;
  totalCOD?: number;
}


export type ListAccountAnalyticsTopShipper = {
  accountTopShip?: AccountAnalyticsTopShipper[];
}

export type AccountAnalyticsTopShipper = {
  accountId?: number
  name?: string;
  quantityOrder?: number
  totalCOD?: number;
  totalRevenue?: number;
}

export type RevenueCurrentDate = {
  quantityNewOrders?: number;
  quantityReturnOrders?: number;
  quantityCancelOrders?: number;
  revenues?: number;
}