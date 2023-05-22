import { AccountResponse } from "services/types";

export interface AuthState {
    isAuthenticated: boolean;
    user: AccountResponse;
    errorType?: string;
    error?: Error;
    loadingAuth?: boolean;
    sessionHasBeenFetched?: boolean;
  }