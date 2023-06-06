import { CategoryResponse } from "services/CategoryService";
import { ItemResponse } from "services/ItemsService";
import { Metadata } from "services/types";

export type ComboFilterRequest = {
  ids?: number[];
  query?: string;
  page?: number;
  limit?: number;
  statuses?: string;
};

export type CreateComboRequest = {
  name?: string;
  imageUrl?: string;
  description?: string;
  discountPercentage?: number;
  price?: number;
  categoryId?: number;
  varianIds?: VariantComboRequest[];
};
export type VariantComboRequest = {
  variantId?: number;
  quantity: number;
  price: number;
  name?: string;
};
export type ComboRespone = {
  name?: string;
  imageUrl?: string;
  description?: string;
  discountPercentage?: number;
  price?: number;
  categoryId?: CategoryResponse;
  items?: ComboItemResponse[];
  id: number;
  createdOn?: string;
  createdBy?: string;
  modifiedOn?: string;
  modifiedBy?: string;
  status?: string;
};
export type ComboItemResponse = {
  item?: ItemResponse;
  quantity?: number;
};
export type ListComboRespone = {
  data?: ComboRespone[];
  metadata?: Metadata;
};
