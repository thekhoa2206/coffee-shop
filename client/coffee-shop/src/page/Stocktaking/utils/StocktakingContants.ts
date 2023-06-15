export const ReeceiptStatus = {
    ORDER: 1,
    WAREHOUSE: 2,
    DELETED: 3,
    getName: (status?: number) => {
        switch (status) {
            case ReeceiptStatus.ORDER:
                return `Đặt hàng`;
            case ReeceiptStatus.WAREHOUSE:
                return `Nhập kho`;
            case ReeceiptStatus.DELETED:
                return `Đã hủy`;
            default:
                return "";
        }
    },
};
export const ExportStatus = {
    EXPORT: 2,
    DELETED: 3,
    getName: (status?: number) => {
        switch (status) {
            case ExportStatus.EXPORT:
                return `Xuất kho`;
            case ExportStatus.DELETED:
                return `Đã hủy`;
            default:
                return "";
        }
    },
};

export const PaymentStatus = {
    UNPAID: 1,
    PAID: 2,
    getName: (status?: number) => {
        switch (status) {
            case PaymentStatus.UNPAID:
                return `Chưa thanh toán`;
            case PaymentStatus.PAID:
                return `Đã thanh toán`;
            default:
                return "Chưa thanh toán";
        }
    },
};

export const StockingType = {
    IMPORT: "import",
    EXPORT: "export",
    getName: (type?: string) => {
        switch (type) {
            case StockingType.IMPORT:
                return `Nhập kho`;
            case StockingType.EXPORT:
                return `Xuất kho`;
            default:
                return "Kiểm kê";
        }
    },
};