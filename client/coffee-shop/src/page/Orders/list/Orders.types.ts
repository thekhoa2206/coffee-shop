import { WithStyles } from "@material-ui/core";
import { BaseFilter } from "services/types";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./Orders.styles";
import { ProductVariantResponse } from "services/ProductService";

export interface OrdersProps extends WithStyles<typeof styles> {
  menuState: MenuState;
  authState: AuthState;
  history: any;
}

export interface OrderFilterRequest extends BaseFilter {
  status?: string;
  created_on_predefined?: string;
}

export interface IOrderQuickFilter extends BaseFilter {
  status?: string;
  created_on_predefined?: string;
  occurAtMax?: string;
  occurAtMin?: string;
}

export interface LineItemStore {
   name?: string;
   productId: number; //product_id là combo_id với sp combo variantId với sp thường.
   combo: boolean;
   quantity:number
   price: number;
   lineAmount?: number;
   variants?: ProductVariantResponse[];
   available: number;
   isShow?: boolean;
}
