import { type } from "os";
import { CategoryResponse } from "services/CategoryService";
import { IngredientResponse } from "services/IngredientsService";
import { BaseResponse, Metadata } from "services/types";

export interface StocktakingReponse extends BaseResponse {
  name?: string;
  status?: number;
  description?: string;
  totalMoney?: number;
  type:string;
  code:string;
  object: StocktakingIngredientReponse[];
  payment:number;
  partner:string;
}

export interface StocktakingIngredientReponse  {
  quantity: number;
  ingredientMoney: number;
  ingredientResponse: IngredientResponse;
  id:number;
}

export interface ListStocktakingReponse {
  data?: StocktakingReponse[];
  metadata?: Metadata;
}

export type StoctakingFilterRequest = {
  ids?: number[];
  query?: string;
  page?: number;
  limit?: number;
  statuses?: string;
  type?: string;
};
export type CreateStocktakingRequest = {
  name?: string;
  type?: string;
  totalMoney?: number;
  description?: string;
  object?: StocktakingIngredientRequest[];
  payment?:boolean;
  status?: number;
  partner?:string;
  createdBy?: string;
  modifiedBy?: string;
};

export type StocktakingIngredientRequest = {
  ingredientId?: number;
  quantity: number;
  ingredientMoney: number;
  name?:string
  totalMoney:number;
  id?:number;
};
