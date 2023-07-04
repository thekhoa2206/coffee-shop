import { StockUnitResponse } from "services/StockUnitService/types";
import { Metadata } from "services/types";

export type IngredientFilterRequest ={
  ids?:  number[];
  query?: string;
  page?: number;
  limit?: number;
  statuses?: string;
}

export type ListIngredientResponse = {
    data?: IngredientResponse[];
    metadata?: Metadata;
}

export type IngredientRequest = {
  name?: string;
  quantity?: number;
  exportPrice?: number;
  stockUnitId?: number;
}

export type IngredientResponse = {
  createdBy?: number;
  createdOn?: Date;
  id?: number;
  modifiedBy?: number;
  modifiedOn?: Date;
  name?: string;
  quantity?: number;
  exportPrice?: number;
  status?: number;
  stockUnitResponse?: StockUnitResponse;
}
