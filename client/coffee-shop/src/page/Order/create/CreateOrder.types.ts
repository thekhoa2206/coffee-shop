import { WithStyles } from "@material-ui/core";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import { StoreContext } from "store/StoreContext/types";
import styles from "./CreateOrder.styles";

export interface CreateOrderProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
    storeContext: StoreContext;
  }

export type ProductItemRequest = {
  id: number;
  storeId?: number;
  name?: string;
  quantity?: number;
  weightValue?: number;
  price?: number;
  code?: string;
}

export type OrderRequest = {
  id?: number;
  storeId?: number;
  code?: string;
  partnerDesId?: number;
  partnerSrcId?: number;
  fee?: number;
  cod?: number;
  total?: number;
  note?: string;
  high?: number;
  width?: number;
  height?: number;
  packsizeWeightValue?: number;
  lineItem?: ProductItemRequest[];
  customer?: CustomerRequest;
}

export type CustomerRequest = {
  id?: number;
  code?: string;
  name?: string;
  storeId?: number;
  address?: string;
  districtId?: number;
  wardId?: number;
  cityId?: number;
  phone?: string;
  districtName?: string;
  wardName?: string;
  cityName?: string;
}

export type OrderUpdateStatusRequest ={
  status?: string;
  storeId?: number;
  orderId?: number;
  accountId?: number;
  reason?: string;
}