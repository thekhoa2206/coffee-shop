
export const StoreQuickFilterOptions = {
    LABEL: "label",
    STATUS: "status",
    EMAIL: "email",
    CREATED_ON: "createdOn",
    DISTRICT_NAME: "districtName",
    PHONE_NUMBER: "phoneNumber",
    CITY_NAME: "cityName",
    ADDRESS: "address",
    MODIFIED_ON: "modifiedOn",
    WARD_NAME: "wardName",
    TOTAL_REVENUE: "totalRevenue",
    TOTAL_FEE: "totalFee"
};

export const getStoreQuickFilterLabel = (key: string) => {
    switch (key) {
        case StoreQuickFilterOptions.LABEL:
            return `Tên cửa hàng`;
        case StoreQuickFilterOptions.STATUS:
            return `Trạng thái`;
        case StoreQuickFilterOptions.EMAIL:
            return `Email`;
        case StoreQuickFilterOptions.CREATED_ON:
            return `Ngày tạo`;
        case StoreQuickFilterOptions.DISTRICT_NAME:
            return `Quận/huyện`;
        case StoreQuickFilterOptions.CITY_NAME:
            return `Tỉnh/thành phố`;
        case StoreQuickFilterOptions.ADDRESS:
            return `Địa chỉ`;
        case StoreQuickFilterOptions.MODIFIED_ON:
            return `Ngày cập nhật`;
        case StoreQuickFilterOptions.WARD_NAME:
            return `Phường/xã`;
        case StoreQuickFilterOptions.PHONE_NUMBER:
            return `SĐT`;
        case StoreQuickFilterOptions.TOTAL_REVENUE:
            return `Tổng doanh thu`;
        case StoreQuickFilterOptions.TOTAL_FEE:
            return `Tổng phí`;
        default:
            return "";
    }
};

export const StoreStatus = {
    ACTIVE: "active",
    INACTIVE: "inactive",
};

export const getStoreStatusName = (status: string) => {
    switch (status) {
        case StoreStatus.ACTIVE:
            return "Đang làm việc";
        case StoreStatus.INACTIVE:
            return "Nghỉ việc";
    }
    return "";
};
