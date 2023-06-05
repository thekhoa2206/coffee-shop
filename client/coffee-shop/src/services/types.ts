export type Metadata = {
    total: number;
    page: number;
    limit: number;
  };
  
  export interface BaseFilter extends GridState {
    query?: string;
    created_on_min?: string;
    created_on_max?: string;
    status?: string;
    ids?: string;
    location_ids?: string;
    export_type?: string;
    account_ids?: string;
    store_id?: number;
  }
  export interface GridState {
    limit?: number;
    page?: number;
    sort_by?: string;
    sort_direction?: string;
    time?: number | null;
  }
  export interface IOMessage {
    message?: string;
    email?: string;
  }
  export type FileImportRequest = {
    bytes?: number[] | null;
    file_name?: string;
    file_size?: number;
    file_url?: string;
    base64?: string;
    tenant_id?: number;
    location_id?: number;
    destination_location_id?: number;
    delivery_service_provider_id?: number;
  };
  
  export type Pageable = {
    size: number;
    page: number;
  };
  export interface ReportInventoryDetailStockDiffLogFilter extends BaseFilter {
    inventory_field?: string;
    compare_type?: string;
    location_ids?: string;
    variant_id?: number;
  }
  
export interface BaseResponse {
  id: number;
  createdOn?: Date;
  createdBy?: number;
  modifiedOn?: Date;
  modifiedBy?: number;
}
export * from "./AccountService/types";
  