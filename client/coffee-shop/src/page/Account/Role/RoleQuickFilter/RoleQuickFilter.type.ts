import { BaseFilter } from "services/types";

export interface IRoleQuickFilter extends BaseFilter {
  created_on_predefined?: string;
  saved_search_id?: any;
  created_on_min?: string;
  created_on_max?: string;
  created_on_predefined_modified?: string;
  modified_on_min?: string;
  modified_on_max?: string;
}

export class RoleQuickFilter implements IRoleQuickFilter {
  constructor(modules?: string) {}
}
