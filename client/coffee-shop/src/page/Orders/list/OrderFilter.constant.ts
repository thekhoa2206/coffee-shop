import i18next from "i18next";

const t = i18next.getFixedT(null, ["component", "accounts"]);
export const OrdersQuickFilterOptions = {
    CODE: "code",
    NAME: "name",
    PHONE: "phone",
    STATUS: "status",
    TOTAL: "total",
    DISCOUNT: "discount",
    ACCOUNT_NAME: "account_name",
    NOTE: "note",
    CREATED_ON: "createdOn",
    MODIFIED_ON: "modifieldOn",
    PAYMENT_STATUS: "payment_status",
};

export const getOrdersQuickFilterLabel = (key: string) => {
    switch (key) {
        case OrdersQuickFilterOptions.CODE:
            return `Mã đơn hàng`;
        case OrdersQuickFilterOptions.NAME:
            return `Tên KH`;
        case OrdersQuickFilterOptions.PHONE:
            return `Sđt KH`;
        case OrdersQuickFilterOptions.DISCOUNT:
            return `Chiết khấu`;
        case OrdersQuickFilterOptions.STATUS:
            return `Trạng thái`;
        case OrdersQuickFilterOptions.ACCOUNT_NAME:
            return `Nhân viên tạo`;
        case OrdersQuickFilterOptions.TOTAL:
            return `Tổng tiền`;
        case OrdersQuickFilterOptions.NOTE:
            return `Ghi chú`;
        case OrdersQuickFilterOptions.CREATED_ON:
            return `Ngày tạo`;
        case OrdersQuickFilterOptions.MODIFIED_ON:
            return `Ngày sửa`;
        case OrdersQuickFilterOptions.PAYMENT_STATUS:
            return `Thanh toán`;
        default:
            return "";
    }
};
