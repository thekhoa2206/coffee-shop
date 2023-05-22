import { BaseFilter } from "services/types";

export interface IOrderQuickFilter extends BaseFilter {
  roles?: string;
  status?: string;
  created_on_predefined?: string;
  saved_search_id?: any;
  occurAtMax?: string;
  occurAtMin?: string;
}

export class AccountQuickFilter implements IOrderQuickFilter {
  constructor(modules?: string) {}
}
