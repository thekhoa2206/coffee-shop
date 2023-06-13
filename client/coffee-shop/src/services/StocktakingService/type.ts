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
}

export interface StocktakingIngredientReponse extends BaseResponse {
  quantity: number;
  ingredientMoney: number;
  ingredientResponse?: IngredientResponse;
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
  status?: string;
};

export type StocktakingIngredientRequest = {
  ingredientId?: number;
  quantity: number;
  ingredientMoney: number;
  name?:string
  totalMoney:number;
};
