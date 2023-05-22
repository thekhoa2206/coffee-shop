export type CreateStoreRequest = {
    label?: string;
    email?: string;
    cityId?: number;
    districtId?: number;
    wardId?: number;
    address?: string;
    phoneNumber?: string;
    account?: AccountStoreRequest;
}

export type AccountStoreRequest = {
    name?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
}