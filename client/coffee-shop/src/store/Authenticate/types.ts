import { UserResponse } from "services/types";

export interface AuthState {
    isAuthenticated: boolean;
    user: UserResponse;
    errorType?: string;
    error?: Error;
    loadingAuth?: boolean;
    sessionHasBeenFetched?: boolean;
  }