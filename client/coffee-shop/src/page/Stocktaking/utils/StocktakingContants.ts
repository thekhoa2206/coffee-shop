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
    TRUE: true,
    FALSE: false,
    getName: (payment?: boolean) => {
        switch (payment) {
            case PaymentStatus.TRUE:
                return `Đã thanh toán `;
            case PaymentStatus.FALSE:
                return `Chưa thanh toán`;
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