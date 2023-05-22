import { BaseFilter } from "services/types";

export interface IAccountQuickFilter extends BaseFilter {
  roles?: string;
  status?: string;
  created_on_predefined?: string;
  occurAtMax?: string;
  occurAtMin?: string;
}

export class AccountQuickFilter implements IAccountQuickFilter {
  constructor(modules?: string) {}
}
