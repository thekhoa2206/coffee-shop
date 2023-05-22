import { LocationResponse } from "page/Account/create/CreateAccount.types";
import { CityResponse, DistrictResponse, StoreResponse } from "services/StoreService"

export type StoreContext = {
    store?: StoreResponse;
    cities?: CityResponse[] | null;
    districts?: DistrictResponse[] | null;
}