import { WithStyles } from "@material-ui/core";
import { BaseFilter } from "services/types";
import { AuthState } from "store/Authenticate/types";
import { MenuState } from "store/Menu/types";
import styles from "./Ingredients.styles";

export interface IngredientProps extends WithStyles<typeof styles> {
    menuState: MenuState;
    authState: AuthState;
    history: any;
}

export interface IngredientFilterRequest extends BaseFilter {
  status?: string;
  created_on_predefined?: string;
}

export interface IIngredientQuickFilter extends BaseFilter {
    status?: string;
    created_on_predefined?: string;
    occurAtMax?: string;
    occurAtMin?: string;
  }
  
export type DialogDeleteIngredientProps = {
  id?: string;
  open: boolean;
  onClose: () => void;
  initData: () => void;
}

export type DialogUpdateIngredientProps = {
  id?: string;
  open: boolean;
  onClose: () => void;
  initData: () => void;
}